"use client";

import { FaQuoteRight, FaStar } from "react-icons/fa6";
import { testimonials } from "@/data/schools";

export default function TestimonialSection() {
  return (
    <section className="section-padding bg-xyroots-cream relative overflow-hidden" aria-labelledby="testimonials-heading">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-10 w-64 h-64 bg-xyroots-yellow/10 organic-blob blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-teal mb-4">
            Testimonials
          </span>
          <h2 id="testimonials-heading" className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-black mb-4">
            Built Around Better Hiring.
          </h2>
          <p className="text-base sm:text-lg text-xyroots-muted">
            Hear from teachers who found their ideal classrooms and schools that built exceptional faculties.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-8 border border-xyroots-border shadow-sm flex flex-col justify-between card-hover relative"
            >
              <FaQuoteRight className="w-10 h-10 text-xyroots-mint absolute top-6 right-6" />

              <div className="relative z-10 mb-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-500" />
                  ))}
                </div>
                <p className="text-base sm:text-lg text-black font-medium leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-xyroots-border">
                <div className="w-12 h-12 rounded-2xl bg-xyroots-teal text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <h3 className="text-base font-bold text-black">{t.name}</h3>
                  <p className="text-xs text-xyroots-muted">
                    {t.role} {t.organization ? `• ${t.organization}` : ""}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-xyroots-mint text-xyroots-teal">
                    {t.type === "teacher" ? "Verified Educator" : "Verified Institution"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
