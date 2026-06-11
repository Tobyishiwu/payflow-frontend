import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getTransactions } from "../../services/transactionService";
import TransactionReceipt from "../../components/dashboard/TransactionReceipt";

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

type FilterType = "all" | "credit" | "debit";

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accountId, setAccountId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data.transactions);
      setAccountId(data.account_id);
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    window.addEventListener("transactions-updated", loadTransactions);
    return () => window.removeEventListener("transactions-updated", loadTransactions);
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.reference.toLowerCase().includes(query) ||
        (tx.description || "").toLowerCase().includes(query) ||
        tx.status.toLowerCase().includes(query);

      const isCredit = tx.receiver_account_id === accountId;
      const matchesFilter =
        filter === "all" ||
        (filter === "credit" && isCredit) ||
        (filter === "debit" && !isCredit);

      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter, accountId]);

  // Group transactions by date
  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    for (const tx of filtered) {
      const dateKey = new Date(tx.created_at).toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(tx);
    }
    return groups;
  }, [filtered]);

  const filterTabs: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Money In", value: "credit" },
    { label: "Money Out", value: "debit" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0F2D52]">Transaction History</h1>
          <p className="text-gray-500 mt-2">Tap any transaction to view its receipt.</p>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-3xl shadow p-5 mb-6 space-y-4">

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by description, reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  filter === tab.value
                    ? "bg-[#0F2D52] text-white shadow-sm"
                    : "bg-slate-100 text-gray-500 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-3xl shadow p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-2/5" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl shadow p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No transactions found</p>
            {(search || filter !== "all") && (
              <button
                onClick={() => { setSearch(""); setFilter("all"); }}
                className="text-sm text-[#0F2D52] font-semibold mt-2 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, txs]) => (
              <div key={date}>

                {/* Date group label */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1 mb-3">
                  {date}
                </p>

                <div className="bg-white rounded-3xl shadow overflow-hidden">
                  {txs.map((tx, idx) => {
                    const isCredit = tx.receiver_account_id === accountId;
                    const formattedAmount = Number(tx.amount).toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                    });
                    const formattedTime = new Date(tx.created_at).toLocaleTimeString("en-NG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <button
                        key={tx.id}
                        type="button"
                        onClick={() => setSelectedTransaction(tx)}
                        className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors duration-150 group text-left ${
                          idx !== txs.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-lg transition-transform duration-150 group-hover:scale-105 ${
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
                          <p className="text-xs text-gray-400 mt-0.5 font-mono">{tx.reference}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formattedTime}</p>
                        </div>

                        {/* Amount + status */}
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

                        {/* Chevron */}
                        <svg
                          className="w-4 h-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    );
                  })}
                </div>

              </div>
            ))}
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
    </DashboardLayout>
  );
}

export default TransactionsPage;
