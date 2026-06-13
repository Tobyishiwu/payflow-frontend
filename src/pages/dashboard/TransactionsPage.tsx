import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getTransactions } from "../../services/transactionService";
import TransactionReceipt from "../../components/dashboard/TransactionReceipt";

interface Tx {
  id: number; reference: string; sender_account_id: number;
  receiver_account_id: number; amount: string; fee: string;
  type: string; status: string; description: string;
  created_at: string; updated_at: string;
}
type Filter = "all"|"credit"|"debit";

export default function TransactionsPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [accountId, setAccountId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Tx|null>(null);

  const load = async () => {
    try { const d = await getTransactions(); setTxs(d.transactions); setAccountId(d.account_id); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    window.addEventListener("transactions-updated", load);
    return () => window.removeEventListener("transactions-updated", load);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return txs.filter(tx => {
      const isCredit = tx.receiver_account_id === accountId;
      const mf = filter==="all"||(filter==="credit"&&isCredit)||(filter==="debit"&&!isCredit);
      const ms = !q||tx.reference.toLowerCase().includes(q)||(tx.description||"").toLowerCase().includes(q);
      return mf && ms;
    });
  }, [txs, search, filter, accountId]);

  const grouped = useMemo(() => {
    const g: Record<string, Tx[]> = {};
    for (const tx of filtered) {
      const k = new Date(tx.created_at).toLocaleDateString("en-NG", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
      if (!g[k]) g[k] = [];
      g[k].push(tx);
    }
    return g;
  }, [filtered]);

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#0F2D52]">Transactions</h1>
        <p className="text-sm text-gray-400 mt-0.5">Tap any row to see receipt</p>
      </div>

      {/* Search + filter */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 space-y-3">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></svg>
          <input type="text" placeholder="Search transactions..." value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52]" />
          {search && <button onClick={()=>setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl leading-none">×</button>}
        </div>
        <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
          {(["all","credit","debit"] as Filter[]).map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${filter===f?"bg-white text-[#0F2D52] shadow-sm":"text-gray-400"}`}>
              {f==="all"?"All":f==="credit"?"Credit":"Debit"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          {[...Array(5)].map((_,i)=>(
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0"/>
              <div className="flex-1 space-y-1.5"><div className="h-3 bg-gray-100 rounded w-2/5"/><div className="h-2.5 bg-gray-100 rounded w-1/4"/></div>
              <div className="h-3 bg-gray-100 rounded w-16"/>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <p className="text-sm text-gray-500 font-semibold">No transactions found</p>
          {(search||filter!=="all")&&<button onClick={()=>{setSearch("");setFilter("all");}} className="text-xs text-[#0F2D52] font-bold mt-2 hover:underline">Clear filters</button>}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([date, list])=>(
            <div key={date}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">{date}</p>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {list.map((tx,i)=>{
                  const isCredit = tx.receiver_account_id===accountId;
                  const amt = Number(tx.amount).toLocaleString("en-NG",{minimumFractionDigits:2});
                  const time = new Date(tx.created_at).toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"});
                  return (
                    <button key={tx.id} type="button" onClick={()=>setSelected(tx)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left group ${i!==list.length-1?"border-b border-gray-100":""}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-base ${isCredit?"bg-emerald-50 text-emerald-600":"bg-red-50 text-red-500"}`}>{isCredit?"↓":"↑"}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{tx.description||"Transfer"}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${isCredit?"text-emerald-600":"text-red-500"}`}>{isCredit?"+":"−"}₦{amt}</p>
                        <p className={`text-[10px] font-semibold mt-0.5 ${tx.status==="completed"?"text-emerald-500":"text-amber-500"}`}>{tx.status}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <TransactionReceipt transaction={selected} accountId={accountId} onClose={()=>setSelected(null)} />}
    </DashboardLayout>
  );
}