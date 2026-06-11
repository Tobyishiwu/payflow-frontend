import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { lookupAccount } from "../../services/accountLookupService";
import { getBeneficiaries } from "../../services/beneficiaryService";
import TransferConfirmationModal from "../../components/dashboard/TransferConfirmationModal";

interface Beneficiary {
  id: string | number;
  account_number: string;
  beneficiary_name: string;
}

const AVATAR_COLORS = [
  "bg-[#0F2D52]",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-sky-600",
];

// Consistent color per person based on their name, not list position
function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function TransferPage() {
  const [searchParams] = useSearchParams();

  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // API returns newest-first (ordered by updated_at) — no client-side reversal needed
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [recipientSearch, setRecipientSearch] = useState("");

  useEffect(() => {
    loadBeneficiaries();

    const account = searchParams.get("account");
    if (account) {
      setReceiverAccountNumber(account);
      handleLookup(account);
    }
  }, []);

  const loadBeneficiaries = async () => {
    try {
      const data = await getBeneficiaries();
      // API already returns newest-first via ->latest('updated_at')
      setBeneficiaries(data);
    } catch (error) {
      console.error(error);
    }
  };

  // No search → show top 3 most recent. Searching → search ALL beneficiaries.
  const displayedBeneficiaries = useMemo(() => {
    const query = recipientSearch.trim().toLowerCase();
    if (!query) return beneficiaries.slice(0, 3);
    return beneficiaries.filter(
      (b) =>
        b.beneficiary_name.toLowerCase().includes(query) ||
        b.account_number.includes(query)
    );
  }, [beneficiaries, recipientSearch]);

  const isSearching = recipientSearch.trim().length > 0;

  const handleLookup = async (accountNumber: string) => {
    if (accountNumber.length < 10) {
      setRecipientName("");
      return;
    }
    try {
      const data = await lookupAccount(accountNumber);
      setRecipientName(data.account_name);
    } catch {
      setRecipientName("");
      toast.error("Recipient account not found");
    }
  };

  const handleAccountNumberChange = (value: string) => {
    setReceiverAccountNumber(value);
    handleLookup(value);
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setReceiverAccountNumber(beneficiary.account_number);
    setRecipientName(beneficiary.beneficiary_name);
    setRecipientSearch("");
    handleLookup(beneficiary.account_number);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName) {
      toast.error("Please enter a valid recipient");
      return;
    }
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }
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

      setReceiverAccountNumber("");
      setRecipientName("");
      setAmount("");
      setDescription("");
      setRecipientSearch("");

      await loadBeneficiaries();

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      const message: string = error?.response?.data?.message || "";
      const lower = message.toLowerCase();

      if (lower.includes("insufficient")) {
        toast.error("Insufficient balance", { id: "transfer" });
      } else if (lower.includes("pin")) {
        toast.error("Invalid transaction PIN", { id: "transfer" });
      } else if (lower.includes("recipient")) {
        toast.error("Recipient account not found", { id: "transfer" });
      } else {
        toast.error(message || "Transfer failed", { id: "transfer" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0F2D52]">Transfer Money</h1>
          <p className="text-gray-500 mt-2">Send money securely to another PayFlow account.</p>
        </div>

        <div className="bg-white rounded-3xl shadow p-8">
          <form onSubmit={handleTransfer} className="space-y-6">

            {/* Recipient Account Number */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Recipient Account Number
              </label>
              <input
                type="text"
                value={receiverAccountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                placeholder="Enter account number"
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition"
                required
              />
              {recipientName && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <p className="text-green-700 font-semibold text-sm">{recipientName}</p>
                </div>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional note"
                rows={3}
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition resize-none"
              />
            </div>

            {/* Recent Recipients */}
            {beneficiaries.length > 0 && (
              <div className="border-t pt-6">

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#0F2D52] text-sm uppercase tracking-wide">
                    Recent Recipients
                  </h3>
                  <span className="text-xs text-gray-400">
                    {isSearching
                      ? `${displayedBeneficiaries.length} result${displayedBeneficiaries.length !== 1 ? "s" : ""}`
                      : "Last 3"}
                  </span>
                </div>

                {/* Search — scans ALL beneficiaries */}
                <div className="relative mb-4">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    value={recipientSearch}
                    onChange={(e) => setRecipientSearch(e.target.value)}
                    placeholder="Search all recipients..."
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition bg-slate-50"
                  />
                  {isSearching && (
                    <button
                      type="button"
                      onClick={() => setRecipientSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none transition"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Cards */}
                {displayedBeneficiaries.length > 0 ? (
                  <div className="grid gap-3">
                    {displayedBeneficiaries.map((beneficiary) => (
                      <button
                        key={beneficiary.id}
                        type="button"
                        onClick={() => handleBeneficiarySelect(beneficiary)}
                        className="w-full text-left bg-slate-50 border border-slate-200 hover:border-[#0F2D52] hover:bg-blue-50 rounded-2xl p-4 transition-all duration-150 group"
                      >
                        <div className="flex items-center gap-4">

                          <div className={`w-12 h-12 rounded-full ${getAvatarColor(beneficiary.beneficiary_name)} text-white flex items-center justify-center font-bold text-lg shrink-0`}>
                            {beneficiary.beneficiary_name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-800 truncate">
                              {beneficiary.beneficiary_name}
                            </p>
                            <p className="text-sm text-gray-400 mt-0.5 font-mono tracking-wide">
                              {beneficiary.account_number}
                            </p>
                          </div>

                          <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <span className="text-xs text-[#0F2D52] bg-blue-100 px-3 py-1 rounded-full font-semibold">
                              Send
                            </span>
                          </div>

                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-400">No recipients match "{recipientSearch}"</p>
                    <button
                      type="button"
                      onClick={() => setRecipientSearch("")}
                      className="text-xs text-[#0F2D52] font-medium mt-1 hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !recipientName}
              className="w-full bg-[#0F2D52] text-white py-4 rounded-xl font-semibold hover:bg-[#163b6b] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Transfer Money"
              )}
            </button>

          </form>
        </div>
      </div>

      {showConfirmation && (
        <TransferConfirmationModal
          recipientName={recipientName}
          accountNumber={receiverAccountNumber}
          amount={amount}
          description={description}
          onClose={() => setShowConfirmation(false)}
          onConfirm={(pin) => {
            setShowConfirmation(false);
            performTransfer(pin);
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default TransferPage;
