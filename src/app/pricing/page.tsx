import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaCircleCheck, FaArrowRight, FaShieldHalved, FaBolt, FaWandMagicSparkles } from "react-icons/fa6";

const teacherPlans = [
  {
    name: "Free",
    price: "₹0",
    period: "/mo",
    desc: "For teachers just getting started",
    highlighted: false,
    features: [
      "Basic educator profile",
      "Apply to unlimited jobs",
      "Save & watchlist jobs",
      "Application tracking",
      "Email notifications",
    ],
    notIncluded: ["Priority search ranking", "Verified badge", "Direct invitations", "Premium support"],
    cta: "Get Started Free",
    href: "/register/teacher",
  },
  {
    name: "Verified",
    price: "₹299",
    period: "/mo",
    desc: "Stand out and get hired faster",
    highlighted: true,
    features: [
      "Everything in Free",
      "Verified educator badge",
      "Priority search placement",
      "Direct recruiter invitations",
      "Enhanced profile layout",
      "Demo video showcase",
      "Interview scheduling",
      "Priority email support",
    ],
    notIncluded: [],
    cta: "Get Verified",
    href: "/register/teacher",
    badge: "Best for Teachers",
  },
];

const institutionPlans = [
  {
    name: "Starter",
    price: "₹1,999",
    period: "/mo",
    desc: "For small schools getting started",
    highlighted: false,
    features: [
      "Post up to 5 active jobs",
      "Candidate search & filters",
      "Basic candidate profiles",
      "Email support",
    ],
    cta: "Get Started",
    href: "/register/employer",
  },
  {
    name: "Growth",
    price: "₹4,999",
    period: "/mo",
    desc: "For actively hiring institutions",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Post unlimited jobs",
      "Full candidate database access",
      "Advanced filters & search",
      "Interview scheduling tools",
      "Applicant pipeline management",
      "Verified school badge",
      "Priority listing",
      "Dedicated support",
    ],
    cta: "Start Growth Plan",
    href: "/register/employer",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large institutions & chains",
    highlighted: false,
    features: [
      "Everything in Growth",
      "Multi-campus management",
      "Bulk hiring tools",
      "API access",
      "Custom integrations",
      "Account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
];

const faqs = [
  { q: "Is Xyroots really free for teachers?", a: "Yes! Teachers can create a profile, apply to unlimited jobs, and track applications completely free. The Verified plan is optional for teachers who want to stand out." },
  { q: "Can I cancel anytime?", a: "Yes, all paid plans are monthly and can be cancelled at any time without penalty. Your account reverts to the free tier." },
  { q: "What does the verified badge mean?", a: "The verified badge signals to schools that you're a serious, active educator on the platform. It improves your search visibility significantly." },
  { q: "Do schools see verified teachers first?", a: "Yes. Verified teachers appear higher in search results and are featured in our candidate recommendations to actively hiring schools." },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#f7f8fa] border-b border-gray-100 py-20 px-4 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-600 bg-gray-100 px-3 py-1 mb-5" style={{ borderRadius: "999px" }}>
            Pricing
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-gray-900 mb-4 leading-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-6">
            Free for teachers forever. Affordable plans for schools and agencies.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold" style={{ borderRadius: "999px" }}>
            <FaWandMagicSparkles className="w-4 h-4 text-xyroots-yellow" />
            Always 100% Free for Teachers
          </div>
        </section>

        {/* Teacher Plans */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">For Teachers</h2>
            <p className="text-gray-500 text-sm text-center mb-10">Upgrade to stand out and get hired faster</p>

            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {teacherPlans.map(plan => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col p-7 border ${plan.highlighted ? "bg-xyroots-dark text-white border-xyroots-dark" : "bg-white border-gray-200"}`}
                  style={{ borderRadius: "1.25rem" }}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-xyroots-yellow text-xyroots-dark text-xs font-bold px-4 py-1" style={{ borderRadius: "999px" }}>
                      {plan.badge}
                    </div>
                  )}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                      {plan.highlighted && <FaShieldHalved className="w-4 h-4 text-gray-400" />}
                    </div>
                    <p className={`text-xs ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>{plan.desc}</p>
                  </div>
                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${plan.highlighted ? "text-xyroots-yellow" : "text-gray-900"}`}>{plan.price}</span>
                    {plan.period && <span className={`text-sm ml-1 ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>{plan.period}</span>}
                  </div>
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <FaCircleCheck className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? "text-white/70" : "text-gray-500"}`} />
                        <span className={plan.highlighted ? "text-gray-200" : "text-gray-700"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`w-full py-3 text-sm font-bold text-center cursor-default ${plan.highlighted ? "bg-xyroots-yellow text-xyroots-dark" : "bg-gray-900 text-white"}`}
                    style={{ borderRadius: "0.75rem" }}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Institution Plans */}
        <section className="py-16 px-4 bg-[#f7f8fa] border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">For Schools & Agencies</h2>
            <p className="text-gray-500 text-sm text-center mb-10">Scalable hiring tools for institutions of all sizes</p>

            <div className="grid sm:grid-cols-3 gap-5">
              {institutionPlans.map(plan => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col p-7 border ${plan.highlighted ? "bg-xyroots-dark text-white border-xyroots-dark" : "bg-white border-gray-200"}`}
                  style={{ borderRadius: "1.25rem" }}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-xyroots-yellow text-xyroots-dark text-xs font-bold px-4 py-1" style={{ borderRadius: "999px" }}>
                      {plan.badge}
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                    <p className={`text-xs ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>{plan.desc}</p>
                  </div>
                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${plan.highlighted ? "text-xyroots-yellow" : "text-gray-900"}`}>{plan.price}</span>
                    {plan.period && <span className={`text-sm ml-1 ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>{plan.period}</span>}
                  </div>
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <FaCircleCheck className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" />
                        <span className={plan.highlighted ? "text-gray-200" : "text-gray-700"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`w-full py-3 text-sm font-bold text-center cursor-default ${plan.highlighted ? "bg-xyroots-yellow text-xyroots-dark" : "bg-gray-900 text-white"}`}
                    style={{ borderRadius: "0.75rem" }}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats / Trust */}
        <section className="py-14 px-4 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "2,400+", label: "Active Teachers" },
              { value: "340+", label: "Hiring Schools" },
              { value: "₹0", label: "Cost for Teachers" },
              { value: "4.9/5", label: "Avg. Rating" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-gray-900 mb-1">{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-[#f7f8fa] border-t border-gray-100">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-gray-100 p-5" style={{ borderRadius: "0.875rem" }}>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-start gap-2">
                    <FaBolt className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                    {faq.q}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed pl-5">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-white border-t border-gray-100 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to get started?</h2>
            <p className="text-gray-500 text-sm mb-8">Create your free profile today. No credit card required.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="button" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold text-sm cursor-default" style={{ borderRadius: "0.75rem" }}>
                Register as Teacher — Free <FaArrowRight className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold text-sm cursor-default" style={{ borderRadius: "0.75rem" }}>
                Register as Institution
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
