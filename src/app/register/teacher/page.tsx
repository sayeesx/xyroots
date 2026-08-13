"use client";

import { useState } from "react";
import Link from "next/link";
import CustomSelect from "@/components/ui/CustomSelect";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaCheck, FaArrowRight, FaArrowLeft, FaUpload, FaVideo, FaCircleExclamation, FaSpinner } from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";


const subjectOptions = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "English", label: "English" },
];

const boardOptions = [
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "State Board", label: "State Board" },
  { value: "IB / IGCSE", label: "IB / IGCSE" },
];

export default function TeacherRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signUpTeacher, signIn } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    title: "",
    subject: "",
    board: "",
    qualification: "",
    profQualification: "",
    experienceYears: "",
    expectedSalary: "",
    preferredLocation: "",
  });

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.city) {
        setError("Please fill in all personal details.");
        return false;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.title || !formData.subject || !formData.board) {
        setError("Please fill in all professional details.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 8));
    }
  };
  
  const prevStep = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (!validateStep(step)) return;
    
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up the user securely
      const result = await signUpTeacher({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        password: formData.password,
      });

      if (!result.success) {
        setError(result.error || "Failed to register.");
        setLoading(false);
        return;
      }

      // 2. Sign them in immediately
      await signIn(formData.email, formData.password);

      // Note: Ideally, here we would also call an update action to save the rest 
      // of formData (city, title, board, experience, salary) to the teacher_profiles table.
      // For phase 1, creating the base account is the primary goal.

      setStep(8); // Show success step
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-xyroots-teal bg-xyroots-mint px-3 py-1 rounded-full mb-2">
              Educator Onboarding
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-black mb-2">
              Find your next teaching opportunity
            </h1>
            <p className="text-xs text-xyroots-muted">Step {step} of 8 — Build your professional teacher profile</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 bg-white p-3 rounded-2xl border border-xyroots-border">
            <div className="flex justify-between items-center mb-2 text-xs font-semibold text-black">
              <span>Progress</span>
              <span>{Math.round((step / 8) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2 bg-xyroots-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-xyroots-teal transition-all duration-300"
                style={{ width: `${(step / 8) * 100}%` }}
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
                <h2 className="text-lg font-bold text-black mb-4">1. Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-black block mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Anjali Menon"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                </div>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
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
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Current City / Location *</label>
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
                <h2 className="text-lg font-bold text-black mb-4">2. Professional Designation & Subject</h2>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Professional Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Mathematics Teacher"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Primary Subject *</label>
                  <CustomSelect value={formData.subject} onChange={(val) => setFormData({ ...formData, subject: val })} options={subjectOptions} placeholder="Select subject" />
                </div>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Primary Curriculum Board *</label>
                  <CustomSelect value={formData.board} onChange={(val) => setFormData({ ...formData, board: val })} options={boardOptions} placeholder="Select board" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-modal-in">
                <h2 className="text-lg font-bold text-black mb-4">3. Academic & Professional Qualifications</h2>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Academic Degree</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc Mathematics"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Professional Education Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Ed"
                    value={formData.profQualification}
                    onChange={(e) => setFormData({ ...formData, profQualification: e.target.value })}
                    className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 animate-modal-in">
                <h2 className="text-lg font-bold text-black mb-4">4. Teaching Experience</h2>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Total Years of Experience</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4 animate-modal-in">
                <h2 className="text-lg font-bold text-black mb-4">5. Preferences & Salary</h2>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Expected Monthly Salary (₹)</label>
                  <input
                    type="text"
                    placeholder="e.g. 40000"
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                    className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Preferred Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Kochi"
                    value={formData.preferredLocation}
                    onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                    className="w-full p-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border focus:border-xyroots-teal outline-none"
                  />
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4 animate-modal-in">
                <h2 className="text-lg font-bold text-black mb-4">6. Upload Curriculum Vitae (CV)</h2>
                <div className="border-2 border-dashed border-xyroots-border rounded-2xl p-8 text-center bg-xyroots-cream/30 hover:border-xyroots-teal cursor-pointer transition-colors">
                  <FaUpload className="w-10 h-10 text-xyroots-teal mx-auto mb-2" />
                  <p className="text-sm font-bold text-black">Click to upload your CV (PDF or Word)</p>
                  <p className="text-xs text-xyroots-muted mt-1">Maximum file size: 5MB</p>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4 animate-modal-in">
                <h2 className="text-lg font-bold text-black mb-4">7. Teaching Demo Video (Optional)</h2>
                <div className="border-2 border-dashed border-xyroots-border rounded-2xl p-8 text-center bg-xyroots-cream/30 hover:border-xyroots-teal cursor-pointer transition-colors">
                  <FaVideo className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-black">Upload a 2-5 min classroom demo video</p>
                  <p className="text-xs text-xyroots-muted mt-1">Profiles with videos get 3.5x more interview calls!</p>
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="text-center py-6 animate-modal-in">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Registration Successful!</h2>
                <p className="text-sm text-xyroots-muted mb-6">
                  Your educator profile has been created and you are now signed in.
                </p>
                <button
                  onClick={() => router.push("/dashboard/teacher")}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-xyroots-teal text-white font-semibold rounded-xl hover:bg-xyroots-dark transition-all"
                >
                  Go to Dashboard
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 8 && (
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
                
                {step === 7 ? (
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <><FaSpinner className="w-4 h-4 animate-spin" /> Registering...</>
                    ) : (
                      <>Complete Registration & Sign In <FaArrowRight className="w-4 h-4 inline" /></>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={loading}
                    className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors"
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
