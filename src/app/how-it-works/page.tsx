import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import { FaCircleCheck, FaUserCheck, FaMagnifyingGlass, FaVideo, FaRegFileLines, FaWandMagicSparkles, FaBuilding } from "react-icons/fa6";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-24 lg:pt-32 pb-16">
        {/* Top Header */}
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-teal mb-3">
            The Xyroots Process
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-black mb-6">
            Rethinking Teacher Recruitment From the Ground Up.
          </h1>
          <p className="text-lg text-xyroots-muted leading-relaxed">
            Traditional job boards weren't designed for schools or educators. Xyroots builds transparent, verified connections that put classroom impact first.
          </p>
        </div>

        <HowItWorks />

        {/* Deep Dive Breakdown */}
        <section className="py-20 bg-xyroots-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* For Teachers */}
              <div className="bg-white rounded-3xl p-8 border border-xyroots-border">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-xyroots-teal bg-xyroots-mint px-3 py-1 rounded-full mb-4">
                  For Educators
                </span>
                <h2 className="font-editorial text-3xl text-black mb-4">
                  How Teachers Find Their Ideal Classroom
                </h2>
                <div className="space-y-4">
                  {[
                    "Create a rich profile with subject specializations, board experience & location preferences.",
                    "Upload teaching demo videos to showcase classroom delivery and communication skills.",
                    "Receive AI-matched job recommendations tailored to your experience and salary expectations.",
                    "Apply in one click and track application status from Reviewed to Interview to Offer.",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <FaCircleCheck className="w-5 h-5 text-xyroots-teal shrink-0 mt-0.5" />
                      <p className="text-sm text-xyroots-text leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link
                    href="/register/teacher"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-xyroots-teal text-white font-semibold text-sm hover:bg-xyroots-dark transition-colors"
                  >
                    Create Free Educator Profile
                  </Link>
                </div>
              </div>

              {/* For Schools */}
              <div className="bg-white rounded-3xl p-8 border border-xyroots-border">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full mb-4">
                  For Institutions
                </span>
                <h2 className="font-editorial text-3xl text-black mb-4">
                  How Schools Build Qualified Faculties
                </h2>
                <div className="space-y-4">
                  {[
                    "Post detailed vacancies specifying board requirements, experience and subject expertise.",
                    "Access a search database of verified teacher profiles with pre-screened qualifications.",
                    "Watch candidate teaching demo videos before committing time to initial interviews.",
                    "Manage candidate pipelines, schedule video calls, and issue offers seamlessly.",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <FaCircleCheck className="w-5 h-5 text-xyroots-yellow shrink-0 mt-0.5" />
                      <p className="text-sm text-xyroots-text leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link
                    href="/register/employer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-xyroots-yellow text-black font-semibold text-sm hover:bg-yellow-400 transition-colors"
                  >
                    Post a Teaching Vacancy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
