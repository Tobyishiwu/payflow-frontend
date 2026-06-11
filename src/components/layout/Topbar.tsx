import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUnreadCount } from "../../services/notificationService";
import api from "../../services/api";

const pageTitles: Record<string, string> = {
  "/dashboard": "PayFlow",
  "/transfer": "Transfer Money",
  "/beneficiaries": "Beneficiaries",
  "/transactions": "Transactions",
  "/loans": "Loans",
  "/notifications": "Notifications",
  "/support": "Support",
  "/settings": "Profile & Settings",
};

// Pages where back arrow shows instead of logo/title
const subPages = [
  "/transfer", "/beneficiaries", "/transactions",
  "/loans", "/support", "/settings",
];

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "PF";

  const isSubPage = subPages.includes(location.pathname);
  const pageTitle = pageTitles[location.pathname] || "PayFlow";

  useEffect(() => {
    loadUnreadCount();
    window.addEventListener("notifications-updated", loadUnreadCount);
    return () => window.removeEventListener("notifications-updated", loadUnreadCount);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4">

        {/* Left: back button on sub-pages, brand on home */}
        <div className="flex items-center gap-3">
          {isSubPage ? (
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition"
            >
              <svg className="w-5 h-5 text-[#0F2D52]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-[#0F2D52] flex items-center justify-center">
              <span className="text-white text-xs font-black tracking-tight">PF</span>
            </div>
          )}
          <h1 className={`font-bold text-[#0F2D52] ${isSubPage ? "text-base" : "text-lg"}`}>
            {pageTitle}
          </h1>
        </div>

        {/* Right: bell + avatar */}
        <div className="flex items-center gap-1.5">

          {/* Notification bell */}
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Avatar — tapping logs out via a simple confirm, or navigate to settings */}
          <button
            onClick={() => navigate("/settings")}
            className="w-9 h-9 rounded-xl bg-[#0F2D52] text-white text-xs font-bold flex items-center justify-center hover:bg-[#163b6b] transition"
            title={user?.name}
          >
            {initials}
          </button>

        </div>
      </div>
    </header>
  );
}

export default Topbar;