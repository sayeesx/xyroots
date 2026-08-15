"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaLocationDot, FaPhone, FaEnvelope, FaGlobe, FaCircleCheck, FaArrowRight } from "react-icons/fa6";

const contactItems = [
  {
    icon: FaLocationDot,
    label: "Address",
    value: "Muallim Complex, Second floor,\nArayadath Palam, Kozhikode 673004",
    href: null,
  },
  {
    icon: FaPhone,
    label: "Phone",
    value: "+91 6235 758 639",
    href: "tel:+916235758639",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: "mail@xyroots.com",
    href: "mailto:mail@xyroots.com",
  },
  {
    icon: FaGlobe,
    label: "Website",
    value: "xyroots.com",
    href: "https://xyroots.com",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Page title — no hero */}
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Support</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Get in Touch</h1>
            <p className="text-gray-500 text-base">We're here to help. Reach out and we'll respond within 24 hours.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">

            {/* Left — contact info */}
            <div className="lg:col-span-2 space-y-4">

              {/* Info cards */}
              <div className="bg-white border border-gray-200 p-6 space-y-5" style={{ borderRadius: "1rem" }}>
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-gray-100 flex items-center justify-center shrink-0" style={{ borderRadius: "0.625rem" }}>
                      <item.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                          className="text-sm text-gray-800 hover:text-[#00a264] transition-colors font-medium">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div className="bg-white border border-gray-200 p-5" style={{ borderRadius: "1rem" }}>
                <p className="text-sm font-bold text-gray-900 mb-1">Support Hours</p>
                <p className="text-xs text-gray-500 leading-relaxed">Monday – Saturday<br />9:00 AM – 6:00 PM IST</p>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 p-6 sm:p-8" style={{ borderRadius: "1rem" }}>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                {sent ? (
                  <div className="flex flex-col items-center py-14 text-center">
                    <div className="w-14 h-14 bg-[#e6f7ed] flex items-center justify-center mb-4" style={{ borderRadius: "50%" }}>
                      <FaCircleCheck className="w-7 h-7 text-[#00a264]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Your Name *</label>
                        <input
                          required type="text" value={form.name}
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full p-3 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-[#00a264] focus:bg-white transition-all"
                          style={{ borderRadius: "0.625rem" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email Address *</label>
                        <input
                          required type="email" value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="you@example.com"
                          className="w-full p-3 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-[#00a264] focus:bg-white transition-all"
                          style={{ borderRadius: "0.625rem" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Subject *</label>
                      <input
                        required type="text" value={form.subject}
                        onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                        placeholder="How can we help?"
                        className="w-full p-3 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-[#00a264] focus:bg-white transition-all"
                        style={{ borderRadius: "0.625rem" }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Message *</label>
                      <textarea
                        required rows={5} value={form.message}
                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        placeholder="Tell us what's on your mind..."
                        className="w-full p-3 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-[#00a264] focus:bg-white transition-all resize-none"
                        style={{ borderRadius: "0.625rem" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gray-900 text-white font-bold text-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                      style={{ borderRadius: "0.75rem" }}
                    >
                      Send Message <FaArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
