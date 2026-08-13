import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustLogos from "@/components/TrustLogos";
import LatestVacancies from "@/components/LatestVacancies";
import TeacherSection from "@/components/TeacherSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustLogos />
        <LatestVacancies />
        <TeacherSection />
      </main>
      <Footer />
    </div>
  );
}
