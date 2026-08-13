import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Xyroots",
  description: "Privacy Policy for Xyroots",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-16 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <div className="prose prose-sm text-gray-700">
            <p className="mb-4">Last Updated: August 13, 2026</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information that you manually provide to us when you create an account, such as your name, email, phone number, and professional details (for teachers) or institutional details (for schools/agencies).
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use your information to facilitate connections between educators and institutions. We do not sell your personal data to any third parties.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
            <p className="mb-4">
              We employ industry standard security measures to protect your data. Your data is encrypted in transit and at rest. Please review our <Link href="/security" className="text-xyroots-teal hover:underline">Security Policy</Link> for more details.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Your Rights</h2>
            <p className="mb-4">
              You have the right to access, rectify, or delete your personal data. You can delete your account directly from your account settings at any time.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at mail@xyroots.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
