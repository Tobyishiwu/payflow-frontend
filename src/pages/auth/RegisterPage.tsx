import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

interface Field {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  maxLength?: number;
  value: string;
  onChange: (v: string) => void;
  showToggle?: boolean;
}

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [transactionPin, setTransactionPin] = useState("");
  const [transactionPinConfirmation, setTransactionPinConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Individual show/hide per password field
  const [showFields, setShowFields] = useState<Record<string, boolean>>({});
  const toggleShow = (id: string) =>
    setShowFields((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        transaction_pin: transactionPin,
        transaction_pin_confirmation: transactionPinConfirmation,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields: Field[] = [
    {
      id: "name",
      label: "Full Name",
      placeholder: "e.g. Toby Ishiwu",
      type: "text",
      value: name,
      onChange: setName,
    },
    {
      id: "email",
      label: "Email Address",
      placeholder: "you@example.com",
      type: "email",
      value: email,
      onChange: setEmail,
    },
    {
      id: "password",
      label: "Password",
      placeholder: "Create a strong password",
      type: "password",
      value: password,
      onChange: setPassword,
      showToggle: true,
    },
    {
      id: "passwordConfirmation",
      label: "Confirm Password",
      placeholder: "Repeat your password",
      type: "password",
      value: passwordConfirmation,
      onChange: setPasswordConfirmation,
      showToggle: true,
    },
    {
      id: "transactionPin",
      label: "Transaction PIN",
      placeholder: "4-digit PIN for transfers",
      type: "password",
      maxLength: 4,
      value: transactionPin,
      onChange: setTransactionPin,
      showToggle: true,
    },
    {
      id: "transactionPinConfirmation",
      label: "Confirm Transaction PIN",
      placeholder: "Repeat your PIN",
      type: "password",
      maxLength: 4,
      value: transactionPinConfirmation,
      onChange: setTransactionPinConfirmation,
      showToggle: true,
    },
  ];

  const EyeIcon = ({ open }: { open: boolean }) => open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

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
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-blue-300 mt-1 text-sm">Join thousands banking smarter with PayFlow</p>
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
              Open your account in minutes. Send money instantly, manage beneficiaries and stay on top of your finances.
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
        <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-6 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-md">

            {/* Desktop header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-4xl font-bold text-[#0F2D52]">Create Account</h2>
              <p className="text-gray-400 mt-2">Join thousands banking smarter with PayFlow.</p>
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

              <form onSubmit={handleRegister} className="space-y-4">

                {/* Section: Personal Info */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-1">Personal Info</p>

                {fields.slice(0, 2).map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      maxLength={field.maxLength}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition bg-slate-50"
                      required
                    />
                  </div>
                ))}

                {/* Section: Password */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-1 pt-2">Password</p>

                {fields.slice(2, 4).map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    <div className="relative">
                      <input
                        type={showFields[field.id] ? "text" : "password"}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition bg-slate-50"
                        required
                      />
                      <button type="button" onClick={() => toggleShow(field.id)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                        <EyeIcon open={!!showFields[field.id]} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Section: Transaction PIN */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-1 pt-2">Transaction PIN</p>
                <p className="text-xs text-gray-400 -mt-2">Used to authorise every transfer. Keep it secret.</p>

                {fields.slice(4).map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    <div className="relative">
                      <input
                        type={showFields[field.id] ? "text" : "password"}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        maxLength={field.maxLength}
                        inputMode="numeric"
                        className="w-full border border-gray-200 rounded-xl px-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition bg-slate-50 tracking-[0.5em] font-mono"
                        required
                      />
                      <button type="button" onClick={() => toggleShow(field.id)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                        <EyeIcon open={!!showFields[field.id]} />
                      </button>
                    </div>
                  </div>
                ))}

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
                      Creating Account...
                    </>
                  ) : "Create Account"}
                </button>

              </form>

              <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-[#0F2D52] font-semibold hover:underline">
                  Sign In
                </Link>
              </p>

            </div>

            <p className="text-center text-xs text-gray-300 mt-6 pb-8">
              PayFlow · Banking Without Boundaries
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;