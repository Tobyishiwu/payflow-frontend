import { useState } from "react";
import api from "../../api/axios";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState("");

  const [
    transactionPin,
    setTransactionPin,
  ] = useState("");

  const [
    transactionPinConfirmation,
    setTransactionPinConfirmation,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await api.post(
          "/register",
          {
            name,
            email,
            password,
            password_confirmation:
              passwordConfirmation,
            transaction_pin:
              transactionPin,
            transaction_pin_confirmation:
              transactionPinConfirmation,
          }
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      window.location.href =
        "/dashboard";
    } catch (err: any) {
      setError(
        err?.response?.data
          ?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F7F9FC]">

      {/* Left Branding Panel */}
{/* Left Marketing Section */}

<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0F2D52] via-[#163B6B] to-[#2D6CDF] text-white">

  {/* Background Effects */}

  <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />

  <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

  <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

  <div className="relative z-10 flex flex-col justify-center px-16">

    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 w-fit mb-8">
      🚀 Nigeria's Next Digital Banking Experience
    </div>

    <h1 className="text-6xl font-bold leading-tight">
      Banking
      <br />
      Without
      <br />
      Boundaries
    </h1>

    <p className="mt-8 text-xl text-blue-100 max-w-xl leading-relaxed">
      Send money instantly, save trusted beneficiaries,
      receive real-time notifications and manage your
      finances from one secure platform.
    </p>

    <div className="grid grid-cols-2 gap-4 mt-12">

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
        ⚡ Instant Transfers
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
        🔒 Secure PIN Protection
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
        🔔 Real-Time Alerts
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
        👥 Smart Beneficiaries
      </div>

    </div>

    <div className="mt-12 border-l-4 border-blue-300 pl-6">
      <p className="text-blue-100 italic text-lg">
        "The future of digital banking is simple,
        secure and built around people."
      </p>

      <p className="mt-3 text-blue-200">
                            — Built by Toby Ishiwu
      </p>
    </div>

  </div>

</div>

      {/* Form Section */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">

<div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10">
         <h2 className="text-4xl font-bold text-[#0F2D52]">
  Create Account
</h2>

<p className="text-gray-500 mt-2">
  Join thousands of users choosing a smarter way to bank.
</p>

          <p className="text-gray-500 mt-2">
            Open your PayFlow account
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-xl mt-6">
              {error}
            </div>
          )}

          <form
            onSubmit={
              handleRegister
            }
            className="mt-8 space-y-4"
          >

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={
                passwordConfirmation
              }
              onChange={(e) =>
                setPasswordConfirmation(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4"
              required
            />

            <input
              type="password"
              maxLength={4}
              placeholder="Transaction PIN"
              value={transactionPin}
              onChange={(e) =>
                setTransactionPin(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4"
              required
            />

            <input
              type="password"
              maxLength={4}
              placeholder="Confirm PIN"
              value={
                transactionPinConfirmation
              }
              onChange={(e) =>
                setTransactionPinConfirmation(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F2D52] text-white py-4 rounded-xl font-medium"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

            <p className="text-center text-gray-500">
              Already have an
              account?{" "}
              <a
                href="/login"
                className="text-[#0F2D52] font-semibold"
              >
                Sign In
              </a>
            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;