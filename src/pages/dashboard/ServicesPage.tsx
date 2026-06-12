import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-hot-toast";

const services = [
  {
    name: "Airtime",
    subtitle: "Top up any network",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badge: null,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    name: "Data",
    subtitle: "Buy data bundles",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badge: null,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    name: "Electricity",
    subtitle: "Pay power bills",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    badge: null,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: "Cable TV",
    subtitle: "DSTV, GOtv, Startimes",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    badge: null,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Betting",
    subtitle: "Fund betting wallets",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    badge: "Soon",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
  {
    name: "Education",
    subtitle: "Pay school fees & WAEC",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    badge: "Soon",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
];

function ServicesPage() {
  const handleComingSoon = (service: string) => {
    toast(`${service} coming soon! 🚀`, {
      icon: "⏳",
      style: { borderRadius: "12px", fontWeight: "600" },
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto space-y-5 pb-4">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0F2D52]">Services</h1>
          <p className="text-gray-400 text-sm mt-1">Pay bills and top up instantly.</p>
        </div>

        {/* Featured banner */}
        <div className="bg-[#0F2D52] rounded-3xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="relative z-10">
            <p className="text-white font-bold text-sm">Pay Bills Instantly</p>
            <p className="text-blue-300 text-xs mt-0.5">Airtime, data, electricity & more — all in one place.</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3">
          {services.map((service) => (
            <button
              key={service.name}
              onClick={() => handleComingSoon(service.name)}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2.5 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150 relative"
            >
              {/* Coming soon badge */}
              {service.badge && (
                <span className="absolute top-2.5 right-2.5 text-[9px] font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                  {service.badge}
                </span>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl ${service.iconBg} ${service.iconColor} flex items-center justify-center`}>
                {service.icon}
              </div>

              {/* Label */}
              <div className="text-center">
                <p className="font-bold text-gray-800 text-xs">{service.name}</p>
                <p className="text-gray-400 text-[10px] mt-0.5 leading-tight">{service.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Info note */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3.5 flex items-start gap-3">
          <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-blue-600 text-xs leading-relaxed">
            All transactions are processed instantly and securely. Funds are deducted directly from your PayFlow balance.
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default ServicesPage;