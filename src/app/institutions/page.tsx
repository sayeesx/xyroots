"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  FaMagnifyingGlass, FaLocationDot, FaShieldHalved, FaUsers, FaChevronRight,
  FaBuilding, FaBriefcase, FaStar,
  FaSchool, FaRegBuilding, FaLock
} from "react-icons/fa6";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";

const TYPE_OPTIONS = [
  { value: "All", label: "All Types" },
  { value: "International", label: "International" },
  { value: "Private", label: "Private" },
  { value: "Government", label: "Government" },
  { value: "Coaching", label: "Coaching" },
];

const LOCATION_OPTIONS = [
  { value: "All", label: "All Locations" },
  { value: "Kerala", label: "Kerala" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Delhi", label: "Delhi" },
];

const BOARD_OPTIONS = [
  { value: "All", label: "All Boards" },
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "IB", label: "IB" },
  { value: "IGCSE", label: "IGCSE" },
  { value: "State Board", label: "State Board" },
];

const stats = [
  { value: "1,200+", label: "Institutions", icon: FaBuilding },
  { value: "18,000+", label: "Teachers Placed", icon: FaUsers },
  { value: "97%", label: "Satisfaction Rate", icon: FaStar },
  { value: "32", label: "States Covered", icon: FaLocationDot },
];

