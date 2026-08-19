"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaXmark, FaSpinner, FaCamera, FaUser } from 'react-icons/fa6';
import { useAuth } from '@/lib/auth/AuthProvider';
import { updateTeacherProfile } from '@/lib/actions/profile';
import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import CustomSelect from '@/components/ui/CustomSelect';
import {
  SUBJECT_OPTIONS,
  QUALIFICATION_OPTIONS,
  PROFESSIONAL_QUALIFICATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  LOCATION_OPTIONS,
  toSelectOptions,
} from '@/lib/constants/options';

const Loader = () => (
  <>
    <style>{`
      .loading { width: 96px; height: 96px; }
      .loading svg { display: block; width: 100%; height: 100%; }
      .circle { transform: rotate(-90deg); transform-origin: center; stroke-dasharray: 380; stroke-dashoffset: 380; animation: circle_4 0.7s ease-in-out forwards; }
      .check { stroke-dasharray: 45; stroke-dashoffset: 45; animation: check_4 0.2s 0.75s ease-in-out forwards; }
      @keyframes circle_4 { 0% { stroke-dashoffset: 380; } 100% { stroke-dashoffset: 0; } }
      @keyframes check_4 { 0% { stroke-dashoffset: 45; } 100% { stroke-dashoffset: 90; } }
    `}</style>
    <div className="loading">
      <svg xmlns="http://www.w3.org/2000/svg" width={96} height={96} viewBox="0 0 124 124">
        <circle cx={62} cy={62} r={59} fill="none" stroke="hsl(271, 76%, 74%)" strokeWidth="6px" />
        <circle className="circle" cx={62} cy={62} r={59} fill="none" stroke="hsl(271, 76%, 53%)" strokeWidth="6px" strokeLinecap="round" />
        <polyline className="check" points="73.56 48.63 57.88 72.69 49.38 62" fill="none" stroke="hsl(271, 76%, 53%)" strokeWidth="6px" strokeLinecap="round" />
      </svg>
    </div>
  </>
);

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'teacher' | 'management' | 'agency' | null;
  onSaved?: () => void;
}

// Prepare select options from centralized constants
const subjectOptions = toSelectOptions(SUBJECT_OPTIONS, "Select subject");
const qualificationOptions = toSelectOptions(QUALIFICATION_OPTIONS, "Select qualification");
const professionalQualificationOptions = toSelectOptions(PROFESSIONAL_QUALIFICATION_OPTIONS, "Select teaching qualification");
const locationOptions = toSelectOptions(LOCATION_OPTIONS, "Select location");
const experienceSelectOptions = [
  { value: "", label: "Select years" },
  ...EXPERIENCE_OPTIONS,
];

