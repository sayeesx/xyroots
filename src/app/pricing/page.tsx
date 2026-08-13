import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import TestimonialSection from "@/components/TestimonialSection";
import CTASection from "@/components/CTASection";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 pt-24 lg:pt-32">
        <PricingSection />
        <TestimonialSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
