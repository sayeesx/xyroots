import Link from "next/link";
import AuthGuardedLink from "@/components/AuthGuardedLink";
import Image from "next/image";
import {
  FaLocationDot,
  FaEnvelope,
  FaPhone,
  FaGlobe,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-black text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/logo2.png"
                alt="Xyroots Footer Logo"
                width={200}
                height={60}
                className="h-12 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 brightness-200"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Connecting educators with institutions that believe great teaching
              starts with great people.
            </p>
            <div className="space-y-2.5 mt-2">
              <a href="https://maps.google.com/?q=Muallim+Complex+Arayadath+palam+Kozhikode" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-xs text-gray-400 hover:text-white transition-colors group">
                <FaLocationDot className="w-3.5 h-3.5 shrink-0 text-xyroots-teal mt-0.5" />
                <span>Muallim Complex, Second floor,<br />Arayadath Palam, Kozhikode 673004</span>
              </a>
              <a href="tel:+916235758639" className="flex items-center gap-2.5 text-xs text-gray-400 hover:text-white transition-colors">
                <FaPhone className="w-3.5 h-3.5 shrink-0 text-xyroots-teal" />
                +91 6235 758 639
              </a>
              <a href="mailto:mail@xyroots.com" className="flex items-center gap-2.5 text-xs text-gray-400 hover:text-white transition-colors">
                <FaEnvelope className="w-3.5 h-3.5 shrink-0 text-xyroots-teal" />
                mail@xyroots.com
              </a>
              <a href="https://xyroots.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-xs text-gray-400 hover:text-white transition-colors">
                <FaGlobe className="w-3.5 h-3.5 shrink-0 text-xyroots-teal" />
                xyroots.com
              </a>
            </div>
          </div>

          {/* For Teachers */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-xyroots-teal mb-4">
              For Teachers
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/jobs">Find Jobs</FooterLink>
              <li><span className="text-xs sm:text-sm text-gray-400">Create Profile</span></li>
              <li><span className="text-xs sm:text-sm text-gray-400">Saved Jobs</span></li>
              <li><span className="text-xs sm:text-sm text-gray-400">Applications</span></li>
              <li><span className="text-xs sm:text-sm text-gray-400">Interview Schedule</span></li>
            </ul>
          </div>

          {/* Find Institution */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-xyroots-teal mb-4">
              Find Institution
            </h3>
            <ul className="space-y-3">
              <li><span className="text-xs sm:text-sm text-gray-400">Post a Job</span></li>
              <li><Link href="/jobs" className="text-xs sm:text-sm text-gray-400 hover:text-xyroots-teal transition-colors">Find Jobs</Link></li>
              <li><span className="text-xs sm:text-sm text-gray-400">Candidate Search</span></li>
              <li><span className="text-xs sm:text-sm text-gray-400">Hiring Dashboard</span></li>
              <li><span className="text-xs sm:text-sm text-gray-400">Pricing</span></li>
            </ul>
          </div>



          {/* Company */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-xyroots-teal mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/services">Services</FooterLink>
              <FooterLink href="/testimonials">Testimonials</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Legal & SEO */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-xyroots-teal mb-4">
              Legal & Support
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/security">Security</FooterLink>
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/sitemap.xml">Sitemap</FooterLink>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Xyroots. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built &amp; Licensed by{" "}
            <a href="https://www.narrs.in" target="_blank" rel="noopener noreferrer" className="text-[#00a264] hover:underline font-medium">
              Narrs
            </a>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/security" className="text-sm text-gray-500 hover:text-white transition-colors">
              Security
            </Link>
            <Link href="/sitemap.xml" className="text-sm text-gray-500 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00a264] transition-colors"
    >
      {children}
    </a>
  );
}
