"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const posts = [
  { slug: "how-to-create-perfect-teacher-profile", title: "How to Create the Perfect Teacher Profile on Xyroots", category: "For Teachers", date: "Aug 10, 2026", time: "5 min read", excerpt: "Your Xyroots profile is your digital classroom door. Here's how to make it stand out to the best institutions across India." },
  { slug: "top-cbse-schools-hiring-2026", title: "Top CBSE Schools Hiring Teachers in 2026", category: "Hiring Trends", date: "Aug 7, 2026", time: "4 min read", excerpt: "A curated list of CBSE-affiliated institutions actively recruiting qualified educators this academic year." },
  { slug: "teacher-salary-guide-india-2026", title: "Teacher Salary Guide India 2026 — State by State Breakdown", category: "Salary & Benefits", date: "Aug 5, 2026", time: "7 min read", excerpt: "How much do teachers earn in Kerala, Maharashtra, Delhi and beyond? We break down the numbers across boards and experience levels." },
  { slug: "interview-tips-teacher-jobs", title: "10 Interview Tips Every Teacher Should Know", category: "Career Advice", date: "Aug 1, 2026", time: "6 min read", excerpt: "Land your dream teaching job with these proven interview strategies — from classroom demos to negotiating your package." },
  { slug: "icse-vs-cbse-which-board-to-teach", title: "ICSE vs CBSE: Which Board Is Better to Teach At?", category: "For Teachers", date: "Jul 28, 2026", time: "5 min read", excerpt: "Breaking down the differences in curriculum, workload, salary expectations, and career growth across India's two biggest boards." },
  { slug: "how-schools-use-xyroots-to-hire", title: "How Leading Schools Use Xyroots to Hire Better, Faster", category: "For Institutions", date: "Jul 25, 2026", time: "4 min read", excerpt: "A behind-the-scenes look at how school principals and HR managers use the Xyroots employer portal to find qualified teachers." },
];

const categories = ["All", "For Teachers", "For Institutions", "Hiring Trends", "Salary & Benefits", "Career Advice"];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#042816] via-[#074526] to-[#0a5c32] text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-editorial text-4xl sm:text-5xl text-white mb-4">Xyroots Blog</h1>
            <p className="text-green-100/80 text-lg">Insights, guides, and trends for educators and institutions across India.</p>
          </div>
        </section>

        {/* Categories */}
        <div className="bg-white border-b border-gray-100 sticky top-14 z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex overflow-x-auto gap-2 scrollbar-none">
            {categories.map(c => (
              <button key={c} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${c === 'All' ? 'bg-[#042816] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <section className="py-12 bg-[#f7f8fa]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col">
                <div className="h-36 bg-gradient-to-br from-[#042816] to-[#0a5c32] flex items-center justify-center p-6">
                  <p className="text-white/70 text-sm font-medium text-center leading-relaxed">{post.title}</p>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-xyroots-mint text-xyroots-teal">{post.category}</span>
                    <span className="text-[11px] text-gray-400">{post.time}</span>
                  </div>
                  <h2 className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-xyroots-teal transition-colors">{post.title}</h2>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className="text-xs font-bold text-xyroots-teal flex items-center gap-1">Read <FaArrowRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
