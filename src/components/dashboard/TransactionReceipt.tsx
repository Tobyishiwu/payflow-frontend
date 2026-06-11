import { generateReceipt } from "../../utils/generateReceipt";

interface Transaction {
  id: number;
  reference: string;
  sender_account_id: number;
  receiver_account_id: number;
  amount: string;
  fee: string;
  type: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ReceiptProps {
  transaction: Transaction;
  accountId: number;
  onClose: () => void;
}

function TransactionReceipt({ transaction, accountId, onClose }: ReceiptProps) {
  if (!transaction) return null;

  const isCredit = transaction.receiver_account_id === accountId;
  const formattedAmount = Number(transaction.amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
  });
  const formattedFee = Number(transaction.fee || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
  });
  const formattedDate = new Date(transaction.created_at).toLocaleString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const rows = [
    { label: "Transaction Type", value: isCredit ? "Money Received" : "Money Sent" },
    { label: "Description", value: transaction.description || "Transfer" },
    { label: "Reference", value: transaction.reference, mono: true },
    { label: "Fee", value: `₦${formattedFee}` },
    { label: "Date & Time", value: formattedDate },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slide-up">

        {/* Header band */}
        <div className={`p-8 text-center ${isCredit ? "bg-emerald-600" : "bg-[#0F2D52]"}`}>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/10">
            <span className="text-3xl text-white">{isCredit ? "↓" : "↑"}</span>
          </div>
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">
            {isCredit ? "Received" : "Sent"}
          </p>
          <h1 className="text-4xl font-bold text-white">
            ₦{formattedAmount}
          </h1>
        </div>

        {/* Status pill */}
        <div className="flex justify-center -mt-4 relative z-10">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md ${
              transaction.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {transaction.status}
          </span>
        </div>

        {/* Receipt rows */}
        <div className="px-6 pt-4 pb-2">
          <div className="divide-y divide-gray-100">
            {rows.map(({ label, value, mono }) => (
              <div key={label} className="flex justify-between items-start py-4 gap-4">
                <span className="text-gray-400 text-sm shrink-0">{label}</span>
                <span
                  className={`text-sm font-medium text-gray-800 text-right break-all ${
                    mono ? "font-mono text-xs text-gray-500" : ""
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dotted divider — receipt tear style */}
        <div className="mx-6 my-2 border-t-2 border-dashed border-gray-200" />

        {/* Footer */}
        <div className="px-6 py-5 flex gap-3">
          <button
            onClick={() => generateReceipt(transaction)}
            className="flex-1 border-2 border-[#0F2D52] text-[#0F2D52] py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
            </svg>
            Download
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#0F2D52] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#163b6b] transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default TransactionReceipt;