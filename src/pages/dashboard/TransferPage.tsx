import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { lookupAccount } from "../../services/accountLookupService";
import { getBeneficiaries } from "../../services/beneficiaryService";
import { getBalance } from "../../services/accountService";
import TransferConfirmationModal from "../../components/dashboard/TransferConfirmationModal";

interface Beneficiary { id: string|number; account_number: string; beneficiary_name: string; }

const COLORS = ["bg-[#0F2D52]","bg-emerald-600","bg-violet-600","bg-rose-600","bg-amber-600","bg-sky-600"];
const avatarColor = (name: string) => COLORS[name.charCodeAt(0) % COLORS.length];
const QUICK = [1000, 5000, 10000];

export default function TransferPage() {
  const [searchParams] = useSearchParams();
  const [acctNo, setAcctNo] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderAcct, setSenderAcct] = useState("");

  useEffect(() => {
    loadBeneficiaries();
    loadSender();
    const a = searchParams.get("account");
    if (a) { setAcctNo(a); lookup(a); }
  }, []);

  const loadSender = async () => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setSenderName(u?.name || "");
    try { const d = await getBalance(); setSenderAcct(d.account_number); } catch {}
  };

  const loadBeneficiaries = async () => {
    try { const d = await getBeneficiaries(); setBeneficiaries(d); } catch {}
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? beneficiaries.filter(b => b.beneficiary_name.toLowerCase().includes(q) || b.account_number.includes(q))
      : beneficiaries.slice(0, 5);
  }, [beneficiaries, search]);

  const lookup = async (num: string) => {
    if (num.length < 10) { setRecipientName(""); return; }
    try { const d = await lookupAccount(num); setRecipientName(d.account_name); }
    catch { setRecipientName(""); toast.error("Recipient not found"); }
  };

  const selectBeneficiary = (b: Beneficiary) => {
    setAcctNo(b.account_number);
    setRecipientName(b.beneficiary_name);
    setSearch(""); setShowList(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName) { toast.error("Select a valid recipient"); return; }
    if (!amount || Number(amount) <= 0) { toast.error("Enter a valid amount"); return; }
    setShowConfirm(true);
  };

  const performTransfer = async (pin: string) => {
    setLoading(true);
    toast.loading("Processing...", { id: "t" });
    try {
      const r = await api.post("/transfers", {
        receiver_account_number: acctNo, amount: Number(amount),
        description, transaction_pin: pin,
      });
      toast.success(r.data.message || "Transfer successful", { id: "t" });
      ["transactions-updated","balance-updated","notifications-updated"].forEach(e => window.dispatchEvent(new Event(e)));
      setAcctNo(""); setRecipientName(""); setAmount(""); setDescription("");
      await loadBeneficiaries();
    } catch (err: any) {
      const msg = (err?.response?.data?.message || "").toLowerCase();
      if (msg.includes("insufficient")) toast.error("Insufficient balance", { id: "t" });
      else if (msg.includes("pin")) toast.error("Invalid PIN", { id: "t" });
      else if (msg.includes("recipient")) toast.error("Recipient not found", { id: "t" });
      else toast.error(err?.response?.data?.message || "Transfer failed", { id: "t" });
    } finally { setLoading(false); }
  };

  const total = Number(amount);

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#0F2D52]">Transfer Money</h1>
        <p className="text-sm text-gray-400 mt-0.5">Send money securely to any PayFlow user</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* FROM */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">From</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F2D52] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {senderName.charAt(0).toUpperCase() || "Y"}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{senderName || "Your Account"}</p>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{senderAcct || "—"}</p>
            </div>
          </div>
        </div>

        {/* TO */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">To</p>
          {recipientName ? (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <div className={`w-9 h-9 rounded-full ${avatarColor(recipientName)} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                {recipientName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-green-800 text-sm truncate">{recipientName}</p>
                <p className="text-xs text-green-600 font-mono mt-0.5">{acctNo}</p>
              </div>
              <button type="button" onClick={() => { setRecipientName(""); setAcctNo(""); }} className="text-green-400 text-xl leading-none">×</button>
            </div>
          ) : (
            <>
              <input type="text" value={acctNo} onChange={e => { setAcctNo(e.target.value); lookup(e.target.value); }}
                placeholder="Enter account number"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] bg-slate-50" />
              {beneficiaries.length > 0 && (
                <div>
                  <button type="button" onClick={() => setShowList(v => !v)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-[#0F2D52] py-1">
                    <span>Recent beneficiaries</span>
                    <svg className={`w-4 h-4 transition-transform ${showList ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  {showList && (
                    <div className="mt-2 space-y-1.5">
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></svg>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search beneficiaries..."
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2D52] bg-slate-50" />
                      </div>
                      <div className="max-h-44 overflow-y-auto space-y-1">
                        {filtered.map(b => (
                          <button key={b.id} type="button" onClick={() => selectBeneficiary(b)}
                            className="w-full flex items-center gap-3 hover:bg-slate-50 rounded-xl px-2 py-2.5 transition">
                            <div className={`w-8 h-8 rounded-full ${avatarColor(b.beneficiary_name)} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                              {b.beneficiary_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left min-w-0 flex-1">
                              <p className="text-xs font-semibold text-gray-800 truncate">{b.beneficiary_name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">{b.account_number}</p>
                            </div>
                            <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
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
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₦</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
              className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] bg-slate-50" required />
          </div>
          <div className="flex gap-2">
            {QUICK.map(q => (
              <button key={q} type="button" onClick={() => setAmount(String(q))}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${amount === String(q) ? "bg-[#0F2D52] text-white border-[#0F2D52]" : "border-gray-200 text-gray-600"}`}>
                ₦{q.toLocaleString()}
              </button>
            ))}
            <button type="button" onClick={() => setAmount("")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${amount && !QUICK.includes(Number(amount)) ? "bg-[#0F2D52] text-white border-[#0F2D52]" : "border-gray-200 text-gray-600"}`}>
              Other
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Note <span className="normal-case font-normal">(optional)</span></p>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="What's this for?"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] bg-slate-50" />
        </div>

        {/* SUMMARY */}
        {recipientName && amount && (
          <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Summary</p>
            {[["To", recipientName],["Amount",`₦${total.toLocaleString("en-NG",{minimumFractionDigits:2})}`],["Fee","₦0.00"],["Total",`₦${total.toLocaleString("en-NG",{minimumFractionDigits:2})}`]].map(([l,v])=>(
              <div key={l} className="flex justify-between"><span className="text-xs text-gray-400">{l}</span><span className="text-xs font-semibold text-gray-800">{v}</span></div>
            ))}
          </div>
        )}

        <button type="submit" disabled={loading || !recipientName || !amount}
          className="w-full bg-[#0F2D52] text-white py-4 rounded-2xl font-semibold text-sm active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Processing...</>) : "Continue"}
        </button>
      </form>

      {showConfirm && (
        <TransferConfirmationModal
          recipientName={recipientName} accountNumber={acctNo}
          amount={amount} description={description}
          onClose={() => setShowConfirm(false)}
          onConfirm={pin => { setShowConfirm(false); performTransfer(pin); }} />
      )}
    </DashboardLayout>
  );
}