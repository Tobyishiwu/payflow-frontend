import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    label: "Transfer",
    path: "/transfer",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-4 4m4-4l4 4M5 12H2m20 0h-3M7 17l-2 2m12-2l2 2" />
      </svg>
    ),
    color: "bg-blue-50 text-[#0F2D52]",
  },
  {
    label: "Beneficiaries",
    path: "/beneficiaries",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6-2a3 3 0 11-6 0 3 3 0 016 0zM3 8a3 3 0 116 0 3 3 0 01-6 0z" />
      </svg>
    ),
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Support",
    path: "/support",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z" />
      </svg>
    ),
    color: "bg-amber-50 text-amber-600",
  },
];

function DashboardPage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formattedBalance = balanceData
    ? Number(balanceData.balance).toLocaleString("en-NG", { minimumFractionDigits: 2 })
    : "0.00";

  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Greeting */}
        <div>
          <p className="text-gray-400 text-sm">{greeting},</p>
          <h1 className="text-2xl font-bold text-[#0F2D52]">{firstName} 👋</h1>
        </div>

        {/* Balance Card */}
        <div className="relative bg-[#0F2D52] rounded-3xl p-7 text-white overflow-hidden">

          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-10 -right-4 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10">

            {/* Top row */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-blue-200 text-xs uppercase tracking-widest font-medium">
                  Available Balance
                </p>
                <p className="text-blue-300 text-sm mt-0.5">
                  {balanceData?.currency || "NGN"} Account
                </p>
              </div>
              <button
                onClick={() => setBalanceVisible((v) => !v)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
                title={balanceVisible ? "Hide balance" : "Show balance"}
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

            {/* Balance */}
            <div className="mb-6">
              {loading ? (
                <div className="h-10 w-48 bg-white/10 rounded-xl animate-pulse" />
              ) : (
                <h2 className="text-4xl font-bold tracking-tight">
                  {balanceVisible ? `₦${formattedBalance}` : "₦ ••••••"}
                </h2>
              )}
            </div>

            {/* Account number */}
            <div className="flex items-center justify-between bg-white/10 rounded-2xl px-4 py-3">
              <div>
                <p className="text-blue-200 text-xs uppercase tracking-widest">Account Number</p>
                <p className="text-white font-mono font-semibold tracking-wider mt-0.5">
                  {balanceData?.account_number || "—"}
                </p>
              </div>
              <button
                onClick={() => {
                  if (balanceData?.account_number) {
                    navigator.clipboard.writeText(balanceData.account_number);
                  }
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
                title="Copy account number"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-6 shadow">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-5">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${action.color} transition-transform duration-150 group-hover:scale-105 group-active:scale-95 shadow-sm`}
                >
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-[#0F2D52] transition-colors">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <RecentTransactions />

      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;