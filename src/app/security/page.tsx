import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaShieldHalved, FaLock, FaDatabase, FaCircleCheck } from "react-icons/fa6";

export const metadata = {
  title: "Security | Xyroots",
  description: "Learn how Xyroots protects your data with enterprise-grade security, encryption, and privacy controls.",
};

const features = [
  { icon: FaLock, title: "TLS 1.3 Encryption", desc: "All data in transit is encrypted with TLS 1.3. Your connection to Xyroots is always secured." },
  { icon: FaDatabase, title: "Row Level Security", desc: "Powered by Supabase with PostgreSQL Row Level Security — your data is only accessible by you." },
  { icon: FaShieldHalved, title: "Verified Listings", desc: "Every institution is manually verified before they can post jobs or contact teachers." },
  { icon: FaCircleCheck, title: "GDPR-Ready", desc: "We're aligned with Indian data protection regulations and GDPR principles. Delete your data anytime." },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-xyroots-teal to-[#068050] text-white py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <FaShieldHalved className="w-12 h-12 text-green-400 mx-auto mb-5" />
            <h1 className="font-editorial text-4xl sm:text-5xl text-white mb-4">Your Security, Our Priority</h1>
            <p className="text-xyroots-mint/90 text-lg">We take every measure to keep your data, identity, and career information safe.</p>
          </div>
        </section>

        <section className="py-16 bg-[#f7f8fa]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-6 mb-12">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 transition-all">
                <div className="w-11 h-11 bg-gradient-to-br from-xyroots-teal to-[#068050] rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-900 mb-2">{f.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-7">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Data Practices</h2>
              <ul className="space-y-3 text-sm text-gray-700">
                {[
                  "We never sell your personal data to third parties.",
                  "Passwords are hashed using bcrypt — we never store plaintext credentials.",
                  "Supabase Auth handles all authentication with industry-standard OAuth flows.",
                  "Profile data is only visible to verified institutions when you mark your profile as active.",
                  "You can request complete account deletion from your settings page at any time.",
                  "All API endpoints are protected and rate-limited against abuse.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <FaCircleCheck className="w-4 h-4 text-xyroots-teal shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-10 bg-white text-center">
          <p className="text-gray-500 text-sm">Security concerns? Email <a href="mailto:mail@xyroots.com" className="text-xyroots-teal font-semibold hover:underline">mail@xyroots.com</a></p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