// ─── Real Institution Card (from Supabase) ────────────────────────────────────
function RealInstitutionCard({ inst, openPositions }: { inst: any; openPositions: number }) {
  const colors = ["#f0fdf4", "#eff6ff", "#fdf4ff", "#fff7ed"];
  const accents = ["#00a264", "#2563eb", "#9333ea", "#ea580c"];
  const idx = (inst.name?.charCodeAt(0) || 0) % colors.length;

  return (
    <Link
      href={`/institutions/${inst.id}`}
      className="bg-white border border-gray-200 hover:border-[#00a264]/50 hover:shadow-[0_4px_24px_rgba(0,162,100,0.10)] transition-all duration-300 flex flex-col group"
      style={{ borderRadius: "1.25rem" }}
    >
      <div
        className="px-5 pt-5 pb-4 flex items-start justify-between"
        style={{ background: `linear-gradient(135deg, ${colors[idx]} 0%, #fff 100%)`, borderRadius: "1.25rem 1.25rem 0 0" }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 shrink-0 flex items-center justify-center text-white text-sm font-bold overflow-hidden"
            style={{ borderRadius: "0.875rem", background: inst.logo_url ? "transparent" : `linear-gradient(135deg, ${accents[idx]}, ${accents[idx]}cc)` }}
          >
            {inst.logo_url
              ? <img src={inst.logo_url} alt={inst.name} className="w-full h-full object-cover" style={{ borderRadius: "0.875rem" }} />
              : (inst.name || "I").charAt(0).toUpperCase()
            }
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 group-hover:text-[#00a264] transition-colors leading-tight">{inst.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <FaLocationDot className="w-3 h-3 text-[#00a264]" />
              {inst.location || "India"}
            </p>
          </div>
        </div>
        {inst.verified && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-[#e6f7ed] text-[#00a264] shrink-0" style={{ borderRadius: "999px" }}>
            <FaShieldHalved className="w-2.5 h-2.5" /> Verified
          </span>
        )}
      </div>

      <div className="px-5 py-3 flex-1 flex flex-col gap-3">
        {inst.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{inst.description}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {inst.type && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-semibold" style={{ borderRadius: "0.375rem" }}>{inst.type}</span>
          )}
          {inst.board && Array.isArray(inst.board) && inst.board.map((b: string) => (
            <span key={b} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-semibold" style={{ borderRadius: "0.375rem" }}>{b}</span>
          ))}
          {inst.established && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 font-medium" style={{ borderRadius: "0.375rem" }}>Est. {inst.established}</span>
          )}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between" style={{ borderRadius: "0 0 1.25rem 1.25rem" }}>
        <span className="text-xs font-bold text-[#00a264] flex items-center gap-1">
          <FaBriefcase className="w-3 h-3" />
          {openPositions} open {openPositions === 1 ? "vacancy" : "vacancies"}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#00a264] hover:bg-[#007a4d] transition-all px-3 py-1.5 group-hover:scale-[1.03]" style={{ borderRadius: "0.5rem" }}>
          View Details <FaChevronRight className="w-2.5 h-2.5" />
        </span>
      </div>
    </Link>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function InstitutionsPage() {
  const { openInstitutionRegistration, openSignIn, user, loading } = useAuth();
  const supabase = createClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedBoard, setSelectedBoard] = useState("All");

  // Real institutions from Supabase (created by management accounts)
  const [realInstitutions, setRealInstitutions] = useState<{ inst: any; openPositions: number }[]>([]);
  const [realLoading, setRealLoading] = useState(true);

  useEffect(() => {
    if (!user) { setRealLoading(false); return; }
    const fetchReal = async () => {
      setRealLoading(true);

      // Fetch all visible institutions — skip profile role filter since RLS blocks
      // cross-user profile lookups. The is_visible flag is the primary access control.
      const { data: instData } = await supabase
        .from("institutions")
        .select("id, name, location, type, board, established, verified, description, is_visible, created_by_profile_id, logo_url")
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!instData || instData.length === 0) { setRealLoading(false); return; }

      const allInstData = instData as any[];

      // Count published jobs per institution using BOTH institution_id and posted_by_profile_id
      const instIds = allInstData.map((i: any) => i.id);
      const profIds = allInstData.map((i: any) => i.created_by_profile_id).filter(Boolean);

      const [byInstId, byProfile] = await Promise.all([
        instIds.length > 0
          ? supabase.from("jobs").select("institution_id").in("institution_id", instIds).eq("status", "published")
          : Promise.resolve({ data: [] }),
        profIds.length > 0
          ? supabase.from("jobs").select("posted_by_profile_id").in("posted_by_profile_id", profIds).eq("status", "published").is("institution_id", null)
          : Promise.resolve({ data: [] }),
      ]);

      const countMap: Record<string, number> = {};
      ((byInstId.data || []) as any[]).forEach((j: any) => {
        if (j.institution_id) countMap[j.institution_id] = (countMap[j.institution_id] || 0) + 1;
      });
      const profileToInstId: Record<string, string> = {};
      allInstData.forEach((i: any) => {
        if (i.created_by_profile_id) profileToInstId[i.created_by_profile_id] = i.id;
      });
      ((byProfile.data || []) as any[]).forEach((j: any) => {
        const instId = profileToInstId[j.posted_by_profile_id];
        if (instId) countMap[instId] = (countMap[instId] || 0) + 1;
      });

      setRealInstitutions(allInstData.map((inst: any) => ({
        inst,
        openPositions: countMap[inst.id] || 0,
      })));
      setRealLoading(false);
    };
    fetchReal();
  }, [user]); // eslint-disable-line

  // Filter real institutions only
  const filteredReal = realInstitutions.filter(({ inst }) => {
    const matchSearch =
      (inst.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.type || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === "All" || (inst.type || "") === selectedType;
    const matchLoc = selectedLocation === "All" || (inst.location || "").includes(selectedLocation);
    const matchBoard = selectedBoard === "All" || (Array.isArray(inst.board) && inst.board.includes(selectedBoard));
    return matchSearch && matchType && matchLoc && matchBoard;
  });

  const totalCount = filteredReal.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9f8]">
      <Navbar />

      <main className="flex-1">

        {/* ─── Hero Banner ─────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #074526 0%, #00a264 60%, #00c278 100%)" }}
        >
          {/* Decorative shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5" style={{ borderRadius: "50%" }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10" style={{ borderRadius: "50%" }} />
            <div className="absolute top-12 left-1/2 w-48 h-48 bg-white/5" style={{ borderRadius: "50%" }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="max-w-3xl">
              <span
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 mb-4 px-3 py-1 bg-white/10"
                style={{ borderRadius: "999px" }}
              >
                <FaSchool className="w-3 h-3" /> Partner Institutions
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-5">
                Find qualified teachers<br />
                <span className="text-[#a3e6c3]">faster than ever before</span>
              </h1>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                Xyroots connects your institution with verified, experienced educators across India. Post a vacancy, browse profiles, and hire with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="border-t border-white/10 bg-black/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white/10" style={{ borderRadius: "0.5rem" }}>
                    <s.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white leading-none">{s.value}</p>
                    <p className="text-[11px] text-white/60 mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Institution Directory ────────────────────────────────── */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {!loading && !user ? (
              /* Auth Gate for non-logged-in users */
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-[#e6f7ed] flex items-center justify-center mx-auto mb-6">
                    <FaLock className="w-7 h-7 text-[#00a264]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign in to view institutions</h2>
                  <p className="text-gray-500 text-base mb-8 leading-relaxed">
                    Access our full directory of verified educational institutions hiring across India.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => openSignIn()} className="px-8 py-3 bg-[#00a264] text-white font-semibold rounded-xl hover:bg-[#007a4d] transition-colors text-base">
                      Sign In
                    </button>
                    <button onClick={() => openInstitutionRegistration()} className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors text-base">
                      Register Free
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#00a264] mb-2 inline-block">Directory</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Partner Education Centres</h2>
                <p className="text-sm text-gray-500 mt-1">Connect directly with verified institutions across India</p>
              </div>
              <p className="text-sm text-gray-500 shrink-0">
                <span className="font-bold text-gray-900">{totalCount}</span> institutions found
              </p>
            </div>

            {/* Search + Filters */}
            <div className="bg-white border border-gray-200 p-3 mb-8 flex flex-col sm:flex-row gap-2" style={{ borderRadius: "0.875rem" }}>
              <div className="flex-1 flex items-center px-3 py-2 border border-gray-200 gap-2" style={{ borderRadius: "0.625rem" }}>
                <FaMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name, city or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900"
                />
              </div>
              <div className="sm:w-40">
                <CustomSelect value={selectedType} onChange={setSelectedType} options={TYPE_OPTIONS} placeholder="Type" />
              </div>
              <div className="sm:w-44">
                <CustomSelect value={selectedLocation} onChange={setSelectedLocation} options={LOCATION_OPTIONS} placeholder="Location" searchable />
              </div>
              <div className="sm:w-36">
                <CustomSelect value={selectedBoard} onChange={setSelectedBoard} options={BOARD_OPTIONS} placeholder="Board" />
              </div>
            </div>

            {/* Cards grid */}
            {realLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="h-64 bg-white border border-gray-100 animate-pulse" style={{ borderRadius: "1.25rem" }} />
                ))}
              </div>
            ) : totalCount === 0 ? (
              <div className="bg-white border border-gray-100 p-12 text-center" style={{ borderRadius: "1rem" }}>
                <FaRegBuilding className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No institutions match your search.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {filteredReal.map(({ inst, openPositions }) => (
                  <RealInstitutionCard key={inst.id} inst={inst} openPositions={openPositions} />
                ))}
              </div>
            )}
            </>
            )}
          </div>
        </section>



      </main>

      <Footer />
    </div>
  );
}
