"use client";

import { useRouter } from "next/navigation";
import { FaXmark, FaShieldHalved, FaCircleCheck, FaArrowRight, FaMagnifyingGlass, FaBriefcase, FaStar, FaBolt } from "react-icons/fa6";

interface GetVerifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const benefits = [
  { icon: FaShieldHalved, title: "Verified Badge", desc: "A blue shield on your profile signals to schools that you're a trusted, vetted educator." },
  { icon: FaMagnifyingGlass, title: "Priority in Search", desc: "Verified profiles appear at the top of search results — more visibility, more opportunities." },
  { icon: FaBriefcase, title: "Direct Invitations", desc: "Schools and agencies can send you direct interview invitations without you applying." },
  { icon: FaStar, title: "Premium Profile", desc: "Unlock an enhanced profile layout with highlighted qualifications and demo video support." },
];

export default function GetVerifiedModal({ isOpen, onClose }: GetVerifiedModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
      <div
        className="bg-white w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        style={{ borderRadius: "1.5rem" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-5 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-xyroots-mint flex items-center justify-center" style={{ borderRadius: "0.875rem" }}>
              <FaShieldHalved className="w-5 h-5 text-xyroots-teal" />
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors" style={{ borderRadius: "50%" }}>
              <FaXmark className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Get Verified on Xyroots</h2>
          <p className="text-sm text-gray-500">Stand out to schools with a verified educator badge.</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 modal-scrollbar">
          <div className="space-y-3 mb-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 border border-gray-100" style={{ borderRadius: "0.875rem" }}>
                <div className="w-9 h-9 bg-white border border-gray-200 flex items-center justify-center shrink-0" style={{ borderRadius: "0.625rem" }}>
                  <b.icon className="w-4 h-4 text-xyroots-teal" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{b.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison */}
          <div className="border border-gray-100 overflow-hidden mb-6" style={{ borderRadius: "0.875rem" }}>
            <div className="grid grid-cols-2 text-center text-xs font-bold uppercase tracking-wide bg-gray-50 border-b border-gray-100">
              <div className="py-2.5 text-gray-500">Free</div>
              <div className="py-2.5 text-xyroots-teal">Verified</div>
            </div>
            {[
              ["Basic Profile", "Enhanced Profile"],
              ["Standard listing", "Priority Search Ranking"],
              ["Apply only", "Receive Direct Invites"],
              ["—", "Verified Badge"],
              ["—", "Priority Support"],
            ].map(([free, verified], i) => (
              <div key={i} className="grid grid-cols-2 text-center text-xs border-b last:border-0 border-gray-100">
                <div className="py-2.5 px-3 text-gray-500 border-r border-gray-100">{free}</div>
                <div className="py-2.5 px-3 text-gray-700 font-medium flex items-center justify-center gap-1">
                  {verified !== "—" && <FaCircleCheck className="w-3 h-3 text-xyroots-teal shrink-0" />}
                  {verified}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-xyroots-mint/40 border border-xyroots-teal/20 flex items-start gap-3 mb-6" style={{ borderRadius: "0.875rem" }}>
            <FaBolt className="w-4 h-4 text-xyroots-teal shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700">
              <span className="font-bold">Verified profiles get 3× more interview calls</span> than unverified profiles on average.
            </p>
          </div>

          <button
            onClick={() => { onClose(); router.push("/pricing"); }}
            className="w-full py-3 bg-xyroots-teal text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-xyroots-dark transition-colors"
            style={{ borderRadius: "0.875rem" }}
          >
            View Pricing & Get Verified <FaArrowRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={onClose} className="w-full mt-2 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
