"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaBars, FaXmark, FaArrowRightFromBracket, FaBriefcase, FaGear } from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getNavVisibility } from "@/lib/auth/permissions";

import AuthModal from "./AuthModal";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Scroll visibility
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const { requireTeacher, requireInstitution, isAuthenticated, role, profile, loading, signOut, openSignIn, openTeacherRegistration, openInstitutionRegistration } = useAuth();
  const router = useRouter();

  const visibility = getNavVisibility(role);

  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
    router.push('/');
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 150) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white border-b border-xyroots-border transition-transform duration-300 ${!showNavbar ? 'sm:-translate-y-full' : 'sm:translate-y-0'}`} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 lg:h-14">
            <Link href="/" className="flex items-center shrink-0" aria-label="Xyroots Home">
              <Image src="/logo1.webp" alt="Xyroots Logo" width={140} height={42} className="h-8 lg:h-9 w-auto object-contain" priority />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {visibility.findJobs && (
                !isAuthenticated ? (
                  <button onClick={() => requireTeacher(() => router.push('/jobs'))} className="px-3 py-2 text-sm font-medium text-xyroots-text hover:text-xyroots-teal hover:bg-xyroots-mint transition-colors">Find Jobs</button>
                ) : (
                  <NavLink href="/jobs">Find Jobs</NavLink>
                )
              )}
              {visibility.findInstitution && (
                !isAuthenticated ? (
                  <button onClick={() => requireTeacher(() => router.push('/institutions'))} className="px-3 py-2 text-sm font-medium text-xyroots-text hover:text-xyroots-teal hover:bg-xyroots-mint transition-colors">Find Institution</button>
                ) : (
                  <NavLink href="/institutions">Find Institution</NavLink>
                )
              )}
              {visibility.findTeacher && (
                !isAuthenticated ? (
                  <button onClick={() => requireInstitution(() => router.push('/teachers'))} className="px-3 py-2 text-sm font-medium text-xyroots-text hover:text-xyroots-teal hover:bg-xyroots-mint transition-colors">Find Teachers</button>
                ) : (
                  <NavLink href="/teachers">Find Teachers</NavLink>
                )
              )}
              <NavLink href="/about">About Us</NavLink>
              <NavLink href="/services">Services</NavLink>
              <NavLink href="/testimonials">Testimonials</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {!loading && !isAuthenticated ? (
                <>
                  <button onClick={() => openSignIn()} className="px-4 py-2 text-sm font-medium text-xyroots-text hover:text-xyroots-teal transition-colors">
                    Sign In
                  </button>
                  <button onClick={() => openTeacherRegistration()} className="px-4 py-2 text-sm font-medium border-2 border-xyroots-teal text-xyroots-teal hover:bg-xyroots-teal hover:text-white transition-all">
                    Register as Teacher
                  </button>
                  <button onClick={() => openInstitutionRegistration()} className="px-5 py-2.5 text-sm font-semibold bg-xyroots-teal text-white hover:opacity-90 transition-all">
                    Post a Job
                  </button>
                </>
              ) : isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-xyroots-border hover:border-xyroots-teal hover:shadow-sm transition-all bg-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-xyroots-cream flex items-center justify-center text-xyroots-teal font-bold overflow-hidden">
                      {profile?.avatar_url ? (
                        <Image src={profile.avatar_url} alt="Avatar" width={32} height={32} />
                      ) : (
                        <Image src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name?.replace(/\s+/g, '') || 'x'}&chars=2`} alt="Avatar" width={32} height={32} unoptimized />
                      )}
                    </div>
                    <span className="text-sm font-medium text-black max-w-[100px] truncate">
                      {profile?.full_name?.split(' ')[0] || "User"}
                    </span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-xyroots-border py-2 animate-modal-in z-50">
                      <div className="px-4 py-3 border-b border-xyroots-border mb-2">
                        <p className="text-sm font-bold text-black truncate">{profile?.full_name}</p>
                        <p className="text-xs text-xyroots-muted truncate mt-0.5">{profile?.email}</p>
                      </div>
                      
                      {role === 'teacher' && (
                        <Link href="/dashboard/teacher" className="flex items-center gap-3 px-4 py-2 text-sm text-xyroots-text hover:bg-xyroots-cream transition-colors" onClick={() => setProfileOpen(false)}>
                          <FaBriefcase className="w-4 h-4 text-xyroots-muted" /> Teacher Dashboard
                        </Link>
                      )}
                      
                      {role === 'management' && (
                        <>
                          <Link href="/dashboard/employer" className="flex items-center gap-3 px-4 py-2 text-sm text-xyroots-text hover:bg-xyroots-cream transition-colors" onClick={() => setProfileOpen(false)}>
                            <FaBriefcase className="w-4 h-4 text-xyroots-muted" /> Management Dashboard
                          </Link>
                          <Link href="/dashboard/employer?action=post-job" className="flex items-center gap-3 px-4 py-2 text-sm text-xyroots-text hover:bg-xyroots-cream transition-colors" onClick={() => setProfileOpen(false)}>
                            <FaPlus className="w-4 h-4 text-xyroots-teal" /> Post a Job
                          </Link>
                        </>
                      )}
                      
                      {role === 'agency' && (
                        <>
                          <Link href="/dashboard/agency" className="flex items-center gap-3 px-4 py-2 text-sm text-xyroots-text hover:bg-xyroots-cream transition-colors" onClick={() => setProfileOpen(false)}>
                            <FaBriefcase className="w-4 h-4 text-xyroots-muted" /> Agency Dashboard
                          </Link>
                          <Link href="/dashboard/agency?action=post-job" className="flex items-center gap-3 px-4 py-2 text-sm text-xyroots-text hover:bg-xyroots-cream transition-colors" onClick={() => setProfileOpen(false)}>
                            <FaPlus className="w-4 h-4 text-xyroots-teal" /> Post a Job
                          </Link>
                          <Link href="/dashboard/agency?action=post-teacher" className="flex items-center gap-3 px-4 py-2 text-sm text-xyroots-text hover:bg-xyroots-cream transition-colors" onClick={() => setProfileOpen(false)}>
                            <FaPlus className="w-4 h-4 text-xyroots-teal" /> Post a Profile
                          </Link>
                        </>
                      )}

                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-xyroots-text hover:bg-xyroots-cream transition-colors" onClick={() => setProfileOpen(false)}>
                        <FaGear className="w-4 h-4 text-xyroots-muted" /> Account Settings
                      </Link>
                      
                      <div className="border-t border-xyroots-border my-2" />
                      
                      <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                        <FaArrowRightFromBracket className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <button className="lg:hidden p-2 hover:bg-xyroots-mint transition-colors" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen}>
              <FaBars className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-xyroots-border">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Image src="/logo1.webp" alt="Xyroots Logo" width={160} height={48} className="h-9 lg:h-11 w-auto object-contain" />
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-gray-100" aria-label="Close menu">
                <FaXmark className="w-5 h-5" />
              </button>
            </div>
            
            {isAuthenticated && profile && (
              <div className="p-5 border-b border-xyroots-border bg-xyroots-cream flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xyroots-teal font-bold text-lg border border-xyroots-border overflow-hidden">
                  {profile.avatar_url ? (
                    <Image src={profile.avatar_url} alt="Avatar" width={48} height={48} />
                  ) : (
                    <Image src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name?.replace(/\s+/g, '') || 'x'}&chars=2`} alt="Avatar" width={48} height={48} unoptimized />
                  )}
                </div>
                <div>
                  <p className="font-bold text-black">{profile.full_name}</p>
                  <p className="text-xs text-xyroots-muted mt-0.5 capitalize">{role} Account</p>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-4">
              {visibility.findJobs && (
                !isAuthenticated ? (
                  <button onClick={() => requireTeacher(() => { setMobileOpen(false); router.push('/jobs') })} className="block w-full text-left px-6 py-3.5 text-base font-medium text-xyroots-text hover:bg-xyroots-mint hover:text-xyroots-teal transition-colors">Find Teaching Jobs</button>
                ) : (
                  <MobileNavLink href="/jobs" onClick={() => setMobileOpen(false)}>Find Teaching Jobs</MobileNavLink>
                )
              )}
              {visibility.findInstitution && (
                !isAuthenticated ? (
                  <button onClick={() => requireTeacher(() => { setMobileOpen(false); router.push('/institutions') })} className="block w-full text-left px-6 py-3.5 text-base font-medium text-xyroots-text hover:bg-xyroots-mint hover:text-xyroots-teal transition-colors">Find Institution</button>
                ) : (
                  <MobileNavLink href="/institutions" onClick={() => setMobileOpen(false)}>Find Institution</MobileNavLink>
                )
              )}
              {visibility.findTeacher && (
                !isAuthenticated ? (
                  <button onClick={() => requireInstitution(() => { setMobileOpen(false); router.push('/teachers') })} className="block w-full text-left px-6 py-3.5 text-base font-medium text-xyroots-text hover:bg-xyroots-mint hover:text-xyroots-teal transition-colors">Find Teachers</button>
                ) : (
                  <MobileNavLink href="/teachers" onClick={() => setMobileOpen(false)}>Find Teachers</MobileNavLink>
                )
              )}
              <MobileNavLink href="/about" onClick={() => setMobileOpen(false)}>About Us</MobileNavLink>
              <MobileNavLink href="/services" onClick={() => setMobileOpen(false)}>Services</MobileNavLink>
              <MobileNavLink href="/testimonials" onClick={() => setMobileOpen(false)}>Testimonials</MobileNavLink>
              <MobileNavLink href="/contact" onClick={() => setMobileOpen(false)}>Contact</MobileNavLink>
              
              <div className="border-t border-xyroots-border my-4 mx-4" />
              
              {!isAuthenticated ? (
                <button onClick={() => { openSignIn(); setMobileOpen(false); }} className="block w-full text-left px-6 py-3.5 text-base font-medium text-xyroots-text hover:bg-xyroots-mint hover:text-xyroots-teal transition-colors">
                  Sign In
                </button>
              ) : (
                <>
                  <MobileNavLink 
                    href={role === 'teacher' ? '/dashboard/teacher' : role === 'management' ? '/dashboard/employer' : '/dashboard/agency'} 
                    onClick={() => setMobileOpen(false)}
                  >
                    My Dashboard
                  </MobileNavLink>
                  <MobileNavLink href="/profile" onClick={() => setMobileOpen(false)}>
                    Account Settings
                  </MobileNavLink>
                  <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="w-full text-left px-6 py-3.5 text-base font-medium text-red-600 hover:bg-red-50 transition-colors">
                    Sign Out
                  </button>
                </>
              )}
            </div>
            
            {!isAuthenticated && (
              <div className="p-4 border-t border-xyroots-border space-y-3">
                <button onClick={() => openTeacherRegistration()} className="block w-full text-center px-4 py-3 text-sm font-semibold border-2 border-xyroots-teal text-xyroots-teal hover:bg-xyroots-teal hover:text-white transition-all">
                  Register as Teacher
                </button>
                <button onClick={() => openInstitutionRegistration()} className="block w-full text-center px-4 py-3 text-sm font-semibold bg-xyroots-teal text-white hover:opacity-90 transition-all">
                  Post a Teaching Job
                </button>
              </div>
            )}
          </div>
        </div>
      )}



      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
        
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-in { animation: modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-3 py-2 text-sm font-medium text-xyroots-text hover:text-xyroots-teal hover:bg-xyroots-mint transition-colors">
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block px-6 py-3.5 text-base font-medium text-xyroots-text hover:bg-xyroots-mint hover:text-xyroots-teal transition-colors">
      {children}
    </Link>
  );
}
