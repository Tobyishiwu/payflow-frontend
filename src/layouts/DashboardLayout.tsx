import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUnreadCount } from "../services/notificationService";

interface Props { children: React.ReactNode; }

const NAV = [
  { label: "Home", path: "/dashboard",
    icon: (a: boolean) => <svg className="w-6 h-6" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth={a?0:1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
  { label: "Services", path: "/services",
    icon: (a: boolean) => <svg className="w-6 h-6" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth={a?0:1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg> },
  { label: "Alerts", path: "/notifications",
    icon: (a: boolean) => <svg className="w-6 h-6" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth={a?0:1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg> },
  { label: "Profile", path: "/settings",
    icon: (a: boolean) => <svg className="w-6 h-6" fill={a?"currentColor":"none"} stroke="currentColor" strokeWidth={a?0:1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
];

export default function DashboardLayout({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user?.name ? user.name.split(" ").map((n:string)=>n[0]).join("").slice(0,2).toUpperCase() : "PF";

  useEffect(() => {
    load();
    window.addEventListener("notifications-updated", load);
    return () => window.removeEventListener("notifications-updated", load);
  }, []);

  useEffect(() => { window.scrollTo({top:0}); }, [location.pathname]);

  const load = async () => { try { setUnread(await getUnreadCount()); } catch {} };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F2D52] flex items-center justify-center">
            <span className="text-white text-xs font-black">PF</span>
          </div>
          <span className="font-bold text-[#0F2D52] text-base">PayFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/notifications")} className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread > 9 ? "9+" : unread}</span>}
          </button>
          <button onClick={() => navigate("/settings")} className="w-9 h-9 rounded-xl bg-[#0F2D52] text-white text-xs font-bold flex items-center justify-center">{initials}</button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pt-4 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-1 px-4 py-1 relative">
                {active && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#0F2D52] rounded-full" />}
                <span className={active ? "text-[#0F2D52]" : "text-gray-400"}>{item.icon(active)}</span>
                <span className={`text-[10px] font-semibold ${active ? "text-[#0F2D52]" : "text-gray-400"}`}>{item.label}</span>
                {item.label === "Alerts" && unread > 0 && (
                  <span className="absolute top-0 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread > 9 ? "9+" : unread}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}