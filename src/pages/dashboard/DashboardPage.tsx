import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getBalance } from "../../services/accountService";
import RecentTransactions from "../../components/dashboard/RecentTransactions";

interface BalanceData { account_number: string; balance: string; currency: string; }

const ACTIONS = [
  { label: "Transfer", path: "/transfer", bg: "bg-blue-50", color: "text-[#0F2D52]",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg> },
  { label: "Beneficiaries", path: "/beneficiaries", bg: "bg-violet-50", color: "text-violet-600",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6-2a3 3 0 11-6 0 3 3 0 016 0zM3 8a3 3 0 116 0 3 3 0 01-6 0z"/></svg> },
  { label: "Transactions", path: "/transactions", bg: "bg-emerald-50", color: "text-emerald-600",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { label: "Support", path: "/support", bg: "bg-amber-50", color: "text-amber-600",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg> },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [data, setData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch();
    window.addEventListener("balance-updated", fetch);
    return () => window.removeEventListener("balance-updated", fetch);
  }, []);

  const fetch = async () => {
    try { const d = await getBalance(); setData(d); } catch {} finally { setLoading(false); }
  };

  const balance = data ? Number(data.balance).toLocaleString("en-NG", { minimumFractionDigits: 2 }) : "0.00";

  const copy = () => {
    if (data?.account_number) { navigator.clipboard.writeText(data.account_number); toast.success("Copied!"); }
  };

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="mb-4">
        <p className="text-sm text-gray-400">{greeting},</p>
        <h1 className="text-xl font-bold text-[#0F2D52]">{firstName} 👋</h1>
      </div>

      {/* Balance card */}
      <div className="bg-[#0F2D52] rounded-2xl p-5 mb-4 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 right-6 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Available Balance</p>
              <p className="text-blue-300 text-xs mt-0.5">{data?.currency || "NGN"} Account</p>
            </div>
            <button onClick={() => setVisible(v => !v)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              {visible
                ? <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                : <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18"/></svg>}
            </button>
          </div>
          {loading
            ? <div className="h-9 w-40 bg-white/10 rounded-xl animate-pulse mb-4" />
            : <h2 className="text-3xl font-bold text-white mb-4">{visible ? `₦${balance}` : "₦ ••••••"}</h2>}
          <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-2.5">
            <div>
              <p className="text-[9px] font-bold text-blue-300 uppercase tracking-widest">Account Number</p>
              <p className="text-white font-mono font-semibold text-sm mt-0.5">{data?.account_number || "—"}</p>
            </div>
            <button onClick={copy} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="grid grid-cols-4 gap-2">
          {ACTIONS.map(a => (
            <button key={a.label} onClick={() => navigate(a.path)} className="flex flex-col items-center gap-1.5">
              <div className={`w-14 h-14 rounded-2xl ${a.bg} ${a.color} flex items-center justify-center shadow-sm active:scale-95 transition-transform`}>{a.icon}</div>
              <span className="text-[11px] font-semibold text-gray-600">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <RecentTransactions />
    </DashboardLayout>
  );
}