"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-xyroots-cream/30">
      <Navbar />

      <main className="flex-1 pt-24 lg:pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-black mb-6">
            About Xyroots
          </h1>
          <p className="text-lg sm:text-xl text-xyroots-muted mb-12">
            We are dedicated to bridging the gap between exceptional educators and outstanding institutions across India.
          </p>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-xyroots-border text-left">
            <h2 className="text-2xl font-bold text-black mb-4">Our Mission</h2>
            <p className="text-xyroots-muted mb-8 leading-relaxed">
              At Xyroots, our mission is to empower the education ecosystem by providing a seamless, transparent, and efficient recruitment platform. We believe that great teaching starts with great people, and we are committed to making sure every classroom has the right mentor.
            </p>

            <h2 className="text-2xl font-bold text-black mb-4">Why Choose Us?</h2>
            <ul className="list-disc list-inside space-y-3 text-xyroots-muted">
              <li>Verified profiles of thousands of qualified educators.</li>
              <li>Direct connections with top-tier schools and institutions.</li>
              <li>A dedicated support team ensuring seamless hiring.</li>
              <li>Advanced matching algorithms to find the perfect fit.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
