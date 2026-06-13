import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { changePassword, changePin } from "../../services/settingsService";

type Section = "password"|"pin"|null;

export default function SettingsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user?.name ? user.name.split(" ").map((n:string)=>n[0]).join("").slice(0,2).toUpperCase() : "PF";

  const [section, setSection] = useState<Section>(null);
  const [curPw, setCurPw] = useState(""); const [newPw, setNewPw] = useState(""); const [confPw, setConfPw] = useState("");
  const [curPin, setCurPin] = useState(""); const [newPin, setNewPin] = useState(""); const [confPin, setConfPin] = useState("");
  const [loadingPw, setLoadingPw] = useState(false);
  const [loadingPin, setLoadingPin] = useState(false);

  const updatePassword = async () => {
    if (!curPw) { toast.error("Enter current password"); return; }
    if (!newPw) { toast.error("Enter new password"); return; }
    if (newPw !== confPw) { toast.error("Passwords don't match"); return; }
    setLoadingPw(true);
    try {
      const r = await changePassword({ current_password: curPw, new_password: newPw, new_password_confirmation: confPw });
      toast.success(r.message || "Password updated");
      setCurPw(""); setNewPw(""); setConfPw(""); setSection(null);
    } catch (e: any) { toast.error(e?.response?.data?.message || "Failed"); }
    finally { setLoadingPw(false); }
  };

  const updatePin = async () => {
    if (!curPin) { toast.error("Enter current PIN"); return; }
    if (newPin.length !== 4) { toast.error("PIN must be 4 digits"); return; }
    if (newPin !== confPin) { toast.error("PINs don't match"); return; }
    setLoadingPin(true);
    try {
      const r = await changePin({ current_pin: curPin, new_pin: newPin, new_pin_confirmation: confPin });
      toast.success(r.message || "PIN updated");
      setCurPin(""); setNewPin(""); setConfPin(""); setSection(null);
    } catch (e: any) { toast.error(e?.response?.data?.message || "Failed"); }
    finally { setLoadingPin(false); }
  };

  const logout = async () => {
    try { await api.post("/logout"); } catch {}
    finally { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); }
  };

  const Input = ({ type="password", placeholder, value, onChange, maxLength }: any) => (
    <input type={type} placeholder={placeholder} value={value} onChange={(e:any)=>onChange(e.target.value)} maxLength={maxLength}
      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] bg-slate-50" />
  );

  const Spinner = () => <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>;

  return (
    <DashboardLayout>
      {/* Profile card */}
      <div className="bg-[#0F2D52] rounded-2xl p-5 mb-4 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none"/>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 ring-4 ring-white/10 flex items-center justify-center text-2xl font-bold text-white shrink-0">{initials}</div>
          <div className="min-w-0">
            <p className="text-white font-bold text-base truncate">{user?.name || "User"}</p>
            <p className="text-blue-300 text-xs truncate mt-0.5">{user?.email || ""}</p>
            <span className="inline-block mt-1.5 text-[10px] font-bold bg-white/15 text-blue-200 px-2.5 py-0.5 rounded-full">Personal Account</span>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-3">
        <div className="px-4 pt-4 pb-2"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Security</p></div>

        {/* Password */}
        <div className="border-t border-gray-100">
          <button onClick={()=>setSection(section==="password"?null:"password")}
            className="w-full flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0F2D52]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Change Password</p>
                <p className="text-xs text-gray-400 mt-0.5">Update your login password</p>
              </div>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${section==="password"?"rotate-180":""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          {section==="password" && (
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
              <Input placeholder="Current Password" value={curPw} onChange={setCurPw}/>
              <Input placeholder="New Password" value={newPw} onChange={setNewPw}/>
              <Input placeholder="Confirm New Password" value={confPw} onChange={setConfPw}/>
              <button onClick={updatePassword} disabled={loadingPw}
                className="w-full bg-[#0F2D52] text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingPw ? <><Spinner/>Updating...</> : "Update Password"}
              </button>
            </div>
          )}
        </div>

        {/* PIN */}
        <div className="border-t border-gray-100">
          <button onClick={()=>setSection(section==="pin"?null:"pin")}
            className="w-full flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Change Transaction PIN</p>
                <p className="text-xs text-gray-400 mt-0.5">Update your 4-digit transfer PIN</p>
              </div>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${section==="pin"?"rotate-180":""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          {section==="pin" && (
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
              <Input placeholder="Current PIN" value={curPin} onChange={setCurPin} maxLength={4}/>
              <Input placeholder="New PIN" value={newPin} onChange={setNewPin} maxLength={4}/>
              <Input placeholder="Confirm New PIN" value={confPin} onChange={setConfPin} maxLength={4}/>
              <button onClick={updatePin} disabled={loadingPin}
                className="w-full bg-[#0F2D52] text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingPin ? <><Spinner/>Updating...</> : "Update PIN"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* More */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="px-4 pt-4 pb-2"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">More</p></div>
        <div className="border-t border-gray-100">
          <button onClick={()=>navigate("/support")} className="w-full flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Support</p>
                <p className="text-xs text-gray-400 mt-0.5">Get help or report an issue</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      {/* Sign out */}
      <button onClick={logout}
        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-500 font-semibold py-4 rounded-2xl active:scale-[0.99] transition-all shadow-sm mb-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        Sign Out
      </button>
      <p className="text-center text-xs text-gray-300 pb-2">PayFlow v1.0 · Banking Without Boundaries</p>
    </DashboardLayout>
  );
}