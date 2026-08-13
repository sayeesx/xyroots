"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaXmark, FaBuilding, FaUser, FaUsers, FaBriefcase, FaEnvelope, FaLock, FaPhone, FaArrowRight, FaSpinner, FaCircleCheck } from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";

type AuthMode = "signin" | "signup_select" | "signup_teacher" | "signup_employer" | "signup_agency";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export default function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  
  const { signIn, signUpTeacher, signUpManagement, signUpAgency } = useAuth();
  
  // Track initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFieldErrors({});
      setError(null);
      setSuccessMsg(null);
    }
  }, [initialMode, isOpen]);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [orgName, setOrgName] = useState(""); // School or Agency name

  if (!isOpen) return null;

  const handleClose = () => {
    setMode(initialMode);
    setEmail("");
    setPassword("");
    setFullName("");
    setPhone("");
    setOrgName("");
    setError(null);
    setSuccessMsg(null);
    setFieldErrors({});
    onClose();
  };

  const validate = () => {
    const errs: Record<string, string[]> = {};
    if (!email) errs.email = ["Email is required."];
    if (!password) errs.password = ["Password is required."];
    if (mode !== "signin" && password.length > 0 && password.length < 8) errs.password = ["Password must be at least 8 characters."];
    if (mode === "signup_teacher" && !fullName) errs.fullName = ["Full name is required."];
    if (mode === "signup_teacher" && !phone) errs.phone = ["Phone number is required."];
    if ((mode === "signup_employer" || mode === "signup_agency") && !fullName) errs.contactName = ["Contact name is required."];
    if ((mode === "signup_employer" || mode === "signup_agency") && !phone) errs.phone = ["Phone number is required."];
    if (mode === "signup_employer" && !orgName) errs.institutionName = ["School/Institution Name is required."];
    if (mode === "signup_agency" && !orgName) errs.agencyName = ["Agency Name is required."];
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    setSuccessMsg(null);
    
    const vErrors = validate();
    if (Object.keys(vErrors).length > 0) {
      setFieldErrors(vErrors);
      // Removed the generic big error to focus on field errors as requested
      return;
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        const res = await signIn(email, password);
        if (!res.success) {
          setError(res.error || "Login failed");
        } else {
          handleClose();
        }
      } else if (mode === "signup_teacher") {
        const res = await signUpTeacher({ email, password, fullName, phone, subject: "General" });
        if (!res.success) {
          if (res.errors) setFieldErrors(res.errors);
          if (res.error) setError(res.error);
        } else {
          setMode("signin");
          setSuccessMsg("Registration successful! Please sign in.");
          setPassword("");
        }
      } else if (mode === "signup_employer") {
        const res = await signUpManagement({ email, password, contactName: fullName, phone, institutionName: orgName });
        if (!res.success) {
          if (res.errors) setFieldErrors(res.errors);
          if (res.error) setError(res.error);
        } else {
          setMode("signin");
          setSuccessMsg("Registration successful! Please sign in.");
          setPassword("");
        }
      } else if (mode === "signup_agency") {
        const res = await signUpAgency({ email, password, contactName: fullName, phone, agencyName: orgName });
        if (!res.success) {
          if (res.errors) setFieldErrors(res.errors);
          if (res.error) setError(res.error);
        } else {
          setMode("signin");
          setSuccessMsg("Registration successful! Please sign in.");
          setPassword("");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getBenefits = () => {
    if (mode === 'signup_teacher') return ["Access exclusive teaching opportunities", "Direct connection with verified schools"];
    if (mode === 'signup_employer') return ["Access our database of verified teachers", "Post jobs and manage candidates"];
    if (mode === 'signup_agency') return ["Manage multiple institutions", "Advanced candidate tracking tools"];
    return ["Join India's fastest growing network", "Verified members and secure platform"];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto modal-scrollbar">
      <div 
        className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative overflow-hidden animate-modal-in flex flex-col md:flex-row my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose} 
          className="absolute top-3 right-3 z-10 p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors border border-gray-100"
        >
          <FaXmark className="w-5 h-5" />
        </button>

        {/* Left Side: Thinner and Shorter */}
        <div className="md:w-[40%] bg-xyroots-cream p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-xyroots-border hidden md:flex relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-xyroots-teal/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-xyroots-yellow/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <Image src="/logo1.webp" alt="Xyroots Logo" width={140} height={40} className="object-contain h-7 w-auto" />
            
            <div className="mt-8">
              <h2 className="text-xl lg:text-2xl font-editorial font-bold text-black leading-tight mb-3">
                {mode === 'signin' ? "Welcome back." : 
                 mode === 'signup_teacher' ? "Your next classroom awaits." :
                 "Connect with top educators."}
              </h2>
            </div>
            
            <div className="mt-6 space-y-3">
              {getBenefits().map((benefit, i) => (
                <div key={i} className="flex items-start gap-2">
                  <FaCircleCheck className="w-4 h-4 text-xyroots-teal shrink-0 mt-0.5" />
                  <span className="text-sm text-black font-medium leading-snug">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 mt-8">
            <p className="text-xs text-xyroots-muted">© 2026 Xyroots</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-[60%] p-6 sm:p-8 bg-white max-h-[90vh] overflow-y-auto modal-scrollbar">
          <div className="md:hidden text-center mb-5">
            <Image src="/logo1.webp" alt="Xyroots Logo" width={120} height={32} className="mx-auto mb-2 object-contain h-7 w-auto" />
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-black">
              {mode === "signin" ? "Sign In" : 
               mode === "signup_select" ? "Join Xyroots" :
               mode === "signup_teacher" ? "Register as a Teacher" :
               mode === "signup_employer" ? "Register your School" :
               "Register your Agency"}
            </h2>
            <p className="text-sm text-xyroots-muted mt-1">
              {mode === "signin" ? "Enter your credentials below:" : "Enter your details to get started:"}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm font-medium flex items-center gap-2 shadow-sm">
              <FaCircleCheck className="w-4 h-4 text-green-600 shrink-0" />
              {successMsg}
            </div>
          )}

          {mode === "signup_select" ? (
            <div className="space-y-3">
              <button onClick={() => setMode("signup_teacher")} className="w-full p-4 rounded-xl border border-xyroots-border hover:border-xyroots-teal bg-white flex items-center gap-4 transition-all text-left group">
                <div className="w-10 h-10 rounded-lg bg-xyroots-cream group-hover:bg-xyroots-teal/10 flex items-center justify-center shrink-0 transition-colors">
                  <FaUser className="w-5 h-5 text-xyroots-teal" />
                </div>
                <div>
                  <p className="font-bold text-black text-sm">I'm a Teacher</p>
                </div>
                <FaArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-xyroots-teal" />
              </button>

              <button onClick={() => setMode("signup_employer")} className="w-full p-4 rounded-xl border border-xyroots-border hover:border-xyroots-yellow bg-white flex items-center gap-4 transition-all text-left group">
                <div className="w-10 h-10 rounded-lg bg-yellow-50 group-hover:bg-yellow-100 flex items-center justify-center shrink-0 transition-colors">
                  <FaBuilding className="w-5 h-5 text-xyroots-yellow" />
                </div>
                <div>
                  <p className="font-bold text-black text-sm">I'm a School / Institution</p>
                </div>
                <FaArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-xyroots-yellow" />
              </button>

              <button onClick={() => setMode("signup_agency")} className="w-full p-4 rounded-xl border border-xyroots-border hover:border-xyroots-dark bg-white flex items-center gap-4 transition-all text-left group">
                <div className="w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center shrink-0 transition-colors">
                  <FaBriefcase className="w-5 h-5 text-gray-500 group-hover:text-black" />
                </div>
                <div>
                  <p className="font-bold text-black text-sm">I'm a Consultancy / Agency</p>
                </div>
                <FaArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-black" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode !== "signin" && (
                <>
                  <div>
                    <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border ${fieldErrors.fullName || fieldErrors.contactName ? 'border-red-400' : 'border-gray-200'} rounded-lg outline-none focus:border-xyroots-teal`}
                      />
                    </div>
                    {(fieldErrors.fullName || fieldErrors.contactName) && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.fullName?.[0] || fieldErrors.contactName?.[0]}</p>
                    )}
                  </div>
                  
                  {(mode === "signup_employer" || mode === "signup_agency") && (
                    <div>
                      <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">
                        {mode === "signup_employer" ? "Institution Name" : "Agency Name"}
                      </label>
                      <div className="relative">
                        <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          placeholder={mode === "signup_employer" ? "Greenfield School" : "Elite Recruitments"}
                          className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border ${fieldErrors.institutionName || fieldErrors.agencyName ? 'border-red-400' : 'border-gray-200'} rounded-lg outline-none focus:border-xyroots-teal`}
                        />
                      </div>
                      {(fieldErrors.institutionName || fieldErrors.agencyName) && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.institutionName?.[0] || fieldErrors.agencyName?.[0]}</p>
                      )}
                    </div>
                  )}
                  
                  <div>
                    <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border ${fieldErrors.phone ? 'border-red-400' : 'border-gray-200'} rounded-lg outline-none focus:border-xyroots-teal`}
                      />
                    </div>
                    {fieldErrors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.phone[0]}</p>}
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border ${fieldErrors.email ? 'border-red-400' : 'border-gray-200'} rounded-lg outline-none focus:border-xyroots-teal`}
                  />
                </div>
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.email[0]}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-1">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signin" ? "Enter your password" : "Min. 8 characters"}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border ${fieldErrors.password ? 'border-red-400' : 'border-gray-200'} rounded-lg outline-none focus:border-xyroots-teal`}
                  />
                </div>
                {fieldErrors.password && <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.password[0]}</p>}
              </div>

              {mode === "signin" && (
                <div className="text-right">
                  <a href="#" className="text-xs font-bold text-xyroots-teal hover:underline text-stroke-sm">Forgot password?</a>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 mt-4 bg-xyroots-dark text-white rounded-lg text-sm font-bold flex items-center justify-center hover:bg-black transition-colors disabled:opacity-75"
              >
                {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : (
                  mode === "signin" ? "Sign In" : "Create Account"
                )}
              </button>
              
              {mode === "signin" && (
                <>
                  <div className="relative flex items-center py-1 mt-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] uppercase font-bold">Or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-lg font-bold text-sm bg-white border border-xyroots-border text-black hover:bg-xyroots-cream transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} />
                    Continue with Google
                  </button>
                </>
              )}
            </form>
          )}

          <div className="mt-5 text-center text-xs text-xyroots-muted border-t border-xyroots-border pt-4">
            {mode === "signin" ? (
              <p>Don't have an account? <button onClick={() => setMode("signup_select")} className="text-xyroots-teal font-bold hover:underline ml-1">Register</button></p>
            ) : mode === "signup_select" ? (
              <p>Already have an account? <button onClick={() => setMode("signin")} className="text-xyroots-teal font-bold hover:underline ml-1">Sign In</button></p>
            ) : (
              <div className="space-y-1">
                <p>Already have an account? <button onClick={() => setMode("signin")} className="text-xyroots-teal font-bold hover:underline ml-1">Sign In</button></p>
                {mode !== "signup_agency" && (
                  <p className="text-[11px] text-gray-400 mt-2">Are you a consultancy? <button onClick={() => setMode("signup_agency")} className="text-xyroots-teal font-bold hover:underline">Register Agencies</button></p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
