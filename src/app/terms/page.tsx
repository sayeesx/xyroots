import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | Xyroots",
  description: "Terms of Service for Xyroots",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <div className="prose prose-sm text-gray-700">
            <p className="mb-4">Last Updated: August 13, 2026</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Xyroots, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. User Accounts</h2>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account and password. You must provide accurate and complete information during registration.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Prohibited Conduct</h2>
            <p className="mb-4">
              You agree not to use the platform for any unlawful purpose, or to submit false, inaccurate, or misleading information. Institutions must post genuine job vacancies.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Platform Role</h2>
            <p className="mb-4">
              Xyroots acts as a venue for employers to post job opportunities and candidates to post resumes. We are not involved in the actual transaction between employers and candidates.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Modifications</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any significant changes.
            </p>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
