import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaGraduationCap, FaBuilding, FaArrowRight, FaCircleCheck } from "react-icons/fa6";

export default function RegisterChoicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-xyroots-cream/40">
      <Navbar />

      <main className="flex-1 pt-28 lg:pt-36 pb-20 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-teal mb-3">
              Join Xyroots
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-black mb-4">
              How will you be using Xyroots?
            </h1>
            <p className="text-base text-xyroots-muted">
              Select your path to create your customized account.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Teacher Option */}
            <div className="bg-white rounded-3xl p-8 border border-xyroots-border hover:border-xyroots-teal transition-all flex flex-col justify-between card-hover">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-xyroots-mint text-xyroots-teal flex items-center justify-center mb-6">
                  <FaGraduationCap className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-xyroots-teal uppercase tracking-wider bg-xyroots-mint px-3 py-1 rounded-full">
                  100% Free for Teachers
                </span>
                <h2 className="text-2xl font-bold text-black mt-3 mb-3">I'm a Teacher / Job Seeker</h2>
                <p className="text-sm text-xyroots-muted leading-relaxed mb-6">
                  Create your educator profile, showcase qualifications, upload teaching demo videos, and apply for top teaching positions.
                </p>

                <ul className="space-y-2 mb-8">
                  {[
                    "AI job matching",
                    "Application tracking",
                    "Direct school invitations",
                    "Verified qualifications badge",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-xyroots-text">
                      <FaCircleCheck className="w-4 h-4 text-xyroots-teal" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/register/teacher"
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-xyroots-teal text-white hover:bg-xyroots-dark transition-all text-center flex items-center justify-center gap-2"
              >
                Register as Teacher
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* School Option */}
            <div className="bg-white rounded-3xl p-8 border border-xyroots-border hover:border-xyroots-yellow transition-all flex flex-col justify-between card-hover">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-yellow-50 text-yellow-700 flex items-center justify-center mb-6">
                  <FaBuilding className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider bg-yellow-100 px-3 py-1 rounded-full">
                  For Institutions & Schools
                </span>
                <h2 className="text-2xl font-bold text-black mt-3 mb-3">I'm a School / Employer</h2>
                <p className="text-sm text-xyroots-muted leading-relaxed mb-6">
                  Register your school or college, post teaching vacancies, search verified educator profiles, and schedule interviews.
                </p>

                <ul className="space-y-2 mb-8">
                  {[
                    "Post unlimited vacancies",
                    "Access verified candidate database",
                    "Watch teaching demo videos",
                    "Hiring analytics dashboard",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-xyroots-text">
                      <FaCircleCheck className="w-4 h-4 text-xyroots-yellow" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/register/employer"
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-xyroots-yellow text-black hover:bg-yellow-400 transition-all text-center flex items-center justify-center gap-2"
              >
                Register as Institution
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
