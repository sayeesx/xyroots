/**
 * Centralized dropdown option lists used across the entire app.
 * Import from here — never define inline.
 */

// ─── Subjects ───────────────────────────────────────────────────────────────────
export const SUBJECT_OPTIONS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
  "Social Science", "Computer Science", "Commerce", "Economics", "History",
  "Geography", "Sanskrit", "Physical Education", "Art & Craft", "Music",
  "EVS", "General Science", "Accountancy", "Business Studies",
  "Political Science", "Psychology", "Sociology", "Environmental Science",
  "Home Science", "Other",
] as const;

// ─── Qualifications ─────────────────────────────────────────────────────────────
export const QUALIFICATION_OPTIONS = [
  "B.A. (Bachelor of Arts)",
  "B.Sc. (Bachelor of Science)",
  "B.Com. (Bachelor of Commerce)",
  "B.Tech / B.E. (Engineering)",
  "BCA (Computer Applications)",
  "M.A. (Master of Arts)",
  "M.Sc. (Master of Science)",
  "M.Com. (Master of Commerce)",
  "M.Tech / M.E.",
  "MBA",
  "Ph.D.",
  "Other",
] as const;

// ─── Professional / Teaching Qualifications ─────────────────────────────────────
export const PROFESSIONAL_QUALIFICATION_OPTIONS = [
  "B.Ed. (Bachelor of Education)",
  "M.Ed. (Master of Education)",
  "D.El.Ed. (Diploma in Elementary Education)",
  "NTT (Nursery Teacher Training)",
  "TET Qualified (Teacher Eligibility Test)",
  "CTET Qualified",
  "STET Qualified",
  "ECCE (Early Childhood Care & Education)",
  "PGDEMA",
  "Other",
] as const;

// ─── Experience ─────────────────────────────────────────────────────────────────
export const EXPERIENCE_OPTIONS = [
  { value: "0", label: "Fresher (0 years)" },
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3 years" },
  { value: "4", label: "4 years" },
  { value: "5", label: "5 years" },
  { value: "6", label: "6 years" },
  { value: "7", label: "7 years" },
  { value: "8", label: "8 years" },
  { value: "9", label: "9 years" },
  { value: "10", label: "10 years" },
  { value: "11", label: "11 years" },
  { value: "12", label: "12 years" },
  { value: "13", label: "13 years" },
  { value: "14", label: "14 years" },
  { value: "15", label: "15 years" },
  { value: "20", label: "20+ years" },
  { value: "25", label: "25+ years" },
  { value: "30", label: "30+ years" },
] as const;

// ─── Boards ─────────────────────────────────────────────────────────────────────
export const BOARD_OPTIONS = [
  "CBSE", "ICSE / ISC", "State Board", "IB (International Baccalaureate)",
  "IGCSE (Cambridge)", "NIOS", "Matriculation", "Anglo-Indian Board", "Other",
] as const;

// ─── Teaching Levels ────────────────────────────────────────────────────────────
export const LEVEL_OPTIONS = [
  "Nursery / KG (Pre-Primary)",
  "Primary (Class 1–5)",
  "Middle School (Class 6–8)",
  "Secondary (Class 9–10)",
  "Senior Secondary (Class 11–12)",
  "All Levels",
] as const;

// ─── Employment Types ────────────────────────────────────────────────────────────
export const EMPLOYMENT_TYPE_OPTIONS = [
  "Full-time", "Part-time", "Contract", "Temporary", "Substitute",
] as const;

// ─── Locations (India) ──────────────────────────────────────────────────────────
export const LOCATION_OPTIONS = [
  // Metro cities
  "Mumbai, Maharashtra",
  "Delhi / NCR",
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  // Tier-2 cities
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Kochi, Kerala",
  "Chandigarh",
  "Nagpur, Maharashtra",
  "Indore, Madhya Pradesh",
  "Coimbatore, Tamil Nadu",
  "Bhopal, Madhya Pradesh",
  "Patna, Bihar",
  "Thiruvananthapuram, Kerala",
  "Surat, Gujarat",
  "Visakhapatnam, Andhra Pradesh",
  "Vadodara, Gujarat",
  "Agra, Uttar Pradesh",
  "Nashik, Maharashtra",
  "Meerut, Uttar Pradesh",
  "Faridabad, Haryana",
  "Rajkot, Gujarat",
  "Varanasi, Uttar Pradesh",
  "Aurangabad, Maharashtra",
  "Amritsar, Punjab",
  "Ranchi, Jharkhand",
  "Guwahati, Assam",
  "Jodhpur, Rajasthan",
  "Raipur, Chhattisgarh",
  "Kota, Rajasthan",
  "Dehradun, Uttarakhand",
  "Mysuru, Karnataka",
  "Mangaluru, Karnataka",
  "Hubli, Karnataka",
  "Tiruchirappalli, Tamil Nadu",
  "Noida, Uttar Pradesh",
  "Gurgaon / Gurugram, Haryana",
  "Ghaziabad, Uttar Pradesh",
  "Remote / Online",
  "Other",
] as const;

// ─── Institution Types ──────────────────────────────────────────────────────────
export const INSTITUTION_TYPE_OPTIONS = [
  "School", "International School", "College", "University",
  "Coaching Centre", "Preschool / Nursery", "Special Needs School",
  "Vocational Institute", "Other",
] as const;

// ─── Availability ───────────────────────────────────────────────────────────────
export const AVAILABILITY_OPTIONS = [
  { value: "immediate", label: "Immediately Available" },
  { value: "2weeks", label: "Within 2 weeks" },
  { value: "1month", label: "Within 1 month" },
  { value: "2months", label: "Within 2 months" },
  { value: "3months", label: "Within 3 months" },
  { value: "not_looking", label: "Not Currently Looking" },
] as const;

// ─── Helper: convert string[] to {value, label}[] ───────────────────────────────
export function toSelectOptions(arr: readonly string[], withEmpty?: string) {
  const opts = arr.map(s => ({ value: s, label: s }));
  if (withEmpty) return [{ value: "", label: withEmpty }, ...opts];
  return opts;
}
