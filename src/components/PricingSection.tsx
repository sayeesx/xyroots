"use client";

import Link from "next/link";
import { FaCheck, FaWandMagicSparkles } from "react-icons/fa6";
import { pricingPlans } from "@/data/schools";

export default function PricingSection() {
  return (
    <section className="section-padding bg-white relative" aria-labelledby="pricing-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-teal mb-4">
            Transparent Pricing
          </span>
          <h2 id="pricing-heading" className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-black mb-4">
            Simple Plans for Smarter Hiring.
          </h2>
          <p className="text-base sm:text-lg text-xyroots-muted mb-4">
            Scalable plans designed for educational institutions of all sizes.
          </p>

          {/* Teacher Free Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-xyroots-mint rounded-full text-xs font-bold text-xyroots-teal">
            <FaWandMagicSparkles className="w-4 h-4 text-xyroots-yellow" />
            <span>Always 100% Free for Teachers & Job Seekers</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 border flex flex-col justify-between transition-all relative ${
                plan.highlighted
                  ? "bg-xyroots-dark text-white border-xyroots-dark shadow-2xl scale-105"
                  : "bg-white text-black border-xyroots-border hover:border-xyroots-teal/40 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-xyroots-yellow text-black font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                  Most Popular for Schools
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${plan.highlighted ? "text-white" : "text-black"}`}>
                    {plan.name}
                  </h3>
                </div>
                <p className={`text-xs mb-6 ${plan.highlighted ? "text-gray-300" : "text-xyroots-muted"}`}>
                  {plan.description}
                </p>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className={`font-editorial text-4xl sm:text-5xl font-bold ${plan.highlighted ? "text-xyroots-yellow" : "text-black"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlighted ? "text-gray-300" : "text-xyroots-muted"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  <p className={`text-xs font-bold uppercase tracking-wider ${plan.highlighted ? "text-gray-300" : "text-xyroots-muted"}`}>
                    What's included:
                  </p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        plan.highlighted ? "bg-xyroots-yellow/20 text-xyroots-yellow" : "bg-xyroots-mint text-xyroots-teal"
                      }`}>
                        <FaCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className={plan.highlighted ? "text-gray-200" : "text-xyroots-text"}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/register/employer"
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-center transition-all btn-hover ${
                  plan.highlighted
                    ? "bg-xyroots-yellow text-black hover:bg-yellow-400"
                    : "bg-xyroots-teal text-white hover:bg-xyroots-dark"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
