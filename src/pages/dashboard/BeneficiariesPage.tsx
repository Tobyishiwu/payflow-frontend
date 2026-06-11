import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getBeneficiaries, deleteBeneficiary } from "../../services/beneficiaryService";

interface Beneficiary {
  id: number;
  beneficiary_name: string;
  account_number: string;
}

const AVATAR_COLORS = [
  "bg-[#0F2D52]", "bg-emerald-600", "bg-violet-600",
  "bg-rose-600", "bg-amber-600", "bg-sky-600",
];

function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function BeneficiariesPage() {
  const navigate = useNavigate();

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      const data = await getBeneficiaries();
      setBeneficiaries([...data].reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteBeneficiary(id);
      await loadBeneficiaries();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() =>
    beneficiaries.filter((b) =>
      b.beneficiary_name.toLowerCase().includes(search.toLowerCase()) ||
      b.account_number.includes(search)
    ),
    [beneficiaries, search]
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0F2D52]">Beneficiaries</h1>
          <p className="text-gray-500 mt-2">Manage your saved recipients.</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or account number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-10 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2D52] shadow-sm transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-3xl shadow p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="h-8 bg-gray-100 rounded-xl w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl shadow p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">
              {search ? `No results for "${search}"` : "No beneficiaries yet"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {!search && "Beneficiaries are saved automatically after a transfer."}
            </p>
            {search && (
              <button onClick={() => setSearch("")} className="text-sm text-[#0F2D52] font-semibold mt-2 hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow overflow-hidden">
            {filtered.map((b, idx) => (
              <div
                key={b.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors ${
                  idx !== filtered.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full ${getAvatarColor(b.beneficiary_name)} text-white flex items-center justify-center font-bold text-lg shrink-0`}>
                  {b.beneficiary_name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 truncate">{b.beneficiary_name}</p>
                  <p className="text-sm text-gray-400 mt-0.5 font-mono tracking-wide">{b.account_number}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/transfer?account=${b.account_number}`)}
                    className="flex items-center gap-1.5 bg-[#0F2D52] text-white text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-[#163b6b] transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Send
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deletingId === b.id}
                    className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition flex items-center justify-center disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === b.id ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Count */}
        {!loading && beneficiaries.length > 0 && (
          <p className="text-xs text-gray-400 text-center mt-4">
            {filtered.length} of {beneficiaries.length} beneficiar{beneficiaries.length !== 1 ? "ies" : "y"}
          </p>
        )}

      </div>
    </DashboardLayout>
  );
}

export default BeneficiariesPage;