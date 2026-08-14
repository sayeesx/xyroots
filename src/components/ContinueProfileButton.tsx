"use client";

import { useState, useEffect } from 'react';
import { FaCircleExclamation, FaArrowRight } from 'react-icons/fa6';
import { useAuth } from '@/lib/auth/AuthProvider';
import { calculateTeacherProfileCompletion } from '@/lib/utils/profile-completion';
import { getTeacherProfile } from '@/lib/actions/profile';
import OnboardingModal from '@/components/OnboardingModal';

export default function ContinueProfileButton() {
  const [showModal, setShowModal] = useState(false);
  const [completion, setCompletion] = useState<number | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    async function checkCompletion() {
      if (!profile || profile.role !== 'teacher') return;

      try {
        const result = await getTeacherProfile();
        if (result.success && result.data) {
          const completionResult = calculateTeacherProfileCompletion(
            result.data,
            result.data.teacher_profile
          );
          
          setCompletion(completionResult.percentage);
          setMissingFields(completionResult.missingFields);
        }
      } catch (error) {
        console.error('Error checking profile completion:', error);
      }
    }

    checkCompletion();
  }, [profile]);

  // Only show if profile is incomplete
  if (completion === null || completion === 100) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <FaCircleExclamation className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Complete Your Teacher Profile
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Your profile is {completion}% complete. Add more details to increase your chances of getting hired.
            </p>
            
            {missingFields.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Missing fields:</p>
                <div className="flex flex-wrap gap-2">
                  {missingFields.slice(0, 5).map((field) => (
                    <span
                      key={field}
                      className="text-xs px-2 py-1 bg-white border border-amber-200 rounded-md text-gray-700"
                    >
                      {field}
                    </span>
                  ))}
                  {missingFields.length > 5 && (
                    <span className="text-xs px-2 py-1 bg-white border border-amber-200 rounded-md text-gray-700">
                      +{missingFields.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2">
                <span>Profile Completion</span>
                <span>{completion}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
            >
              Continue Your Profile
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <OnboardingModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          role="teacher"
        />
      )}
    </>
  );
}
