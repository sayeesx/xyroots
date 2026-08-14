import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaStar, FaQuoteLeft } from "react-icons/fa6";
import Link from "next/link";

const testimonials = [
  {
    name: "Anjali Krishnan",
    role: "Mathematics Teacher",
    school: "Delhi Public School, Calicut",
    quote: "Xyroots helped me find my dream school in just 3 days. The profile system is beautifully simple and every school that contacted me was genuinely interested.",
    rating: 5,
    type: "teacher",
  },
  {
    name: "Suresh Menon",
    role: "Principal",
    school: "Kendriya Vidyalaya, Thrissur",
    quote: "We've hired 12 teachers through Xyroots this year. The candidate quality is exceptional and the platform makes filtering effortless.",
    rating: 5,
    type: "institution",
  },
  {
    name: "Fathima Banu",
    role: "English Teacher",
    school: "The Choice School, Kochi",
    quote: "I was skeptical at first, but the verified listings and responsive support made all the difference. I now recommend Xyroots to every teacher I know.",
    rating: 5,
    type: "teacher",
  },
  {
    name: "Vineeth Kumar",
    role: "Science Teacher",
    school: "Amrita Vidyalayam, Coimbatore",
    quote: "No spam, no fake listings. Just genuine opportunities from schools that were actually looking. The whole experience felt premium.",
    rating: 5,
    type: "teacher",
  },
  {
    name: "Rekha Pillai",
    role: "HR Manager",
    school: "Bethany Central School, Kozhikode",
    quote: "Xyroots cut our hiring time by 60%. The interface is intuitive and the candidate database is genuinely impressive for a new platform.",
    rating: 5,
    type: "institution",
  },
  {
    name: "Dr. Ajmal N",
    role: "Social Science Teacher",
    school: "GHSS Malappuram",
    quote: "A platform built for teachers by people who actually understand education. That's rare. Xyroots is the real deal for Kerala educators.",
    rating: 5,
    type: "teacher",
  },
];

const stats = [
  { value: "2,400+", label: "Educators on Platform" },
  { value: "340+", label: "Verified Schools" },
  { value: "1,200+", label: "Placements Made" },
  { value: "4.9/5", label: "Average Rating" },
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#f7f8fa] border-b border-gray-100 py-20 px-4 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-xyroots-teal bg-xyroots-mint px-3 py-1 mb-5" style={{ borderRadius: "999px" }}>
            Testimonials
          </span>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <FaStar key={i} className="w-5 h-5 text-amber-400" />)}
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-gray-900 mb-4 leading-tight max-w-2xl mx-auto">
            Real Stories from Real Educators
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Teachers and institutions across India share their experience with Xyroots.
          </p>
        </section>

        {/* Stats */}
        <section className="py-10 px-4 border-b border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-xyroots-teal mb-1">{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16 px-4 bg-[#f7f8fa]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t) => {
                const initials = t.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <div key={t.name} className="bg-white border border-gray-100 p-6 flex flex-col" style={{ borderRadius: "1rem" }}>
                    <FaQuoteLeft className="w-5 h-5 text-gray-200 mb-4" />
                    <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(t.rating)].map((_, i) => <FaStar key={i} className="w-3 h-3 text-amber-400" />)}
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 flex items-center justify-center text-white font-bold text-xs shrink-0"
                        style={{
                          borderRadius: "50%",
                          backgroundColor: t.type === 'teacher' ? '#00a264' : '#1565c0',
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-500">{t.role}</p>
                        <p className="text-xs text-gray-400">{t.school}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-white border-t border-gray-100 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Join thousands of educators</h2>
            <p className="text-gray-500 text-sm mb-8">Create your free profile and connect with the best institutions in India.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 bg-xyroots-teal text-white font-semibold text-sm hover:bg-xyroots-dark transition-colors" style={{ borderRadius: "0.75rem" }}>
                Find Teaching Jobs
              </Link>
              <Link href="/register/teacher" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:border-xyroots-teal hover:text-xyroots-teal transition-colors" style={{ borderRadius: "0.75rem" }}>
                Create Free Profile
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
