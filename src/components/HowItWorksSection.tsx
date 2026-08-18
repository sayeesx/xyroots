import Link from "next/link";

const steps = [
  {
    // Realistic laptop/search illustration
    icon: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <circle cx="60" cy="60" r="58" fill="#f0fdf4" stroke="#00a264" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* Laptop body */}
        <rect x="22" y="36" width="76" height="46" rx="5" fill="white" stroke="#374151" strokeWidth="2.2" />
        <rect x="28" y="42" width="64" height="33" rx="3" fill="#f8fafc" stroke="#e5e7eb" strokeWidth="1.2" />
        {/* Screen lines */}
        <rect x="34" y="50" width="28" height="3" rx="1.5" fill="#d1d5db" />
        <rect x="34" y="57" width="20" height="3" rx="1.5" fill="#d1d5db" />
        <rect x="34" y="64" width="24" height="3" rx="1.5" fill="#d1d5db" />
        {/* Search icon on screen */}
        <circle cx="72" cy="57" r="8" fill="#e6f7ed" stroke="#00a264" strokeWidth="1.8" />
        <circle cx="71" cy="56" r="4" fill="none" stroke="#00a264" strokeWidth="1.6" />
        <line x1="74" y1="59" x2="78" y2="63" stroke="#00a264" strokeWidth="1.8" strokeLinecap="round" />
        {/* Laptop base */}
        <path d="M18 82 Q18 88 24 88 H96 Q102 88 102 82 L96 82 Q95 86 88 86 H32 Q25 86 24 82Z" fill="#e5e7eb" />
        {/* Location pin above */}
        <path d="M60 18 C55 18 51 22 51 27 C51 34 60 42 60 42 C60 42 69 34 69 27 C69 22 65 18 60 18Z" fill="#00a264" />
        <circle cx="60" cy="27" r="3.5" fill="white" />
      </svg>
    ),
    title: "Find your dream job profile",
    desc: "Choose your target teaching position at your favourite location across hundreds of verified institutions.",
  },
  {
    // CV / document illustration
    icon: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <circle cx="60" cy="60" r="58" fill="#f0fdf4" stroke="#00a264" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* Main document */}
        <rect x="30" y="22" width="52" height="68" rx="5" fill="white" stroke="#374151" strokeWidth="2.2" />
        <rect x="36" y="30" width="40" height="5" rx="2.5" fill="#00a264" />
        {/* Photo placeholder */}
        <rect x="36" y="40" width="14" height="14" rx="2" fill="#e6f7ed" stroke="#00a264" strokeWidth="1.4" />
        <circle cx="43" cy="45" r="3" fill="#00a264" opacity="0.5" />
        <path d="M37 53 Q43 48 49 53" stroke="#00a264" strokeWidth="1.2" fill="none" />
        {/* Text lines */}
        <rect x="54" y="42" width="20" height="3" rx="1.5" fill="#d1d5db" />
        <rect x="54" y="48" width="14" height="3" rx="1.5" fill="#d1d5db" />
        <rect x="36" y="60" width="36" height="2.5" rx="1.2" fill="#e5e7eb" />
        <rect x="36" y="66" width="28" height="2.5" rx="1.2" fill="#e5e7eb" />
        <rect x="36" y="72" width="32" height="2.5" rx="1.2" fill="#e5e7eb" />
        {/* Green checkmark badge */}
        <circle cx="82" cy="82" r="14" fill="#00a264" stroke="white" strokeWidth="2.5" />
        <polyline points="75,82 80,87 89,75" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Register with ease",
    desc: "Simple registration — upload your profile, add your qualifications, and let institutions find you.",
  },
  {
    // Person hired / award illustration
    icon: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <circle cx="60" cy="60" r="58" fill="#f0fdf4" stroke="#00a264" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* Person */}
        <circle cx="48" cy="42" r="12" fill="#e6f7ed" stroke="#00a264" strokeWidth="2" />
        <circle cx="48" cy="39" r="5.5" fill="#00a264" />
        <path d="M36 58 Q48 50 60 58" stroke="#00a264" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* Board / whiteboard */}
        <rect x="63" y="30" width="32" height="42" rx="3" fill="white" stroke="#374151" strokeWidth="2" />
        <line x1="69" y1="40" x2="89" y2="40" stroke="#00a264" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="69" y1="48" x2="89" y2="48" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="69" y1="56" x2="82" y2="56" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
        {/* Pointer */}
        <line x1="58" y1="52" x2="63" y2="44" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="63" cy="43" r="2.5" fill="#374151" />
        {/* Star trophy */}
        <path d="M45 72 L47.5 80 L55 80 L49 85 L51.5 93 L45 88 L38.5 93 L41 85 L35 80 L42.5 80 Z" fill="#00a264" opacity="0.85" />
        <circle cx="45" cy="82" r="4" fill="#e6f7ed" />
      </svg>
    ),
    title: "Get hired on top priority",
    desc: "Our smart matching helps institutions find you based on your qualifications — get hired faster.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#f7f9f8]" aria-label="How Xyroots supports you">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            How does{" "}
            <span className="text-[#00a264]">Xyroots</span>{" "}
            support you?
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            We are focused on finding the best matching job profile for you — fast, fair, and human.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              {/* SVG illustration — no background box */}
              <div className="mb-5">
                {step.icon}
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00a264] text-white text-sm font-semibold hover:bg-[#007a4d] transition-colors"
            style={{ borderRadius: "0.75rem" }}
          >
            Browse Teaching Jobs →
          </Link>
        </div>

      </div>
    </section>
  );
}
