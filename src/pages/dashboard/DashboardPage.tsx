import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import { getBalance } from "../../services/accountService";

interface BalanceData {
  account_number: string;
  balance: string;
  currency: string;
}

const quickActions = [
  {
    label: "Transfer", path: "/transfer",
    bg: "bg-blue-50", color: "text-[#0F2D52]",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  },
  {
    label: "Beneficiaries", path: "/beneficiaries",
    bg: "bg-violet-50", color: "text-violet-600",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6-2a3 3 0 11-6 0 3 3 0 016 0zM3 8a3 3 0 116 0 3 3 0 01-6 0z" /></svg>,
  },
  {
    label: "Transactions", path: "/transactions",
    bg: "bg-emerald-50", color: "text-emerald-600",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    label: "Support", path: "/support",
    bg: "bg-amber-50", color: "text-amber-600",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z" /></svg>,
  },
];

function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    fetchBalance();
    window.addEventListener("balance-updated", fetchBalance);
    return () => window.removeEventListener("balance-updated", fetchBalance);
  }, []);

  const fetchBalance = async () => {
    try {
      const data = await getBalance();
      setBalanceData(data);
    } catch { } finally {
      setLoading(false);
    }
  };

  const formattedBalance = balanceData
    ? Number(balanceData.balance).toLocaleString("en-NG", { minimumFractionDigits: 2 })
    : "0.00";

  const copyAccountNumber = () => {
    if (balanceData?.account_number) {
      navigator.clipboard.writeText(balanceData.account_number);
      toast.success("Account number copied!");
    }
  };

  return (
    <DashboardLayout>

      {/* ── Desktop: two-column layout ── */}
      <div className="max-w-6xl mx-auto">

        {/* Greeting */}
        <div className="mb-5">
          <p className="text-gray-400 text-sm">{greeting},</p>
          <h1 className="text-2xl font-bold text-[#0F2D52]">{firstName} 👋</h1>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-6 space-y-4 lg:space-y-0">

          {/* ── Left column ── */}
          <div className="space-y-4">

            {/* Balance Card */}
            <div className="bg-[#0F2D52] rounded-2xl p-5 relative overflow-hidden">
              {/* decorative circles */}
              <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-12 right-8 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

              <div className="relative z-10">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Available Balance</p>
                    <p className="text-blue-300 text-xs mt-0.5">{balanceData?.currency || "NGN"} Account</p>
                  </div>
                  <button
                    onClick={() => setBalanceVisible(v => !v)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
                  >
                    {balanceVisible ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Balance amount */}
                <div className="mb-5">
                  {loading ? (
                    <div className="h-9 w-48 bg-white/10 rounded-xl animate-pulse" />
                  ) : (
                    <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                      {balanceVisible ? `₦${formattedBalance}` : "₦ ••••••"}
                    </h2>
                  )}
                </div>

                {/* Account number pill */}
                <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-2.5">
                  <div>
                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Account Number</p>
                    <p className="text-white font-mono font-semibold tracking-wider text-sm mt-0.5">
                      {balanceData?.account_number || "—"}
                    </p>
                  </div>
                  <button
                    onClick={copyAccountNumber}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</p>
              <div className="grid grid-cols-4 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center transition-transform duration-150 group-hover:scale-105 group-active:scale-95 shadow-sm`}>
                      {action.icon}
                    </div>
                    <span className="text-xs font-semibold text-gray-600 group-hover:text-[#0F2D52] transition-colors">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <RecentTransactions />
          </div>

          {/* ── Right column (desktop only) ── */}
          <div className="hidden lg:flex flex-col gap-4">

            {/* Account Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account Summary</p>
              <div className="space-y-3">
                {[
                  { label: "Account Type", value: `${balanceData?.currency || "NGN"} Account` },
                  { label: "Account Number", value: balanceData?.account_number || "—", mono: true },
                  { label: "Total Balance", value: loading ? "…" : `₦${formattedBalance}`, bold: true },
                  { label: "Status", value: "Active", dot: true },
                ].map(({ label, value, mono, bold, dot }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className={`text-xs flex items-center gap-1.5 ${bold ? "font-bold text-[#0F2D52]" : "font-semibold text-gray-700"} ${mono ? "font-mono" : ""}`}>
                      {dot && <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />}
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invite & Earn */}
            <div className="bg-[#0F2D52] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-white font-bold text-base mb-1">Invite & Earn</p>
                <p className="text-blue-300 text-xs leading-relaxed mb-4">Invite your friends and earn rewards when they sign up.</p>
                <button
                  onClick={() => toast("Invite feature coming soon! 🎁")}
                  className="bg-white text-[#0F2D52] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-blue-50 transition"
                >
                  Invite Now
                </button>
              </div>
              {/* Gift emoji decoration */}
              <div className="absolute bottom-3 right-4 text-4xl select-none">🎁</div>
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;