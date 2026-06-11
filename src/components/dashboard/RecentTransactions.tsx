import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import TransactionReceipt from "./TransactionReceipt";

interface Transaction {
  id: number;
  reference: string;
  sender_account_id: number;
  receiver_account_id: number;
  amount: string;
  fee: string;
  type: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
}

function RecentTransactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accountId, setAccountId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data.transactions.slice(0, 5));
      setAccountId(response.data.account_id);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    window.addEventListener("transactions-updated", fetchTransactions);
    return () => window.removeEventListener("transactions-updated", fetchTransactions);
  }, []);

  return (
    <>
      <div className="bg-white rounded-3xl shadow p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
          <button
            onClick={() => navigate("/transactions")}
            className="text-sm text-[#0F2D52] font-semibold hover:underline"
          >
            View All
          </button>
        </div>

        {/* States */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-2/5" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((tx) => {
              const isCredit = tx.receiver_account_id === accountId;
              const formattedAmount = Number(tx.amount).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
              });
              const formattedDate = new Date(tx.created_at).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => setSelectedTransaction(tx)}
                  className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors duration-150 group text-left"
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-lg font-bold transition-transform duration-150 group-hover:scale-105 ${
                      isCredit
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {isCredit ? "↓" : "↑"}
                  </div>

                  {/* Label */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {tx.description || "Transfer"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formattedDate}</p>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p
                      className={`font-bold text-sm ${
                        isCredit ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {isCredit ? "+" : "−"}₦{formattedAmount}
                    </p>
                    <span
                      className={`text-xs font-medium ${
                        tx.status === "completed" ? "text-green-500" : "text-yellow-500"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>

                  {/* Chevron hint */}
                  <svg
                    className="w-4 h-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {selectedTransaction && (
        <TransactionReceipt
          transaction={selectedTransaction}
          accountId={accountId}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </>
  );
}

export default RecentTransactions;
