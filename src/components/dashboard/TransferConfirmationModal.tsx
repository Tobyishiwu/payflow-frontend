import { useState } from "react";

interface Props {
  recipientName: string;
  accountNumber: string;
  amount: string;
  description: string;
  onConfirm: (pin: string) => void;
  onClose: () => void;
}

function TransferConfirmationModal({ recipientName, accountNumber, amount, description, onConfirm, onClose }: Props) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const formatted = Number(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Bottom sheet on mobile, centered modal on desktop */}
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pt-4 pb-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F2D52]">Confirm Transfer</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition text-gray-500 text-lg leading-none">×</button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Review and enter your PIN to proceed</p>
        </div>

        {/* Summary */}
        <div className="px-6 py-4 space-y-0">

          {/* Amount hero */}
          <div className="text-center py-4 mb-2">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">You are sending</p>
            <h1 className="text-4xl font-bold text-[#0F2D52]">₦{formatted}</h1>
          </div>

          {/* Details */}
          <div className="bg-slate-50 rounded-2xl divide-y divide-gray-100">
            {[
              { label: "To", value: recipientName },
              { label: "Account", value: accountNumber, mono: true },
              { label: "Description", value: description || "Transfer" },
              { label: "Fee", value: "₦0.00" },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex justify-between items-center px-4 py-3">
                <span className="text-xs text-gray-400">{label}</span>
                <span className={`text-xs font-semibold text-gray-800 text-right ${mono ? "font-mono" : ""}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PIN input */}
        <div className="px-6 pb-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Transaction PIN</label>
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              maxLength={4}
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • •"
              className="w-full border border-gray-200 rounded-xl px-4 pr-12 py-3.5 text-center text-xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-[#0F2D52] transition bg-slate-50"
            />
            <button
              type="button"
              onClick={() => setShowPin(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPin ? (
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

        {/* Actions */}
        <div className="px-6 pb-8 pt-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-200 text-gray-600 py-3.5 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(pin)}
            disabled={pin.length !== 4}
            className="flex-1 bg-[#0F2D52] text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-[#163b6b] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Money
          </button>
        </div>

      </div>
    </div>
  );
}

export default TransferConfirmationModal;