"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaLocationDot, FaPhone, FaEnvelope, FaGlobe, FaCircleCheck } from "react-icons/fa6";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, call an API route / Supabase function
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-xyroots-teal to-[#068050] text-white py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-editorial text-4xl sm:text-5xl text-white mb-4">Get in Touch</h1>
            <p className="text-xyroots-mint/90 text-lg">We're here to help. Reach out and we'll respond within 24 hours.</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-[#f7f8fa]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-10">

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Contact Information</h2>
                <p className="text-sm text-gray-500">Visit us, call us, or drop an email.</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-xyroots-mint flex items-center justify-center shrink-0">
                    <FaLocationDot className="w-4 h-4 text-xyroots-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Address</p>
                    <p className="text-sm text-gray-800 leading-relaxed">Muallim Complex, Second floor,<br />Arayadath Palam, Kozhikode 673004</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-xyroots-mint flex items-center justify-center shrink-0">
                    <FaPhone className="w-4 h-4 text-xyroots-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                    <a href="tel:+916235758639" className="text-sm text-gray-800 hover:text-xyroots-teal transition-colors">+91 6235 758 639</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-xyroots-mint flex items-center justify-center shrink-0">
                    <FaEnvelope className="w-4 h-4 text-xyroots-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <a href="mailto:mail@xyroots.com" className="text-sm text-gray-800 hover:text-xyroots-teal transition-colors">mail@xyroots.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-xyroots-mint flex items-center justify-center shrink-0">
                    <FaGlobe className="w-4 h-4 text-xyroots-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Website</p>
                    <a href="https://xyroots.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-xyroots-teal transition-colors">xyroots.com</a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-xyroots-teal to-[#068050] rounded-2xl p-5 text-white">
                <p className="font-bold text-sm mb-1">Support Hours</p>
                <p className="text-xs text-green-200/80">Monday – Saturday<br />9:00 AM – 6:00 PM IST</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                {sent ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <FaCircleCheck className="w-8 h-8 text-xyroots-teal" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Your Name *</label>
                        <input required type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Rahul Sharma" className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-xyroots-teal outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email Address *</label>
                        <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-xyroots-teal outline-none transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Subject *</label>
                      <input required type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="How can we help?" className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-xyroots-teal outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Message *</label>
                      <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us what's on your mind..." className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-xyroots-teal outline-none transition-all resize-none" />
                    </div>
                    <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-br from-xyroots-teal to-[#068050] text-white font-bold text-sm hover:shadow-lg transition-all">
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
