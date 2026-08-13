"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaStar, FaQuoteLeft } from "react-icons/fa6";

const testimonials = [
  {
    name: "Anjali Krishnan",
    role: "Mathematics Teacher",
    school: "Delhi Public School, Calicut",
    quote: "Xyroots helped me find my dream school in just 3 days. The profile system is beautifully simple and the schools that contacted me were all genuinely interested.",
    rating: 5,
    grad: "AK",
  },
  {
    name: "Suresh Menon",
    role: "Principal",
    school: "Kendriya Vidyalaya, Thrissur",
    quote: "We've hired 12 teachers through Xyroots in the past year. The quality of candidates is exceptional and the platform makes filtering incredibly easy.",
    rating: 5,
    grad: "SM",
  },
  {
    name: "Fathima Banu",
    role: "English Teacher",
    school: "The Choice School, Kochi",
    quote: "I was skeptical at first, but the verified listings and responsive support team made all the difference. I now recommend Xyroots to every teacher I know.",
    rating: 5,
    grad: "FB",
  },
  {
    name: "Vineeth Kumar",
    role: "Science Teacher",
    school: "Amrita Vidyalayam, Coimbatore",
    quote: "The whole experience felt premium. No spam, no fake listings. Just genuine opportunities from schools that were actually looking.",
    rating: 5,
    grad: "VK",
  },
  {
    name: "Rekha Pillai",
    role: "HR Manager",
    school: "Bethany Central School, Kozhikode",
    quote: "Using Xyroots cut our hiring time by 60%. The interface is intuitive and the candidate database is genuinely impressive.",
    rating: 5,
    grad: "RP",
  },
  {
    name: "Dr. Ajmal N",
    role: "Social Science Teacher",
    school: "GHSS Malappuram",
    quote: "A platform built for teachers by people who actually understand education. That's rare. Xyroots is the real deal.",
    rating: 5,
    grad: "AN",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#042816] via-[#074526] to-[#0a5c32] text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #00d085 0%, transparent 50%)' }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <FaStar key={i} className="w-5 h-5 text-yellow-400" />)}
            </div>
            <h1 className="font-editorial text-4xl sm:text-5xl text-white mb-4">What Our Community Says</h1>
            <p className="text-green-100/80 text-lg max-w-2xl mx-auto">
              Real stories from teachers and institutions who found their match through Xyroots.
            </p>
          </div>
        </section>

        {/* Testimonial Grid */}
        <section className="py-16 bg-[#f7f8fa]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col">
                  <FaQuoteLeft className="w-6 h-6 text-xyroots-teal/30 mb-4" />
                  <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => <FaStar key={i} className="w-3.5 h-3.5 text-yellow-400" />)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#042816] to-[#0a5c32] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {t.grad}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role} · {t.school}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white text-center">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Join thousands of satisfied users</h2>
            <p className="text-gray-500 text-sm mb-8">Create your free profile and start connecting with the best institutions in India.</p>
            <a href="/jobs" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-br from-[#042816] to-[#0a5c32] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all">
              Get Started Free
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
