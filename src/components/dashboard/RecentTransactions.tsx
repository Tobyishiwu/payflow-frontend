import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import TransactionReceipt from "./TransactionReceipt";

interface Tx {
  id: number; reference: string; sender_account_id: number;
  receiver_account_id: number; amount: string; fee: string;
  type: string; status: string; description: string;
  created_at: string; updated_at: string;
}

export default function RecentTransactions() {
  const navigate = useNavigate();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [accountId, setAccountId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Tx | null>(null);

  const load = async () => {
    try {
      const r = await api.get("/transactions");
      setTxs(r.data.transactions.slice(0, 5));
      setAccountId(r.data.account_id);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    window.addEventListener("transactions-updated", load);
    return () => window.removeEventListener("transactions-updated", load);
  }, []);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Transactions</p>
          <button onClick={() => navigate("/transactions")} className="text-xs text-[#0F2D52] font-bold">View All</button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded w-2/5" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="h-3 bg-gray-100 rounded w-14" />
              </div>
            ))}
          </div>
        ) : txs.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            </div>
            <p className="text-xs text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {txs.map((tx, i) => {
              const isCredit = tx.receiver_account_id === accountId;
              const amt = Number(tx.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 });
              const date = new Date(tx.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
              return (
                <button key={tx.id} type="button" onClick={() => setSelected(tx)}
                  className="w-full flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-base ${isCredit ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                    {isCredit ? "↓" : "↑"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{tx.description || "Transfer"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                  </div>
                  <p className={`text-sm font-bold shrink-0 ${isCredit ? "text-emerald-600" : "text-red-500"}`}>
                    {isCredit ? "+" : "−"}₦{amt}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected && <TransactionReceipt transaction={selected} accountId={accountId} onClose={() => setSelected(null)} />}
    </>
  );
}