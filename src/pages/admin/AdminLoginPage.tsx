import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

function AdminLoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response =
        await api.post(
          "/admin/login",
          {
            email,
            password,
          }
        );

      localStorage.setItem(
        "admin_token",
        response.data.token
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(
          response.data.admin
        )
      );

      toast.success(
        "Welcome Admin"
      );

      window.location.href =
        "/admin/dashboard";

    } catch (error: any) {

      toast.error(
        error?.response?.data
          ?.message ||
          "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">

      <div className="absolute w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -top-40 -left-40" />

      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl bottom-0 right-0" />

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            PayFlow
          </h1>

          <p className="text-blue-300 mt-2">
            Admin Portal
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full p-4 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none focus:border-blue-500"
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
            className="w-full p-4 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition"
          >
            {loading
              ? "Signing In..."
              : "Login to Admin Portal"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminLoginPage;