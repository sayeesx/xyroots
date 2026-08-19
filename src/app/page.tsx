import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustLogos from "@/components/TrustLogos";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy load heavy components so initial page paint is instant
const LatestVacancies = dynamic(() => import("@/components/LatestVacancies"), {
  loading: () => (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-6 bg-gray-100 rounded w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-gray-50 rounded-2xl border border-gray-100" />
          ))}
        </div>
      </div>
    </section>
  ),
  ssr: true,
});

const TeacherSection = dynamic(() => import("@/components/TeacherSection"), { ssr: true });

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustLogos />
        <Suspense fallback={
          <section className="py-12 px-4 bg-white">
            <div className="max-w-7xl mx-auto animate-pulse">
              <div className="h-6 bg-gray-100 rounded w-48 mb-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-44 bg-gray-50 rounded-2xl border border-gray-100" />
                ))}
              </div>
            </div>
          </section>
        }>
          <LatestVacancies />
        </Suspense>
        <HowItWorksSection />
        <TeacherSection />
      </main>
      <Footer />
    </div>
  );
}
