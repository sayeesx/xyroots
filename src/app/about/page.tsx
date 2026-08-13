"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaCircleCheck, FaUsers, FaBuilding, FaHandshake, FaLightbulb, FaGraduationCap, FaStar, FaArrowRight } from "react-icons/fa6";

const stats = [
  { number: "10,000+", label: "Verified Educators" },
  { number: "2,500+", label: "Partner Institutions" },
  { number: "18+", label: "States Covered" },
  { number: "95%", label: "Placement Success" },
];

const values = [
  { icon: FaLightbulb, title: "Transparency", desc: "Every profile is verified. Every listing is real. We believe honest systems create lasting relationships." },
  { icon: FaHandshake, title: "Trust", desc: "We build bridges — not just job boards. Our platform is rooted in human connection and professional integrity." },
  { icon: FaGraduationCap, title: "Excellence", desc: "We hold ourselves to the highest standard, so that every classroom gets the best teacher it deserves." },
  { icon: FaUsers, title: "Community", desc: "We're building India's largest network of educators and institutions that grow together." },
];

const team = [
  { name: "Mohammed Ayaan", role: "Founder & CEO", grad: "MA" },
  { name: "Priya Nair", role: "Head of Operations", grad: "PN" },
  { name: "Rahul Sharma", role: "Lead Designer", grad: "RS" },
  { name: "Divya Menon", role: "Tech Lead", grad: "DM" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-xyroots-teal to-[#068050] text-white">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #00d085 0%, transparent 50%), radial-gradient(circle at 80% 20%, #00a264 0%, transparent 40%)' }} />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-green-300 mb-8 backdrop-blur-sm">
              <FaStar className="w-3.5 h-3.5 text-yellow-400" />
              Trusted by 10,000+ educators across India
            </div>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Reimagining how India's<br />
              <span className="text-[#7fffc4]">best teachers</span> find their schools
            </h1>
            <p className="text-lg text-xyroots-mint/90 max-w-2xl mx-auto leading-relaxed mb-10">
              Xyroots is an education recruitment platform built with one purpose — to make the process of finding the right teaching opportunity as seamless, transparent, and dignified as possible.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/jobs" className="px-7 py-3.5 rounded-xl bg-white text-xyroots-teal font-bold text-sm hover:bg-green-50 transition-colors shadow-lg">
                Explore Opportunities
              </Link>
              <Link href="/contact" className="px-7 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-gray-100 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-xyroots-teal mb-1">{s.number}</p>
                  <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-[#f7f8fa]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold text-xyroots-teal uppercase tracking-widest mb-3">Our Mission</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-snug">
                Empowering teachers.<br />Strengthening institutions.
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                At Xyroots, we believe that the foundation of a great education system is having the right teachers in the right classrooms. Our platform eliminates the friction in teacher recruitment — making it fast, fair, and human.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                Founded in Kozhikode, Kerala, we serve educators and institutions across 18 states, from small primary schools to large CBSE and ICSE institutions.
              </p>
              <div className="space-y-3">
                {["Zero-cost profiles for teachers", "Verified institution listings only", "Direct hiring — no middlemen", "Dedicated support team"].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <FaCircleCheck className="w-4 h-4 text-xyroots-teal shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-xs mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center justify-center p-10 border border-gray-100">
                <img src="/logo1.webp" alt="Xyroots Logo" className="w-full h-auto object-contain" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
            <p className="text-xs font-bold text-xyroots-teal uppercase tracking-widest mb-3">What Drives Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-[#f7f8fa] rounded-2xl p-6 border border-gray-100 hover:border-xyroots-teal/30 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-xyroots-teal to-[#068050] rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-xyroots-teal to-[#068050] text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-5">Ready to find your next opportunity?</h2>
            <p className="text-xyroots-mint/90 text-base mb-8">Join thousands of educators who found their dream classrooms through Xyroots.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/jobs" className="px-7 py-3.5 rounded-xl bg-white text-xyroots-teal font-bold text-sm hover:bg-green-50 transition-colors shadow-lg flex items-center gap-2">
                Browse Jobs <FaArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/services" className="px-7 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                Our Services
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
