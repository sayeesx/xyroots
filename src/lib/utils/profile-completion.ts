/**
 * Profile completion utility
 * Calculates profile completion percentage and identifies missing fields
 */

export interface ProfileCompletionResult {
  percentage: number;
  isComplete: boolean;
  missingFields: string[];
  completedFields: string[];
}

export function calculateTeacherProfileCompletion(
  profile: any,
  teacherProfile: any
): ProfileCompletionResult {
  const requiredFields = {
    // Basic Profile (from profiles table)
    'Full Name': profile?.full_name,
    'Email': profile?.email,
    'Phone': profile?.phone,
    
    // Teacher Profile (from teacher_profiles table)
    'Professional Title': teacherProfile?.title,
    'Subject': teacherProfile?.subject,
    'Location': teacherProfile?.location,
    'Qualification': teacherProfile?.qualification,
    'Professional Qualification': teacherProfile?.professional_qualification,
    'Experience Years': teacherProfile?.experience_years !== null && teacherProfile?.experience_years !== undefined,
  };

  const optionalButImportantFields = {
    'Bio': teacherProfile?.bio,
    'Skills': teacherProfile?.skills && teacherProfile?.skills.length > 0,
    'Experience Details': teacherProfile?.experience_details && teacherProfile?.experience_details.length > 0,
    'Education': teacherProfile?.education && teacherProfile?.education.length > 0,
  };

  const allFields = { ...requiredFields, ...optionalButImportantFields };
  
  const completedFields: string[] = [];
  const missingFields: string[] = [];

  Object.entries(allFields).forEach(([fieldName, value]) => {
    if (value) {
      completedFields.push(fieldName);
    } else {
      missingFields.push(fieldName);
    }
  });

  const percentage = Math.round((completedFields.length / Object.keys(allFields).length) * 100);
  const isComplete = missingFields.length === 0;

  return {
    percentage,
    isComplete,
    missingFields,
    completedFields,
  };
}

export function isProfileIncomplete(profile: any, teacherProfile: any): boolean {
  const result = calculateTeacherProfileCompletion(profile, teacherProfile);
  return result.percentage < 100;
}
