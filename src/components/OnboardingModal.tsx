"use client";

import React, { useState, useEffect } from 'react';
import { FaXmark, FaSpinner } from 'react-icons/fa6';
import { useAuth } from '@/lib/auth/AuthProvider';
import ResumeUpload from '@/components/ResumeUpload';
import type { ResumeData } from '@/lib/resume/schema';
import CustomSelect from '@/components/ui/CustomSelect';

const Loader = () => {
  return (
    <>
      <style>{`
        .loading {
          width: 124px;
          height: 124px;
        }

        .loading svg {
          display: block;
          width: 100%;
          height: 100%;
        }

        .circle {
          transform: rotate(-90deg);
          transform-origin: center;
          stroke-dasharray: 380;
          stroke-dashoffset: 380;
          animation: circle_4 2s ease-in-out forwards;
        }

        .check {
          stroke-dasharray: 45;
          stroke-dashoffset: 45;
          animation: check_4 0.2s 2s ease-in-out forwards;
        }

        @keyframes circle_4 {
          0% {
            stroke-dashoffset: 380;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes check_4 {
          0% {
            stroke-dashoffset: 45;
          }
          100% {
            stroke-dashoffset: 90;
          }
        }
      `}</style>
      <div className="loading">
        <svg xmlns="http://www.w3.org/2000/svg" width={124} height={124} viewBox="0 0 124 124">
          <circle className="circle-loading" cx={62} cy={62} r={59} fill="none" stroke="hsl(271, 76%, 74%)" strokeWidth="6px" />
          <circle className="circle" cx={62} cy={62} r={59} fill="none" stroke="hsl(271, 76%, 53%)" strokeWidth="6px" strokeLinecap="round" />
          <polyline className="check" points="73.56 48.63 57.88 72.69 49.38 62" fill="none" stroke="hsl(271, 76%, 53%)" strokeWidth="6px" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'teacher' | 'management' | 'agency' | null;
}

export default function OnboardingModal({ isOpen, onClose, role }: OnboardingModalProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { profile } = useAuth();
  
  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    location: '',
    city: '',
    
    // Professional Information  
    title: '',
    subject: '',
    specializations: [] as string[],
    qualification: '',
    professionalQualification: '',
    experienceYears: '',
    
    // Additional
    bio: '',
    skills: [] as string[],
    languages: [] as string[],
    boards: [] as string[],
    
    // For flow control
    showProfile: true,
    postJob: false
  });

  const subjectOptions = [
    { value: "Mathematics", label: "Mathematics" },
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "Biology", label: "Biology" },
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Social Science", label: "Social Science" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Commerce", label: "Commerce" },
    { value: "Economics", label: "Economics" },
  ];

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setShowSuccess(false);
      
      // Load existing profile data if available
      const loadProfileData = async () => {
        if (profile?.full_name) {
          setFormData(prev => ({
            ...prev,
            fullName: profile.full_name || '',
            email: profile.email || '',
            phone: profile.phone || ''
          }));
        }
      };
      
      loadProfileData();
    }
  }, [isOpen, profile]);

  const handleResumeExtracted = (data: ResumeData) => {
    // Fill form with resume data, preserving any manually entered data
    setFormData(prev => ({
      ...prev,
      fullName: prev.fullName || data.fullName || '',
      email: prev.email || data.email || '',
      phone: prev.phone || data.phone || '',
      location: prev.location || data.location || '',
      city: prev.city || data.city || '',
      title: prev.title || data.title || '',
      subject: prev.subject || data.subject || '',
      specializations: prev.specializations.length > 0 ? prev.specializations : data.specializations || [],
      qualification: prev.qualification || data.qualification || '',
      professionalQualification: prev.professionalQualification || data.professionalQualification || '',
      experienceYears: prev.experienceYears || (data.experienceYears ? String(data.experienceYears) : ''),
      skills: prev.skills.length > 0 ? prev.skills : data.skills || [],
      languages: prev.languages.length > 0 ? prev.languages : [],
      boards: prev.boards.length > 0 ? prev.boards : [],
      bio: prev.bio || '',
    }));
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate database saving
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    
    if (role === 'teacher') {
      // Step 2 is asking to show profile
      if (step === 1) {
        setStep(2);
      } else {
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } else if (role === 'agency') {
      // Agencies skip all steps, go straight to dashboard
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      // For management — step 1 saves profile, step 2 asks to post job
      if (step === 1) {
        setStep(2);
      } else {
        if (!formData.postJob) {
          setShowSuccess(true);
          setTimeout(() => {
            onClose();
          }, 3000);
        } else {
          // Redirect to post a job or open job modal
          onClose();
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-hidden">
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative animate-modal-in flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 z-10 p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors border border-gray-100"
        >
          <FaXmark className="w-5 h-5" />
        </button>

        <div className="p-8 overflow-y-auto modal-scrollbar">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader />
              <h3 className="mt-6 text-2xl font-bold font-editorial text-xyroots-dark">Registration Completed!</h3>
              <p className="text-gray-500 mt-2">Your details have been saved successfully.</p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div>
                  <div className="mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-black font-editorial uppercase tracking-wide">
                      {role === 'teacher' ? 'Teacher Profile Information' : role === 'management' ? 'Complete Your Institution Profile' : 'Welcome to Xyroots'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {role === 'teacher' ? 'Complete your professional teacher profile' : role === 'management' ? 'Add your institution details to get started' : 'Your agency account is ready to use'}
                    </p>
                  </div>

                  {role === 'teacher' && (
                    <div className="mb-6">
                      <ResumeUpload onExtracted={handleResumeExtracted} />
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white px-2 text-gray-500 uppercase font-bold">Or enter manually</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 pb-2 border-b">
                        {role === 'management' ? 'Institution Contact Details' : 'Personal Information'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">
                            {role === 'management' ? 'Contact Name' : 'Full Name'} <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            name="fullName" 
                            value={formData.fullName} 
                            onChange={handleChange} 
                            required 
                            placeholder={role === 'management' ? 'e.g. Dr. Rachel Varghese' : 'e.g. Anjali Menon'}
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Email Address <span className="text-red-500">*</span></label>
                          <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number <span className="text-red-500">*</span></label>
                          <input 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            required
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">
                            {role === 'management' ? 'School / Institution Location' : 'Current Location'} <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            name="location" 
                            value={formData.location} 
                            onChange={handleChange} 
                            required
                            placeholder="e.g. Kochi, Kerala"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Information — teacher only */}
                    {role === 'teacher' && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 pb-2 border-b">Professional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Professional Title <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            required
                            placeholder="e.g. Senior Mathematics Teacher"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Primary Subject <span className="text-red-500">*</span></label>
                          <CustomSelect 
                            value={formData.subject} 
                            onChange={(val) => setFormData({...formData, subject: val})} 
                            options={subjectOptions} 
                            placeholder="Select subject" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Academic Qualification</label>
                          <input 
                            type="text" 
                            name="qualification" 
                            value={formData.qualification} 
                            onChange={handleChange}
                            placeholder="e.g. M.Sc Mathematics"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Professional Qualification</label>
                          <input 
                            type="text" 
                            name="professionalQualification" 
                            value={formData.professionalQualification} 
                            onChange={handleChange}
                            placeholder="e.g. B.Ed, M.Ed"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Years of Experience</label>
                          <input 
                            type="number" 
                            name="experienceYears" 
                            value={formData.experienceYears} 
                            onChange={handleChange}
                            min="0"
                            max="50"
                            placeholder="e.g. 5"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal" 
                          />
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Institution details — management only */}
                    {role === 'management' && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 pb-2 border-b">Institution Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-gray-700 block mb-1">School / Institution Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            required
                            placeholder="e.g. Greenfield International School"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Your Role / Designation</label>
                          <input 
                            type="text" 
                            name="qualification" 
                            value={formData.qualification} 
                            onChange={handleChange}
                            placeholder="e.g. Principal, HR Manager"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Institution Website</label>
                          <input 
                            type="url" 
                            name="professionalQualification" 
                            value={formData.professionalQualification} 
                            onChange={handleChange}
                            placeholder="https://yourschool.edu.in"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal" 
                          />
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Optional Bio */}
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        {role === 'management' ? 'About Your Institution (Optional)' : 'Professional Bio (Optional)'}
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        placeholder={role === 'management' ? 'Brief description of your school and hiring needs...' : 'Brief description of your teaching experience and philosophy...'}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal resize-none"
                      />
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t">
                      <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 border border-gray-200">Cancel</button>
                      <button type="submit" disabled={loading} className="px-6 py-2.5 bg-xyroots-dark text-white rounded-lg text-sm font-bold flex items-center justify-center hover:bg-black transition-colors disabled:opacity-75">
                        {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : "Save & Continue"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="text-center py-8">
                  {role === 'teacher' ? (
                    <>
                      <h2 className="text-2xl font-bold font-editorial text-black mb-4">Profile Visibility</h2>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">Do you wish to show your profile to recruiters, institutions, and schools?</p>
                      
                      <div className="flex justify-center gap-4">
                        <button 
                          onClick={async () => {
                            setFormData(prev => ({...prev, showProfile: false}));
                            setLoading(true);
                            await new Promise(r => setTimeout(r, 1000));
                            setLoading(false);
                            setShowSuccess(true);
                            setTimeout(() => onClose(), 3000);
                          }}
                          className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-bold transition-all"
                          disabled={loading}
                        >
                          No, Keep Private
                        </button>
                        <button 
                          onClick={async () => {
                            setFormData(prev => ({...prev, showProfile: true}));
                            setLoading(true);
                            await new Promise(r => setTimeout(r, 1000));
                            setLoading(false);
                            setShowSuccess(true);
                            setTimeout(() => onClose(), 3000);
                          }}
                          className="px-6 py-3 rounded-xl bg-xyroots-teal text-white font-bold hover:bg-xyroots-teal/90 transition-all shadow-lg shadow-xyroots-teal/20"
                          disabled={loading}
                        >
                          Yes, Show Profile
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold font-editorial text-black mb-4">Post a New Job?</h2>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">Your details are saved! Would you like to post a new job opening right now?</p>
                      
                      <div className="flex justify-center gap-4">
                        <button 
                          onClick={async () => {
                            setFormData(prev => ({...prev, postJob: false}));
                            setLoading(true);
                            await new Promise(r => setTimeout(r, 1000));
                            setLoading(false);
                            setShowSuccess(true);
                            setTimeout(() => onClose(), 3000);
                          }}
                          className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-bold transition-all"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            setFormData(prev => ({...prev, postJob: true}));
                            onClose();
                            // If they want to post a job, they can be redirected by a layout or link outside
                            window.location.href = '/dashboard/employer/jobs/new';
                          }}
                          className="px-6 py-3 rounded-xl bg-xyroots-yellow text-black font-bold hover:bg-xyroots-yellow/90 transition-all shadow-lg shadow-xyroots-yellow/20"
                          disabled={loading}
                        >
                          Post a Job
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
