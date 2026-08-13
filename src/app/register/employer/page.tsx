"use client";

import { useState } from "react";
import Link from "next/link";
import CustomSelect from "@/components/ui/CustomSelect";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaCheck, FaArrowRight, FaArrowLeft, FaBuilding, FaUpload, FaCircleExclamation, FaSpinner } from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";


const typeOptions = [
  { value: "K-12 CBSE School", label: "K-12 CBSE School" },
  { value: "ICSE / ISC School", label: "ICSE / ISC School" },
  { value: "Junior College / Higher Secondary", label: "Junior College / Higher Secondary" },
  { value: "Educational Trust / Group", label: "Educational Trust / Group" },
  { value: "International School (IB/IGCSE)", label: "International School (IB/IGCSE)" },
];

export default function EmployerRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signUpManagement, signIn } = useAuth();

  const [formData, setFormData] = useState({
    institutionName: "",
    type: "",
    city: "",
    website: "",
    contactName: "",
    contactRole: "",
    email: "",
    phone: "",
    password: "",
  });

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.institutionName || !formData.type || !formData.city) {
        setError("Please fill in all institution details.");
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.contactName || !formData.email || !formData.phone || !formData.password || !formData.contactRole) {
        setError("Please fill in all contact details.");
        return false;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };
  
  const prevStep = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up the user securely
      const result = await signUpManagement({
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        institutionName: formData.institutionName,
      });

      if (!result.success) {
        setError(result.error || "Failed to register.");
        setLoading(false);
        return;
      }

      // 2. Sign them in immediately
      await signIn(formData.email, formData.password);

      setStep(4); // Show success step
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-xyroots-cream/40">
      <Navbar />

      <main className="flex-1 pt-24 lg:pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Header */}
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full mb-2">
              Institution Onboarding
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-black mb-2">
              Register Your Educational Institution
            </h1>
            <p className="text-xs text-xyroots-muted">Step {step} of 4 — Build your school hiring profile</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 bg-white p-3 rounded-2xl border border-xyroots-border">
            <div className="flex justify-between items-center mb-2 text-xs font-semibold text-black">
              <span>Progress</span>
              <span>{Math.round((step / 4) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2 bg-xyroots-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-xyroots-teal transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
              <FaCircleExclamation className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-xyroots-border shadow-xl">
            {step === 1 && (
              <div className="space-y-4 animate-modal-in">
                <h2 className="text-lg font-bold text-black mb-4">1. Institution Details</h2>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">School / Institution Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Greenfield International School"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Institution Type *</label>
                  <CustomSelect value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })} options={typeOptions} placeholder="Select institution type" />
                </div>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Location / City *</label>
                  <input
                    type="text"
                    placeholder="e.g. Kochi, Kerala"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-modal-in">
                <h2 className="text-lg font-bold text-black mb-4">2. Authorized Contact Person & Security</h2>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rachel Varghese"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    placeholder="e.g. Principal / Administrator"
                    value={formData.contactRole}
                    onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                    className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-black block mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      placeholder="admin@school.edu.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-black block mb-1">Password *</label>
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-modal-in">
                <h2 className="text-lg font-bold text-black mb-4">3. Verification Document</h2>
                <p className="text-xs text-xyroots-muted mb-4">
                  Upload affiliation proof or official authorization letter to receive your Verified Institution Badge.
                </p>
                <div className="border-2 border-dashed border-xyroots-border rounded-2xl p-8 text-center bg-xyroots-cream/30 hover:border-xyroots-yellow cursor-pointer transition-colors">
                  <FaUpload className="w-10 h-10 text-xyroots-yellow mx-auto mb-2" />
                  <p className="text-sm font-bold text-black">Click to upload Affiliation / Recognition Letter</p>
                  <p className="text-xs text-xyroots-muted mt-1">PDF or image format, max 10MB</p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-6 animate-modal-in">
                <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">School Account Registered!</h2>
                <p className="text-sm text-xyroots-muted mb-6">
                  You can now post teaching vacancies and start searching verified candidate profiles.
                </p>
                <button
                  onClick={() => router.push("/dashboard/employer")}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-xyroots-yellow text-black font-semibold rounded-xl hover:bg-yellow-400 transition-all"
                >
                  Go to School Dashboard
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between items-center pt-6 mt-6 border-t border-xyroots-border">
                <button
                  onClick={prevStep}
                  disabled={step === 1 || loading}
                  className={`px-5 py-2.5 text-xs font-semibold rounded-xl border border-xyroots-border ${
                    step === 1 || loading ? "opacity-30 cursor-not-allowed" : "hover:bg-xyroots-cream text-black"
                  }`}
                >
                  <FaArrowLeft className="w-4 h-4 inline mr-1" /> Back
                </button>
                {step === 3 ? (
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <><FaSpinner className="w-4 h-4 animate-spin" /> Registering...</>
                    ) : (
                      <>Complete Registration <FaArrowRight className="w-4 h-4 inline" /></>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={loading}
                    className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors flex items-center"
                  >
                    Continue <FaArrowRight className="w-4 h-4 inline ml-1" />
                  </button>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="mt-8 text-center border-t border-xyroots-border pt-6">
                <p className="text-xs text-xyroots-muted">
                  Already have an account?{" "}
                  <Link href="/login" className="text-xyroots-teal font-bold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
