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

type Filter = "all" | "credit" | "debit";

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accountId, setAccountId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Transaction | null>(null);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data.transactions);
      setAccountId(data.account_id);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadTransactions();
    window.addEventListener("transactions-updated", loadTransactions);
    return () => window.removeEventListener("transactions-updated", loadTransactions);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter((tx) => {
      const isCredit = tx.receiver_account_id === accountId;
      const matchFilter = filter === "all" || (filter === "credit" && isCredit) || (filter === "debit" && !isCredit);
      const matchSearch = !q || tx.reference.toLowerCase().includes(q) || (tx.description || "").toLowerCase().includes(q) || tx.status.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [transactions, search, filter, accountId]);

  const grouped = useMemo(() => {
    const g: Record<string, Transaction[]> = {};
    for (const tx of filtered) {
      const key = new Date(tx.created_at).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      if (!g[key]) g[key] = [];
      g[key].push(tx);
    }
    return g;
  }, [filtered]);

  const tabs: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Credit", value: "credit" },
    { label: "Debit", value: "debit" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[#0F2D52]">Transactions</h1>
          <p className="text-gray-400 text-sm mt-0.5">Tap any transaction to view its receipt</p>
        </div>

        {/* Search + filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 space-y-3">
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by description or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === tab.value
                    ? "bg-white text-[#0F2D52] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-2/5" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="h-3.5 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-semibold text-sm">No transactions found</p>
            {(search || filter !== "all") && (
              <button onClick={() => { setSearch(""); setFilter("all"); }} className="text-xs text-[#0F2D52] font-semibold mt-2 hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([date, txs]) => (
              <div key={date}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">{date}</p>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {txs.map((tx, idx) => {
                    const isCredit = tx.receiver_account_id === accountId;
                    const formatted = Number(tx.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 });
                    const time = new Date(tx.created_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });

                    return (
                      <button
                        key={tx.id}
                        type="button"
                        onClick={() => setSelected(tx)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left group ${idx !== txs.length - 1 ? "border-b border-gray-100" : ""}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-base transition-transform group-hover:scale-105 ${isCredit ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                          {isCredit ? "↓" : "↑"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 text-sm truncate">{tx.description || "Transfer"}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`font-bold text-sm ${isCredit ? "text-emerald-600" : "text-red-500"}`}>
                            {isCredit ? "+" : "−"}₦{formatted}
                          </p>
                          <p className={`text-[10px] font-semibold mt-0.5 ${tx.status === "completed" ? "text-emerald-500" : "text-amber-500"}`}>
                            {tx.status}
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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

      {selected && (
        <TransactionReceipt
          transaction={selected}
          accountId={accountId}
          onClose={() => setSelected(null)}
        />
      )}
    </DashboardLayout>
  );
}

export default TransactionsPage;