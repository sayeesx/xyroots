import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaArrowLeft, FaMagnifyingGlass } from "react-icons/fa6";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div
            className="w-20 h-20 bg-xyroots-mint flex items-center justify-center mx-auto mb-6"
            style={{ borderRadius: "50%" }}
          >
            <FaMagnifyingGlass className="w-9 h-9 text-xyroots-teal" />
          </div>
          <h1 className="text-6xl font-bold text-xyroots-dark mb-4">404</h1>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Page Not Found</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            The page you're looking for doesn't exist, has been moved, or is no longer available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-xyroots-teal text-white text-sm font-semibold"
              style={{ borderRadius: "0.75rem" }}
            >
              <FaArrowLeft className="w-3.5 h-3.5" /> Go Home
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:border-xyroots-teal hover:text-xyroots-teal transition-colors"
              style={{ borderRadius: "0.75rem" }}
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
