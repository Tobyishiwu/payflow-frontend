import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { changePassword, changePin } from "../../services/settingsService";

type Section = "password" | "pin" | null;

function SettingsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "PF";

  const [activeSection, setActiveSection] = useState<Section>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  // PIN fields
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loadingPin, setLoadingPin] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!currentPassword) return toast.error("Enter your current password");
    if (!newPassword) return toast.error("Enter a new password");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    setLoadingPassword(true);
    try {
      const response = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      toast.success(response.message || "Password updated successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setActiveSection(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update password");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handlePinUpdate = async () => {
    if (!currentPin) return toast.error("Enter your current PIN");
    if (!newPin) return toast.error("Enter a new PIN");
    if (newPin.length !== 4) return toast.error("PIN must be 4 digits");
    if (newPin !== confirmPin) return toast.error("PINs do not match");

    setLoadingPin(true);
    try {
      const response = await changePin({
        current_pin: currentPin,
        new_pin: newPin,
        new_pin_confirmation: confirmPin,
      });
      toast.success(response.message || "PIN updated successfully");
      setCurrentPin(""); setNewPin(""); setConfirmPin("");
      setActiveSection(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update PIN");
    } finally {
      setLoadingPin(false);
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
    <DashboardLayout>
      <div className="max-w-md mx-auto space-y-5 pb-4">

        {/* Profile card */}
        <div className="bg-[#0F2D52] rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-8 -right-2 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 ring-4 ring-white/10 flex items-center justify-center text-2xl font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold truncate">{user?.name || "User"}</p>
              <p className="text-blue-300 text-sm truncate mt-0.5">{user?.email || ""}</p>
              <span className="inline-block mt-2 text-xs font-semibold bg-white/15 px-2.5 py-0.5 rounded-full">
                Personal Account
              </span>
            </div>
          </div>
        </div>

        {/* Security section */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Security</p>
          </div>

          {/* Change Password row */}
          <div className="border-t border-gray-100">
            <button
              onClick={() => setActiveSection(activeSection === "password" ? null : "password")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#0F2D52]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800 text-sm">Change Password</p>
                  <p className="text-xs text-gray-400 mt-0.5">Update your login password</p>
                </div>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${activeSection === "password" ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {activeSection === "password" && (
              <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
                {[
                  { placeholder: "Current Password", value: currentPassword, onChange: setCurrentPassword },
                  { placeholder: "New Password", value: newPassword, onChange: setNewPassword },
                  { placeholder: "Confirm New Password", value: confirmPassword, onChange: setConfirmPassword },
                ].map(({ placeholder, value, onChange }) => (
                  <input
                    key={placeholder}
                    type="password"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition"
                  />
                ))}
                <button
                  onClick={handlePasswordUpdate}
                  disabled={loadingPassword}
                  className="w-full bg-[#0F2D52] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#163b6b] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingPassword ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Updating...
                    </>
                  ) : "Update Password"}
                </button>
              </div>
            )}
          </div>

          {/* Change PIN row */}
          <div className="border-t border-gray-100">
            <button
              onClick={() => setActiveSection(activeSection === "pin" ? null : "pin")}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800 text-sm">Change Transaction PIN</p>
                  <p className="text-xs text-gray-400 mt-0.5">Update your 4-digit transfer PIN</p>
                </div>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${activeSection === "pin" ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {activeSection === "pin" && (
              <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
                {[
                  { placeholder: "Current PIN", value: currentPin, onChange: setCurrentPin },
                  { placeholder: "New PIN", value: newPin, onChange: setNewPin },
                  { placeholder: "Confirm New PIN", value: confirmPin, onChange: setConfirmPin },
                ].map(({ placeholder, value, onChange }) => (
                  <input
                    key={placeholder}
                    type="password"
                    maxLength={4}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition"
                  />
                ))}
                <button
                  onClick={handlePinUpdate}
                  disabled={loadingPin}
                  className="w-full bg-[#0F2D52] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#163b6b] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingPin ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Updating...
                    </>
                  ) : "Update PIN"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* More options */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">More</p>
          </div>

          {[
            {
              label: "Support",
              subtitle: "Get help or report an issue",
              path: "/support",
              iconBg: "bg-amber-50",
              icon: (
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.label} className="border-t border-gray-100">
              <button
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl ${item.iconBg} flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-500 font-semibold py-4 rounded-2xl hover:bg-red-50 hover:border-red-200 transition shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>

        <p className="text-center text-xs text-gray-300 pb-2">PayFlow v1.0 · Banking Without Boundaries</p>

      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;