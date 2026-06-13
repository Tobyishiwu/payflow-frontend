import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

const COLORS = ["bg-[#0F2D52]","bg-emerald-600","bg-violet-600","bg-rose-600","bg-amber-600","bg-sky-600"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [pin, setPin] = useState("");
  const [pinConf, setPinConf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState<Record<string,boolean>>({});
  const toggle = (k: string) => setShow(p=>({...p,[k]:!p[k]}));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const r = await api.post("/register", {
        name, email, password,
        password_confirmation: passwordConf,
        transaction_pin: pin,
        transaction_pin_confirmation: pinConf,
      });
      localStorage.setItem("token", r.data.token);
      localStorage.setItem("user", JSON.stringify(r.data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  const EyeBtn = ({ k }: { k: string }) => (
    <button type="button" onClick={()=>toggle(k)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
      {show[k]
        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18"/></svg>
        : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0F2D52] flex flex-col">
      {/* Brand */}
      <div className="px-6 pt-12 pb-8 text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none"/>
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl font-black">PF</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-blue-300 mt-1 text-sm">Join thousands banking smarter</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 bg-[#F0F2F5] rounded-t-3xl px-6 pt-6 pb-12 overflow-y-auto">
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-4 text-sm">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Personal info */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Personal Info</p>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
            <input type="text" placeholder="e.g. Toby Ishiwu" value={name} onChange={e=>setName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] shadow-sm" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] shadow-sm" required />
          </div>

          {/* Password */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">Password</p>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
            <div className="relative">
              <input type={show.pw?"text":"password"} placeholder="Create a strong password" value={password} onChange={e=>setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] shadow-sm" required />
              <EyeBtn k="pw"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input type={show.cpw?"text":"password"} placeholder="Repeat your password" value={passwordConf} onChange={e=>setPasswordConf(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] shadow-sm" required />
              <EyeBtn k="cpw"/>
            </div>
          </div>

          {/* PIN */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">Transaction PIN</p>
          <p className="text-xs text-gray-400 -mt-3">Used to authorise every transfer. Keep it secret.</p>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">4-digit PIN</label>
            <div className="relative">
              <input type={show.pin?"text":"password"} placeholder="• • • •" maxLength={4} inputMode="numeric"
                value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,""))}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 pr-12 py-4 text-center text-xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-[#0F2D52] shadow-sm" required />
              <EyeBtn k="pin"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm PIN</label>
            <div className="relative">
              <input type={show.cpin?"text":"password"} placeholder="• • • •" maxLength={4} inputMode="numeric"
                value={pinConf} onChange={e=>setPinConf(e.target.value.replace(/\D/g,""))}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 pr-12 py-4 text-center text-xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-[#0F2D52] shadow-sm" required />
              <EyeBtn k="cpin"/>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#0F2D52] text-white py-4 rounded-2xl font-bold text-sm active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
            {loading ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Creating Account...</>) : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0F2D52] font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}