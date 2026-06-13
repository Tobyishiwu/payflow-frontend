import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getBeneficiaries, deleteBeneficiary } from "../../services/beneficiaryService";

interface B { id: number; beneficiary_name: string; account_number: string; }
const COLORS = ["bg-[#0F2D52]","bg-emerald-600","bg-violet-600","bg-rose-600","bg-amber-600","bg-sky-600"];
const avatarColor = (name: string) => COLORS[name.charCodeAt(0) % COLORS.length];

export default function BeneficiariesPage() {
  const navigate = useNavigate();
  const [list, setList] = useState<B[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number|null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const d = await getBeneficiaries(); setList([...d].reverse()); }
    catch {} finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? list.filter(b => b.beneficiary_name.toLowerCase().includes(q)||b.account_number.includes(q)) : list;
  }, [list, search]);

  const del = async (id: number) => {
    setDeletingId(id);
    try { await deleteBeneficiary(id); await load(); } catch {} finally { setDeletingId(null); }
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#0F2D52]">Beneficiaries</h1>
        <p className="text-sm text-gray-400 mt-0.5">Your saved recipients</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></svg>
        <input type="text" placeholder="Search by name or account..." value={search} onChange={e=>setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-10 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] shadow-sm" />
        {search && <button onClick={()=>setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl leading-none">×</button>}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          {[...Array(4)].map((_,i)=>(
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-100 shrink-0"/>
              <div className="flex-1 space-y-1.5"><div className="h-3 bg-gray-100 rounded w-1/3"/><div className="h-2.5 bg-gray-100 rounded w-1/4"/></div>
              <div className="h-8 bg-gray-100 rounded-xl w-16"/>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <p className="text-sm text-gray-500 font-semibold">{search ? `No results for "${search}"` : "No beneficiaries yet"}</p>
          {!search && <p className="text-xs text-gray-400 mt-1">They're saved automatically after a transfer</p>}
          {search && <button onClick={()=>setSearch("")} className="text-xs text-[#0F2D52] font-bold mt-2 hover:underline">Clear search</button>}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filtered.map((b,i)=>(
            <div key={b.id} className={`flex items-center gap-3 px-4 py-4 ${i!==filtered.length-1?"border-b border-gray-100":""}`}>
              <div className={`w-12 h-12 rounded-full ${avatarColor(b.beneficiary_name)} text-white flex items-center justify-center font-bold text-lg shrink-0`}>
                {b.beneficiary_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{b.beneficiary_name}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{b.account_number}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={()=>navigate(`/transfer?account=${b.account_number}`)}
                  className="flex items-center gap-1.5 bg-[#0F2D52] text-white text-xs font-semibold px-3 py-2 rounded-xl active:scale-95 transition-transform">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  Send
                </button>
                <button onClick={()=>del(b.id)} disabled={deletingId===b.id}
                  className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform">
                  {deletingId===b.id
                    ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && list.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-3">{filtered.length} of {list.length} beneficiar{list.length!==1?"ies":"y"}</p>
      )}
    </DashboardLayout>
  );
}