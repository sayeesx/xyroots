"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import getCroppedImg from "@/lib/utils/cropImage";
import Cropper from "react-easy-crop";
import { FaSpinner, FaUpload, FaXmark, FaAsterisk, FaArrowLeft } from "react-icons/fa6";

export default function ProfileSettingsPage() {
  const { user, profile, loading, isAuthenticated, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [loading, isAuthenticated, router]);

  // Avatar Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cropper State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = (croppedArea: any, croppedAreaPx: any) => {
    setCroppedAreaPixels(croppedAreaPx);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
        setCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels || !user || !profile) return;
    setIsUploading(true);
    setError(null);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Could not process image");

      const file = new File([croppedBlob], `avatar-${uuidv4()}.webp`, { type: "image/webp" });
      
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}/${file.name}`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${user.id}/${file.name}`);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;
      
      if (profile.role === 'teacher') {
         await supabase
         .from('teacher_profiles')
         .update({ avatar_path: publicUrlData.publicUrl })
         .eq('profile_id', profile.id)
      }

      await refreshProfile();
      setCropModalOpen(false);
      setImageSrc(null);
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="w-8 h-8 text-xyroots-teal animate-spin" />
      </div>
    );
  }

  // Create dicebear 
  let currentAvatar = profile?.avatar_url;
  if (!currentAvatar) {
    const seed = profile?.full_name ? profile.full_name.replace(/\s+/g, '') : 'xyroots';
    currentAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&chars=2`;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-xyroots-teal mb-6 transition-colors"
        >
          <FaArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <h1 className="text-3xl font-bold font-editorial text-black mb-8">Account Settings</h1>

        <div className="bg-white rounded-2xl border border-xyroots-border p-6 sm:p-8">
          <h2 className="text-xl font-bold text-black mb-6 border-b border-xyroots-border pb-4">Profile Information</h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-xyroots-cream border-2 border-xyroots-border">
                <img src={currentAvatar} alt="Profile Avatar" className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full font-semibold text-sm cursor-pointer"
              >
                <FaUpload className="w-5 h-5 mb-1" />
                Change
              </button>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFileChange} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-black text-lg">{profile?.full_name}</h3>
              <p className="text-xyroots-muted text-sm mb-4">{profile?.email}</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-xyroots-border hover:border-xyroots-teal rounded-lg text-sm font-semibold transition-colors bg-white text-black"
              >
                Upload new picture
              </button>
            </div>
          </div>
          
          {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          <div className="space-y-6">
            <div>
               <label className="block text-sm font-bold text-black mb-1.5 flex items-center gap-1">Full Name <FaAsterisk className="w-2 h-2 text-red-500" /></label>
               <input disabled value={profile?.full_name || ""} className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none" />
               <p className="text-xs text-xyroots-muted mt-1">Contact support to change your name.</p>
            </div>
            <div>
               <label className="block text-sm font-bold text-black mb-1.5 flex items-center gap-1">Email <FaAsterisk className="w-2 h-2 text-red-500" /></label>
               <input disabled value={profile?.email || ""} className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Crop Modal */}
      {cropModalOpen && imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg relative overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
               <h3 className="font-bold text-black">Crop Avatar</h3>
               <button onClick={() => { setCropModalOpen(false); setImageSrc(null); }} className="p-1 hover:bg-gray-100 rounded-full"><FaXmark className="w-5 h-5 text-gray-500" /></button>
            </div>
            
            <div className="relative w-full h-[400px] bg-gray-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            
            <div className="p-5 border-t border-gray-100">
               <div className="flex items-center gap-4 mb-5">
                 <span className="text-sm font-medium text-gray-500">Zoom</span>
                 <input
                   type="range"
                   value={zoom}
                   min={1}
                   max={3}
                   step={0.1}
                   aria-labelledby="Zoom"
                   onChange={(e) => {
                     setZoom(Number(e.target.value))
                   }}
                   className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-xyroots-teal"
                 />
               </div>
               
               <div className="flex justify-end gap-3">
                 <button onClick={() => { setCropModalOpen(false); setImageSrc(null); }} className="px-5 py-2 font-semibold text-sm border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
                 <button 
                   onClick={handleUpload} 
                   disabled={isUploading}
                   className="px-5 py-2 font-semibold text-sm bg-xyroots-teal hover:bg-[#1a5b4c] text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                 >
                   {isUploading ? <><FaSpinner className="w-4 h-4 animate-spin" /> Processing...</> : "Save Avatar"}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