// ─── SuggestInput — plain text input with datalist suggestions (no OK button, no Other option)
function SuggestInput({
  id, value, onChange, suggestions, placeholder, className,
}: {
  id?: string; value: string; onChange: (v: string) => void;
  suggestions: readonly string[]; placeholder?: string; className?: string;
}) {
  const listId = `suggest-${id || Math.random().toString(36).slice(2)}`;
  return (
    <div className="relative w-full">
      <input
        id={id}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        list={listId}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal ${className || ""}`}
      />
      <datalist id={listId}>
        {suggestions.filter(s => s !== "Other").map(s => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
}

export default function OnboardingModal({ isOpen, onClose, role, onSaved }: OnboardingModalProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { profile, refreshProfile } = useAuth();
  const supabase = createClient();

  // Avatar upload state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    subject: '',
    qualification: '',
    professionalQualification: '',
    experienceYears: '',
    bio: '',
    showProfile: true,
    postJob: false,
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setShowSuccess(false);
      setSaveError(null);
      setAvatarPreview(null);

      const loadProfileData = async () => {
        if (!profile) return;

        // Pre-fill from base profile
        setFormData(prev => ({
          ...prev,
          fullName: profile.full_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
        }));

        // Pre-fill from teacher profile
        if (profile.role === 'teacher') {
          const { data: tp } = await supabase
            .from('teacher_profiles')
            .select('*')
            .eq('profile_id', profile.id)
            .single();

          if (tp) {
            setFormData(prev => ({
              ...prev,
              location: (tp as any).location || '',
              title: (tp as any).title || '',
              subject: (tp as any).subject || '',
              qualification: (tp as any).qualification || '',
              professionalQualification: (tp as any).professional_qualification || '',
              experienceYears: (tp as any).experience_years != null ? String((tp as any).experience_years) : '',
              bio: (tp as any).bio || '',
            }));
          }
        }
      };
      loadProfileData();
    }
  }, [isOpen, profile]); // eslint-disable-line

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    if (!file.type.startsWith('image/')) { setSaveError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setSaveError('Image must be under 5MB.'); return; }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to Supabase storage — path must start with auth.uid() to pass RLS
    setAvatarUploading(true);
    setSaveError(null);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setSaveError('Not authenticated.'); setAvatarPreview(null); return; }
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `avatar-${uuidv4()}.${ext}`;
      const storagePath = `${authUser.id}/${filename}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(storagePath, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(storagePath);
      const publicUrl = urlData.publicUrl;

      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
      if (profile.role === 'teacher') {
        await supabase.from('teacher_profiles').update({ avatar_path: publicUrl } as any).eq('profile_id', profile.id);
      }
      await refreshProfile();
    } catch (err: any) {
      setSaveError(err.message || 'Failed to upload photo. Try again.');
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
    }
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    setSaveError(null);

    try {
      if (role === 'teacher') {
        // Update base profile (phone)
        await (supabase.from('profiles') as any)
          .update({ phone: formData.phone || null, updated_at: new Date().toISOString() })
          .eq('id', profile.id);

        // Build teacher profile update payload
        const expYears = formData.experienceYears !== '' ? parseInt(formData.experienceYears) : null;
        const updatePayload = {
          title: formData.title || null,
          subject: formData.subject || null,
          location: formData.location || null,
          qualification: formData.qualification || null,
          professional_qualification: formData.professionalQualification || null,
          experience_years: expYears,
          bio: formData.bio || null,
        };

        const result = await updateTeacherProfile(profile.id, updatePayload);

        if (!result.success) {
          setSaveError(result.error || 'Failed to save profile. Please try again.');
          setLoading(false);
          return;
        }

        // profile_completion is recalculated server-side in updateTeacherProfile
        await refreshProfile();

        // Close directly — no step 2 needed, profile is saved
        setShowSuccess(true);
        setTimeout(() => { onSaved?.(); onClose(); }, 1200);
      } else if (role === 'management') {
        if (step === 1) {
          // Upsert management profile (handles both new and existing rows)
          const { error: mpError } = await (supabase.from('management_profiles') as any)
            .upsert({
              profile_id: profile.id,
              contact_name: formData.fullName,
              phone: formData.phone || null,
              institution_name: formData.title || null,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'profile_id' });

          if (mpError) {
            // If upsert fails, try insert (first time)
            await (supabase.from('management_profiles') as any)
              .insert({
                profile_id: profile.id,
                contact_name: formData.fullName,
                phone: formData.phone || null,
                institution_name: formData.title || null,
              }).select().single();
          }

          await (supabase.from('profiles') as any)
            .update({
              full_name: formData.fullName || profile.full_name,
              phone: formData.phone || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);

          await refreshProfile();
          setShowSuccess(true);
          setTimeout(() => { onSaved?.(); onClose(); }, 1200);
        } else {
          setShowSuccess(true);
          setTimeout(() => { onSaved?.(); onClose(); }, 1200);
        }
      } else {
        // Agency — just close after confirming
        setShowSuccess(true);
        setTimeout(() => { onSaved?.(); onClose(); }, 1200);
      }
    } catch (err) {
      setSaveError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-hidden">
      <div
        className="bg-white rounded-2xl w-full max-w-4xl relative animate-modal-in flex flex-col my-auto max-h-[90vh]"
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
              <h3 className="mt-6 text-2xl font-bold font-editorial text-xyroots-dark">Profile Saved!</h3>
              <p className="text-gray-500 mt-2">Your details have been updated successfully.</p>
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
                      {/* Profile Picture Upload */}
                      <div className="flex items-center gap-5 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="relative shrink-0">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                            {avatarPreview ? (
                              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : profile?.avatar_url ? (
                              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <FaUser className="w-8 h-8 text-gray-300" />
                            )}
                          </div>
                          {avatarUploading && (
                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                              <FaSpinner className="w-5 h-5 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 mb-0.5">Profile Photo</p>
                          <p className="text-xs text-gray-500 mb-3">Upload a clear photo. JPG, PNG or WebP · Max 5MB</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                            id="avatar-upload-input"
                          />
                          <label
                            htmlFor="avatar-upload-input"
                            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                              avatarUploading
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-xyroots-teal hover:text-xyroots-teal'
                            }`}
                          >
                            <FaCamera className="w-3.5 h-3.5" />
                            {avatarUploading ? 'Uploading...' : avatarPreview || profile?.avatar_url ? 'Change Photo' : 'Upload Photo'}
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {saveError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                        {saveError}
                      </div>
                    )}

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
                          <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                          <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-4 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">
                            {role === 'management' ? 'Institution Location' : 'Current Location'}
                          </label>
                          <CustomSelect
                            value={formData.location}
                            onChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
                            options={locationOptions}
                            placeholder="Select location"
                            searchable
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
                            <label className="text-xs font-bold text-gray-700 block mb-1">Professional Title</label>
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              placeholder="e.g. Senior Mathematics Teacher"
                              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Primary Subject <span className="text-red-500">*</span></label>
                            <CustomSelect
                              value={formData.subject}
                              onChange={(val) => setFormData(prev => ({ ...prev, subject: val }))}
                              options={subjectOptions}
                              placeholder="Select subject"
                              searchable
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Academic Qualification</label>
                            <CustomSelect
                              value={formData.qualification}
                              onChange={(val) => setFormData(prev => ({ ...prev, qualification: val }))}
                              options={qualificationOptions}
                              placeholder="Select qualification"
                              searchable
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Teaching Qualification</label>
                            <CustomSelect
                              value={formData.professionalQualification}
                              onChange={(val) => setFormData(prev => ({ ...prev, professionalQualification: val }))}
                              options={professionalQualificationOptions}
                              placeholder="Select teaching qualification"
                              searchable
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Years of Experience</label>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={formData.experienceYears}
                              onChange={e => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
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
                        onChange={handleChange}
                        rows={3}
                        placeholder={role === 'management' ? 'Brief description of your school and hiring needs...' : 'Brief description of your teaching experience and philosophy...'}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-xyroots-teal resize-none"
                      />
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t">
                      <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 border border-gray-200">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-xyroots-dark text-white rounded-lg text-sm font-bold flex items-center justify-center hover:bg-black transition-colors disabled:opacity-75 min-w-[140px]"
                      >
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
                            setLoading(true);
                            if (profile) {
                              await (supabase.from('teacher_profiles') as any)
                                .update({ is_visible: false })
                                .eq('profile_id', profile.id);
                            }
                            setLoading(false);
                            setShowSuccess(true);
                            setTimeout(() => { onSaved?.(); onClose(); }, 1200);
                          }}
                          disabled={loading}
                          className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-bold transition-all"
                        >
                          No, Keep Private
                        </button>
                        <button
                          onClick={async () => {
                            setLoading(true);
                            if (profile) {
                              await (supabase.from('teacher_profiles') as any)
                                .update({ is_visible: true })
                                .eq('profile_id', profile.id);
                            }
                            setLoading(false);
                            setShowSuccess(true);
                            setTimeout(() => { onSaved?.(); onClose(); }, 1200);
                          }}
                          disabled={loading}
                          className="px-6 py-3 rounded-xl bg-xyroots-teal text-white font-bold hover:bg-xyroots-teal/90 transition-all -teal/20"
                        >
                          {loading ? <FaSpinner className="w-4 h-4 animate-spin mx-auto" /> : 'Yes, Show Profile'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold font-editorial text-black mb-4">Post a New Job?</h2>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">Your details are saved! Would you like to post a new job opening right now?</p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => { setShowSuccess(true); setTimeout(() => { onSaved?.(); onClose(); }, 1200); }}
                          disabled={loading}
                          className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-bold transition-all"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            window.location.href = '/dashboard/employer?action=post-job';
                          }}
                          className="px-6 py-3 rounded-xl bg-xyroots-teal text-white font-bold hover:bg-xyroots-teal/90 transition-all"
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
