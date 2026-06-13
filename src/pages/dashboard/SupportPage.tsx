import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const faqs = [
  {
    question: "How long do transfers take?",
    answer: "Transfers between PayFlow accounts are instant. Your recipient sees the money immediately after confirmation.",
  },
  {
    question: "What if I forget my transaction PIN?",
    answer: "Go to Profile → Change Transaction PIN. You'll need your current password to reset it. If you're locked out, contact support.",
  },
  {
    question: "Can I reverse a transfer?",
    answer: "Completed transfers cannot be reversed automatically. Please contact support immediately if you sent to the wrong account.",
  },
  {
    question: "Is my money safe with PayFlow?",
    answer: "Yes. All transactions are encrypted and protected. Your funds are secured and we never share your data with third parties.",
  },
  {
    question: "What are the transfer limits?",
    answer: "Default limits apply per transaction and per day. Contact support if you need your limits reviewed.",
  },
];

const contactOptions = [
  {
    label: "WhatsApp",
    subtitle: "Chat with us instantly",
    href: "https://wa.me/2347066958826",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    badgeColor: "bg-green-100 text-green-700",
    badge: "Online",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: "Email Support",
    subtitle: "support@payflow.com",
    href: "mailto:support@payflow.com",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badgeColor: "bg-blue-100 text-blue-700",
    badge: "24–48h",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto space-y-5 pb-4">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0F2D52]">Support Center</h1>
          <p className="text-gray-400 text-sm mt-1">We're here to help, anytime.</p>
        </div>

        {/* Contact options */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Us</p>
          </div>

{contactOptions.map((option) => (
              <div key={option.label} className="border-t border-gray-100">
              <a
                href={option.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl ${option.iconBg} ${option.iconColor} flex items-center justify-center shrink-0`}>
                    {option.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{option.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{option.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${option.badgeColor}`}>
                    {option.badge}
                  </span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">FAQs</p>
          </div>

          {faqs.map((faq, idx) => (
            <div key={idx} className="border-t border-gray-100">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition text-left"
              >
                <span className="font-semibold text-gray-800 text-sm pr-4">{faq.question}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === idx ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="bg-[#0F2D52] rounded-3xl p-5 text-center relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
          <p className="text-white font-semibold text-sm relative z-10">Still need help?</p>
          <p className="text-blue-300 text-xs mt-1 relative z-10">Our support team is available Mon–Sat, 8am–8pm.</p>
          <a
            href="mailto:support@payflow.com"
            className="inline-block mt-3 bg-white text-[#0F2D52] text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition relative z-10"
          >
            Email Us
          </a>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default SupportPage;