import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Mobile top band */}
      <div className="lg:hidden bg-[#0F2D52] px-6 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-4 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-5">
            <span className="text-white text-sm font-black">PF</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-blue-300 mt-1 text-sm">Sign in to your PayFlow account</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Desktop left panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F2D52] via-[#163B6B] to-[#2D6CDF] text-white relative overflow-hidden flex-col justify-center px-16">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-8">
              <span className="text-white font-black text-lg">PF</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 text-sm">
              🚀 Nigeria's Next Digital Banking Experience
            </div>

            <h1 className="text-6xl font-bold leading-tight">
              Banking<br />Without<br />Boundaries
            </h1>

            <p className="mt-6 text-lg text-blue-100 leading-relaxed max-w-md">
              Send money instantly, manage beneficiaries, receive real-time alerts — all from one secure platform.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-10">
              {[
                { icon: "⚡", label: "Instant Transfers" },
                { icon: "🔒", label: "Secure PIN Protection" },
                { icon: "🔔", label: "Real-Time Alerts" },
                { icon: "👥", label: "Smart Beneficiaries" },
              ].map((f) => (
                <div key={f.label} className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-4 flex items-center gap-3 text-sm font-medium">
                  <span className="text-xl">{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>

            <div className="mt-12 border-l-4 border-blue-300 pl-6">
              <p className="text-blue-100 italic">"The future of digital banking is simple, secure and built around people."</p>
              <p className="mt-2 text-blue-300 text-sm">— Built by Toby Ishiwu</p>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">

            {/* Desktop header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-4xl font-bold text-[#0F2D52]">Welcome Back</h2>
              <p className="text-gray-400 mt-2">Sign in to access your PayFlow account.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 lg:p-10">

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition bg-slate-50"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition bg-slate-50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F2D52] hover:bg-[#163B6B] active:scale-[0.99] text-white py-4 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Signing In...
                    </>
                  ) : "Sign In"}
                </button>

              </form>

              {/* Footer */}
              <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#0F2D52] font-semibold hover:underline">
                  Create Account
                </Link>
              </p>

            </div>

            <p className="text-center text-xs text-gray-300 mt-6">
              PayFlow · Banking Without Boundaries
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;