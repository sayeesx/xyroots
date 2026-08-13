"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

const faqs = [
  {
    q: "Is Xyroots free for teachers?",
    a: "Yes! Creating a teacher profile and applying for jobs on Xyroots is completely free. We believe teachers should never pay to find work.",
  },
  {
    q: "How are institutions verified?",
    a: "Every institution that joins Xyroots goes through a manual verification process. We check their legal registration, contact details, and school credentials before granting a verified badge.",
  },
  {
    q: "How long does it take to get hired through Xyroots?",
    a: "Most teachers receive their first response within 48–72 hours of completing their profile. Hiring timelines vary by institution, but our median time-to-hire is under 2 weeks.",
  },
  {
    q: "Can I post jobs as an educational agency?",
    a: "Absolutely. Agencies and consultancies have a dedicated portal on Xyroots. You can post hiring vacancies, manage candidate pipelines, and source teachers on behalf of your client schools.",
  },
  {
    q: "What boards do you support?",
    a: "Xyroots supports all major Indian boards including CBSE, ICSE, State Board, IB, Cambridge (IGCSE), NIOS, and more.",
  },
  {
    q: "Can I apply to multiple jobs at once?",
    a: "Yes. There's no limit to how many jobs you can apply for. You can also save jobs to your watchlist and track application status from your dashboard.",
  },
  {
    q: "Is my data secure?",
    a: "We take data security seriously. All connections are encrypted via TLS 1.3, data is stored on Supabase infrastructure with Row Level Security, and we never sell your data to third parties.",
  },
  {
    q: "Do you have a mobile app?",
    a: "Our web platform is fully responsive and works beautifully on mobile browsers. A dedicated iOS and Android app is currently in development.",
  },
  {
    q: "How do I delete my account?",
    a: "You can request account deletion from your Account Settings page. We'll permanently delete all your data within 30 days in compliance with Indian data protection regulations.",
  },
  {
    q: "Who do I contact for support?",
    a: "You can reach us at mail@xyroots.com or call +91 6235 758 639. Our support team is available Monday–Saturday, 9AM–6PM IST.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-gray-100 rounded-2xl overflow-hidden transition-all ${open ? 'shadow-sm' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm sm:text-base font-semibold text-gray-900">{q}</span>
        {open ? <FaChevronUp className="w-4 h-4 text-xyroots-teal shrink-0" /> : <FaChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#042816] via-[#074526] to-[#0a5c32] text-white py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-editorial text-4xl sm:text-5xl text-white mb-4">Frequently Asked Questions</h1>
            <p className="text-green-100/80 text-lg">Everything you need to know about Xyroots. Can't find your answer? Contact us anytime.</p>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-16 bg-[#f7f8fa]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white">
                <FAQItem q={faq.q} a={faq.a} />
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 bg-white text-center">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <p className="text-gray-600 mb-2 font-medium">Still have questions?</p>
            <a href="/contact" className="text-xyroots-teal font-bold hover:underline">Contact our support team →</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
