import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { lookupAccount } from "../../services/accountLookupService";
import { getBeneficiaries } from "../../services/beneficiaryService";
import { getBalance } from "../../services/accountService";
import TransferConfirmationModal from "../../components/dashboard/TransferConfirmationModal";

interface Beneficiary {
  id: string | number;
  account_number: string;
  beneficiary_name: string;
}

const AVATAR_COLORS = [
  "bg-[#0F2D52]", "bg-emerald-600", "bg-violet-600",
  "bg-rose-600", "bg-amber-600", "bg-sky-600",
];

function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

const QUICK_AMOUNTS = [1000, 5000, 10000];

function TransferPage() {
  const [searchParams] = useSearchParams();

  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [showBeneficiaryList, setShowBeneficiaryList] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderAccount, setSenderAccount] = useState("");

  useEffect(() => {
    loadBeneficiaries();
    loadSenderInfo();
    const account = searchParams.get("account");
    if (account) {
      setReceiverAccountNumber(account);
      handleLookup(account);
    }
  }, []);

  const loadSenderInfo = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setSenderName(user?.name || "");
      const data = await getBalance();
      setSenderAccount(data.account_number);
    } catch {}
  };

  const loadBeneficiaries = async () => {
    try {
      const data = await getBeneficiaries();
      setBeneficiaries(data);
    } catch (error) { console.error(error); }
  };

  const filteredBeneficiaries = useMemo(() => {
    const q = recipientSearch.trim().toLowerCase();
    const list = q
      ? beneficiaries.filter(b =>
          b.beneficiary_name.toLowerCase().includes(q) ||
          b.account_number.includes(q)
        )
      : beneficiaries.slice(0, 5);
    return list;
  }, [beneficiaries, recipientSearch]);

  const handleLookup = async (accountNumber: string) => {
    if (accountNumber.length < 10) { setRecipientName(""); return; }
    try {
      const data = await lookupAccount(accountNumber);
      setRecipientName(data.account_name);
    } catch {
      setRecipientName("");
      toast.error("Recipient account not found");
    }
  };

  const handleAccountInput = (value: string) => {
    setReceiverAccountNumber(value);
    handleLookup(value);
  };

  const handleBeneficiarySelect = (b: Beneficiary) => {
    setReceiverAccountNumber(b.account_number);
    setRecipientName(b.beneficiary_name);
    setRecipientSearch("");
    setShowBeneficiaryList(false);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName) { toast.error("Please select a valid recipient"); return; }
    if (!amount || Number(amount) <= 0) { toast.error("Please enter a valid amount"); return; }
    setShowConfirmation(true);
  };

  const performTransfer = async (transactionPin: string) => {
    setLoading(true);
    toast.loading("Processing transfer...", { id: "transfer" });
    try {
      const response = await api.post("/transfers", {
        receiver_account_number: receiverAccountNumber,
        amount: Number(amount),
        description,
        transaction_pin: transactionPin,
      });
      toast.success(response.data.message || "Transfer successful", { id: "transfer" });
      window.dispatchEvent(new Event("transactions-updated"));
      window.dispatchEvent(new Event("balance-updated"));
      window.dispatchEvent(new Event("notifications-updated"));
      setReceiverAccountNumber(""); setRecipientName("");
      setAmount(""); setDescription(""); setRecipientSearch("");
      await loadBeneficiaries();
    } catch (error: any) {
      const msg: string = error?.response?.data?.message || "";
      const lower = msg.toLowerCase();
      if (lower.includes("insufficient")) toast.error("Insufficient balance", { id: "transfer" });
      else if (lower.includes("pin")) toast.error("Invalid transaction PIN", { id: "transfer" });
      else if (lower.includes("recipient")) toast.error("Recipient account not found", { id: "transfer" });
      else toast.error(msg || "Transfer failed", { id: "transfer" });
    } finally { setLoading(false); }
  };

  const fee = 0;
  const total = Number(amount) + fee;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[#0F2D52]">Transfer Money</h1>
          <p className="text-gray-400 text-sm mt-0.5">Send money to your beneficiaries or other PayFlow users</p>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-6">

          {/* ── Form ── */}
          <form onSubmit={handleTransfer} className="space-y-3">

            {/* FROM */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">From</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F2D52] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {senderName.charAt(0).toUpperCase() || "Y"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{senderName || "Your Account"}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{senderAccount || "—"}</p>
                </div>
              </div>
            </div>

            {/* TO */}
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">To</p>

              {/* Selected recipient preview */}
              {recipientName ? (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                  <div className={`w-9 h-9 rounded-full ${getAvatarColor(recipientName)} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                    {recipientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-800 text-sm truncate">{recipientName}</p>
                    <p className="text-xs text-green-600 font-mono mt-0.5">{receiverAccountNumber}</p>
                  </div>
                  <button type="button" onClick={() => { setRecipientName(""); setReceiverAccountNumber(""); }} className="text-green-400 hover:text-green-600 text-xl leading-none">×</button>
                </div>
              ) : (
                <>
                  {/* Account number input */}
                  <input
                    type="text"
                    value={receiverAccountNumber}
                    onChange={(e) => handleAccountInput(e.target.value)}
                    placeholder="Enter account number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition bg-slate-50"
                  />

                  {/* Beneficiary search */}
                  {beneficiaries.length > 0 && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowBeneficiaryList(v => !v)}
                        className="flex items-center justify-between w-full text-xs font-semibold text-[#0F2D52] py-1"
                      >
                        <span>Select from beneficiaries</span>
                        <svg className={`w-4 h-4 transition-transform ${showBeneficiaryList ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showBeneficiaryList && (
                        <div className="mt-2 space-y-1.5">
                          <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                            </svg>
                            <input
                              type="text"
                              value={recipientSearch}
                              onChange={(e) => setRecipientSearch(e.target.value)}
                              placeholder="Search beneficiaries..."
                              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2D52] bg-slate-50"
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto space-y-1">
                            {filteredBeneficiaries.map((b) => (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => handleBeneficiarySelect(b)}
                                className="w-full flex items-center gap-3 hover:bg-slate-50 rounded-xl px-2 py-2.5 transition group"
                              >
                                <div className={`w-8 h-8 rounded-full ${getAvatarColor(b.beneficiary_name)} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                                  {b.beneficiary_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-gray-800 truncate">{b.beneficiary_name}</p>
                                  <p className="text-[10px] text-gray-400 font-mono">{b.account_number}</p>
                                </div>
                                <svg className="w-4 h-4 text-gray-300 group-hover:text-[#0F2D52] transition" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* AMOUNT */}
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition bg-slate-50"
                  required
                />
              </div>
              {/* Quick amounts */}
              <div className="flex gap-2">
                {QUICK_AMOUNTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(String(q))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                      amount === String(q)
                        ? "bg-[#0F2D52] text-white border-[#0F2D52]"
                        : "border-gray-200 text-gray-600 hover:border-[#0F2D52] hover:text-[#0F2D52]"
                    }`}
                  >
                    ₦{q.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmount("")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                    amount && !QUICK_AMOUNTS.includes(Number(amount))
                      ? "bg-[#0F2D52] text-white border-[#0F2D52]"
                      : "border-gray-200 text-gray-600 hover:border-[#0F2D52] hover:text-[#0F2D52]"
                  }`}
                >
                  Other
                </button>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description <span className="normal-case font-normal">(optional)</span></p>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this for?"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition bg-slate-50"
              />
            </div>

            {/* Mobile summary (shown only on mobile) */}
            {recipientName && amount && (
              <div className="lg:hidden bg-slate-50 border border-gray-200 rounded-2xl p-4 space-y-2.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transfer Summary</p>
                {[
                  { label: "From", value: senderName },
                  { label: "To", value: recipientName },
                  { label: "Amount", value: `₦${Number(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}` },
                  { label: "Fee", value: "₦0.00" },
                  { label: "Total", value: `₦${total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`, bold: true },
                ].map(({ label, value, bold }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className={`text-xs ${bold ? "font-bold text-[#0F2D52]" : "font-semibold text-gray-700"}`}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !recipientName || !amount}
              className="w-full bg-[#0F2D52] text-white py-4 rounded-2xl font-semibold hover:bg-[#163b6b] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Processing...
                </>
              ) : "Continue"}
            </button>

          </form>

          {/* ── Desktop Transfer Summary panel ── */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Transfer Summary</p>

              {recipientName && amount ? (
                <div className="space-y-3">
                  {[
                    { label: "From", value: senderName, sub: senderAccount },
                    { label: "To", value: recipientName, sub: receiverAccountNumber },
                    { label: "Amount", value: `₦${Number(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}` },
                    { label: "Fee", value: "₦0.00" },
                    { label: "Total", value: `₦${total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`, bold: true },
                  ].map(({ label, value, sub, bold }) => (
                    <div key={label} className={`flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0 ${bold ? "pt-3" : ""}`}>
                      <span className="text-xs text-gray-400">{label}</span>
                      <div className="text-right">
                        <p className={`text-xs ${bold ? "font-bold text-[#0F2D52] text-sm" : "font-semibold text-gray-700"}`}>{value}</p>
                        {sub && <p className="text-[10px] text-gray-400 font-mono mt-0.5">{sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400">Fill in the form to see your transfer summary</p>
                </div>
              )}

              {/* Secure transfer note */}
              <div className="mt-5 flex items-start gap-2 bg-blue-50 rounded-xl p-3">
                <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-[10px] text-blue-600 leading-relaxed">Your transfer is protected with 256-bit SSL encryption</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showConfirmation && (
        <TransferConfirmationModal
          recipientName={recipientName}
          accountNumber={receiverAccountNumber}
          amount={amount}
          description={description}
          onClose={() => setShowConfirmation(false)}
          onConfirm={(pin) => { setShowConfirmation(false); performTransfer(pin); }}
        />
      )}
    </DashboardLayout>
  );
}

export default TransferPage;