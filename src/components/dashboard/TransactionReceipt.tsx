import { generateReceipt } from "../../utils/generateReceipt";

interface Tx {
  id: number; reference: string; sender_account_id: number;
  receiver_account_id: number; amount: string; fee: string;
  type: string; status: string; description: string;
  created_at: string; updated_at: string;
}

interface Props { transaction: Tx; accountId: number; onClose: () => void; }

export default function TransactionReceipt({ transaction, accountId, onClose }: Props) {
  const isCredit = transaction.receiver_account_id === accountId;
  const amt = Number(transaction.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 });
  const fee = Number(transaction.fee || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });
  const date = new Date(transaction.created_at).toLocaleString("en-NG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const rows = [
    { label: "Type", value: isCredit ? "Money Received" : "Money Sent" },
    { label: "Description", value: transaction.description || "Transfer" },
    { label: "Reference", value: transaction.reference, mono: true },
    { label: "Fee", value: `₦${fee}` },
    { label: "Date", value: date },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full rounded-t-3xl overflow-hidden shadow-2xl">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        {/* Header */}
        <div className={`px-6 pt-4 pb-6 text-center ${isCredit ? "bg-emerald-600" : "bg-[#0F2D52]"}`}>
          <div className="w-14 h-14 rounded-full bg-white/20 ring-4 ring-white/10 flex items-center justify-center mx-auto mb-3 text-2xl text-white">
            {isCredit ? "↓" : "↑"}
          </div>
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">{isCredit ? "Received" : "Sent"}</p>
          <h1 className="text-3xl font-bold text-white">₦{amt}</h1>
        </div>
        {/* Status pill */}
        <div className="flex justify-center -mt-4 relative z-10">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md ${transaction.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {transaction.status}
          </span>
        </div>
        {/* Rows */}
        <div className="px-6 pt-4 pb-2 divide-y divide-gray-100">
          {rows.map(({ label, value, mono }) => (
            <div key={label} className="flex justify-between items-start py-3 gap-4">
              <span className="text-xs text-gray-400 shrink-0">{label}</span>
              <span className={`text-xs font-semibold text-gray-800 text-right break-all ${mono ? "font-mono text-gray-500" : ""}`}>{value}</span>
            </div>
          ))}
        </div>
        <div className="mx-6 my-2 border-t-2 border-dashed border-gray-200" />
        {/* Actions */}
        <div className="px-6 pb-10 pt-3 flex gap-3">
          <button onClick={() => generateReceipt(transaction)}
            className="flex-1 border-2 border-[#0F2D52] text-[#0F2D52] py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"/></svg>
            Download
          </button>
          <button onClick={onClose} className="flex-1 bg-[#0F2D52] text-white py-3.5 rounded-2xl font-semibold text-sm">Close</button>
        </div>
      </div>
    </div>
  );
}