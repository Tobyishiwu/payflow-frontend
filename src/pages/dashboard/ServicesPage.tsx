import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-hot-toast";

const services = [
  {
    name: "Airtime",
    icon: "📞",
  },
  {
    name: "Data",
    icon: "📶",
  },
  {
    name: "Electricity",
    icon: "⚡",
  },
  {
    name: "Cable TV",
    icon: "📺",
  },
  {
    name: "Betting",
    icon: "🎯",
  },
  {
    name: "Education",
    icon: "🎓",
  },
];

function ServicesPage() {
  const handleComingSoon = (
    service: string
  ) => {
    toast(`${service} coming soon`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-4xl font-bold text-[#0F2D52]">
            Services
          </h1>

          <p className="text-gray-500 mt-2">
            Pay bills and access other services.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">

          {services.map((service) => (
            <button
              key={service.name}
              onClick={() =>
                handleComingSoon(
                  service.name
                )
              }
              className="bg-white rounded-3xl shadow p-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition"
            >
              <span className="text-4xl">
                {service.icon}
              </span>

              <span className="font-semibold text-[#0F2D52]">
                {service.name}
              </span>
            </button>
          ))}

        </div>

      </div>
    </DashboardLayout>
  );
}

export default ServicesPage;