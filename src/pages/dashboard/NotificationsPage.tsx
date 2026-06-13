import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "../../services/notificationService";

interface N { id: number; title: string; message: string; is_read: boolean; created_at: string; }

export default function NotificationsPage() {
  const [list, setList] = useState<N[]>([]);
  const [expanded, setExpanded] = useState<number|null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number|null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const d = await getNotifications(); setList(d); }
    catch {} finally { setLoading(false); }
  };

  const open = async (n: N) => {
    setExpanded(expanded===n.id ? null : n.id);
    if (!n.is_read) {
      try { await markAsRead(n.id); await load(); } catch {}
    }
  };

  const del = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeletingId(id);
    try { await deleteNotification(id); await load(); } catch {} finally { setDeletingId(null); }
  };

  const markAll = async () => {
    try { await markAllAsRead(); await load(); } catch {}
  };

  const unread = list.filter(n=>!n.is_read).length;

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F2D52]">Notifications</h1>
          <p className="text-sm text-gray-400 mt-0.5">{unread > 0 ? `${unread} unread` : "All caught up"}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="text-xs font-bold text-[#0F2D52] border-2 border-[#0F2D52] px-3 py-1.5 rounded-xl">
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_,i)=>(
            <div key={i} className="bg-white rounded-2xl p-4 flex gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0"/>
              <div className="flex-1 space-y-2"><div className="h-3 bg-gray-100 rounded w-1/3"/><div className="h-2.5 bg-gray-100 rounded w-2/3"/></div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </div>
          <p className="text-sm text-gray-500 font-semibold">No notifications yet</p>
          <p className="text-xs text-gray-400 mt-1">Account activity will show here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map(n => (
            <div key={n.id} onClick={()=>open(n)}
              className={`bg-white rounded-2xl shadow-sm border cursor-pointer transition-all ${!n.is_read?"border-blue-200 border-l-4 border-l-blue-500":"border-gray-100"}`}>
              <div className="flex items-start gap-3 p-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${!n.is_read?"bg-blue-50":"bg-slate-100"}`}>
                  <svg className={`w-5 h-5 ${!n.is_read?"text-blue-500":"text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"/>}
                    <p className={`text-sm font-semibold truncate ${!n.is_read?"text-[#0F2D52]":"text-gray-700"}`}>{n.title}</p>
                  </div>
                  <p className={`text-xs text-gray-500 ${expanded===n.id?"":"line-clamp-2"}`}>{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1.5">
                    {new Date(n.created_at).toLocaleString("en-NG",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                  </p>
                </div>
                <button onClick={e=>del(e,n.id)} disabled={deletingId===n.id}
                  className="w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center shrink-0 disabled:opacity-50">
                  {deletingId===n.id
                    ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                    : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}