export interface Job {
  id: string;
  slug: string;
  title: string;
  school: string;
  schoolVerified: boolean;
  location: string;
  district: string;
  state: string;
  salaryMin: number;
  salaryMax: number;
  experienceMin: number;
  experienceMax: number;
  qualification: string;
  professionalQualification: string;
  subject: string;
  board: string;
  employmentType: string;
  workTime: string;
  level: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  matchPercentage: number;
  postedDate: string;
  deadline: string;
  applicants: number;
  saved?: boolean;
  applied?: boolean;
}

export const jobs: Job[] = [
  {
    id: "1",
    slug: "senior-mathematics-teacher-greenfield",
    title: "Senior Mathematics Teacher",
    school: "Greenfield International School",
    schoolVerified: true,
    location: "Kochi, Kerala",
    district: "Ernakulam",
    state: "Kerala",
    salaryMin: 35000,
    salaryMax: 50000,
    experienceMin: 3,
    experienceMax: 6,
    qualification: "M.Sc Mathematics",
    professionalQualification: "B.Ed",
    subject: "Mathematics",
    board: "CBSE",
    employmentType: "Full-time",
    workTime: "Regular",
    level: "Senior Secondary",
    description: "Greenfield International School is seeking an experienced Senior Mathematics Teacher to join our vibrant academic team. The ideal candidate will have a strong command of mathematics concepts across senior secondary levels and the ability to inspire students through innovative teaching methodologies.",
    responsibilities: [
      "Teach Mathematics to classes 9-12 following CBSE curriculum",
      "Prepare lesson plans, assessments and examinations",
      "Mentor students preparing for competitive examinations",
      "Participate in curriculum development and academic reviews",
      "Conduct remedial classes for students needing additional support",
      "Organize mathematics clubs and inter-school competitions"
    ],
    requirements: [
      "M.Sc in Mathematics from a recognized university",
      "B.Ed qualification is mandatory",
      "Minimum 3 years of teaching experience at secondary/senior secondary level",
      "Proficiency in CBSE curriculum and examination patterns",
      "Strong classroom management skills",
      "Excellent communication skills in English"
    ],
    benefits: [
      "Competitive salary with annual increments",
      "Health insurance for employee and family",
      "Professional development opportunities",
      "Subsidized meals during school hours",
      "Transport facility available",
      "Provident fund and gratuity"
    ],
    matchPercentage: 94,
    postedDate: "2026-08-05",
    deadline: "2026-09-15",
    applicants: 23,
  },
  {
    id: "2",
    slug: "physics-teacher-northstar-academy",
    title: "Physics Teacher",
    school: "Northstar Academy",
    schoolVerified: true,
    location: "Kozhikode, Kerala",
    district: "Kozhikode",
    state: "Kerala",
    salaryMin: 30000,
    salaryMax: 45000,
    experienceMin: 2,
    experienceMax: 5,
    qualification: "M.Sc Physics",
    professionalQualification: "B.Ed",
    subject: "Physics",
    board: "ICSE",
    employmentType: "Full-time",
    workTime: "Regular",
    level: "Senior Secondary",
    description: "Northstar Academy invites applications for a Physics Teacher with a passion for experimental learning. We believe in building strong scientific foundations through hands-on lab experiences and real-world problem solving.",
    responsibilities: [
      "Teach Physics to classes 9-12 following ICSE curriculum",
      "Conduct laboratory sessions and practical examinations",
      "Guide students in science projects and fairs",
      "Develop engaging learning materials and presentations",
      "Assess student progress through regular evaluations",
      "Collaborate with the science department on interdisciplinary projects"
    ],
    requirements: [
      "M.Sc in Physics from a recognized university",
      "B.Ed qualification preferred",
      "Minimum 2 years of teaching experience",
      "Experience with ICSE curriculum",
      "Ability to conduct laboratory sessions",
      "Good interpersonal and communication skills"
    ],
    benefits: [
      "Competitive compensation package",
      "Medical insurance coverage",
      "Annual performance bonuses",
      "Library and research access",
      "Continuous professional development programs"
    ],
    matchPercentage: 87,
    postedDate: "2026-08-03",
    deadline: "2026-09-10",
    applicants: 18,
  },
  {
    id: "3",
    slug: "english-language-teacher-brightpath",
    title: "English Language Teacher",
    school: "BrightPath Education",
    schoolVerified: true,
    location: "Thiruvananthapuram, Kerala",
    district: "Thiruvananthapuram",
    state: "Kerala",
    salaryMin: 28000,
    salaryMax: 40000,
    experienceMin: 1,
    experienceMax: 4,
    qualification: "M.A English",
    professionalQualification: "B.Ed",
    subject: "English",
    board: "State Board",
    employmentType: "Full-time",
    workTime: "Regular",
    level: "Secondary",
    description: "BrightPath Education is looking for a creative and enthusiastic English Language Teacher who can make literature and language come alive in the classroom. The ideal candidate values student expression and critical thinking.",
    responsibilities: [
      "Teach English Language and Literature to classes 8-10",
      "Develop creative writing workshops and literary clubs",
      "Prepare students for board examinations",
      "Organize debates, elocutions and literary events",
      "Provide personalized feedback on student writing",
      "Maintain records of student academic progress"
    ],
    requirements: [
      "M.A in English from a recognized university",
      "B.Ed qualification",
      "Minimum 1 year of teaching experience",
      "Excellent written and spoken English",
      "Creative approach to language teaching",
      "Familiarity with State Board curriculum"
    ],
    benefits: [
      "Attractive salary package",
      "Leave encashment",
      "Festival bonuses",
      "Professional development grants",
      "Supportive work environment"
    ],
    matchPercentage: 78,
    postedDate: "2026-08-07",
    deadline: "2026-09-20",
    applicants: 31,
  },
  {
    id: "4",
    slug: "computer-science-teacher-oakwood",
    title: "Computer Science Teacher",
    school: "Oakwood Academy",
    schoolVerified: true,
    location: "Bengaluru, Karnataka",
    district: "Bengaluru Urban",
    state: "Karnataka",
    salaryMin: 40000,
    salaryMax: 60000,
    experienceMin: 3,
    experienceMax: 7,
    qualification: "M.Sc Computer Science / MCA",
    professionalQualification: "B.Ed",
    subject: "Computer Science",
    board: "CBSE",
    employmentType: "Full-time",
    workTime: "Regular",
    level: "Senior Secondary",
    description: "Oakwood Academy seeks a dynamic Computer Science Teacher who can guide students through programming, data structures and modern computing concepts. We emphasize project-based learning and real-world application development.",
    responsibilities: [
      "Teach Computer Science to classes 11-12 including Python and Data Structures",
      "Manage and maintain the computer laboratory",
      "Guide students in coding competitions and hackathons",
      "Teach web development and basic AI concepts as electives",
      "Prepare students for CBSE board practical examinations",
      "Stay updated with latest technology trends in education"
    ],
    requirements: [
      "M.Sc Computer Science or MCA from a recognized university",
      "B.Ed qualification is a strong advantage",
      "Minimum 3 years of teaching experience",
      "Proficiency in Python, Java and web technologies",
      "Experience with CBSE CS curriculum",
      "Strong problem-solving and mentoring abilities"
    ],
    benefits: [
      "Industry-competitive salary",
      "Health and dental insurance",
      "Annual technology allowance",
      "Conference and workshop sponsorship",
      "Relocation assistance if needed",
      "Provident fund contributions"
    ],
    matchPercentage: 91,
    postedDate: "2026-08-01",
    deadline: "2026-08-30",
    applicants: 42,
  },
  {
    id: "5",
    slug: "chemistry-teacher-horizon-public",
    title: "Chemistry Teacher",
    school: "Horizon Public School",
    schoolVerified: true,
    location: "Chennai, Tamil Nadu",
    district: "Chennai",
    state: "Tamil Nadu",
    salaryMin: 32000,
    salaryMax: 48000,
    experienceMin: 2,
    experienceMax: 5,
    qualification: "M.Sc Chemistry",
    professionalQualification: "B.Ed",
    subject: "Chemistry",
    board: "CBSE",
    employmentType: "Full-time",
    workTime: "Regular",
    level: "Senior Secondary",
    description: "Horizon Public School invites passionate Chemistry educators to join our science faculty. We are committed to fostering scientific curiosity through engaging lab work and conceptual clarity.",
    responsibilities: [
      "Teach Chemistry to classes 11-12 following CBSE syllabus",
      "Plan and conduct laboratory experiments safely",
      "Prepare students for board and competitive examinations",
      "Develop model question papers and study guides",
      "Participate in science exhibitions and events",
      "Mentor students interested in medical and engineering entrance preparation"
    ],
    requirements: [
      "M.Sc in Chemistry from a recognized university",
      "B.Ed qualification mandatory",
      "Minimum 2 years of experience teaching senior secondary Chemistry",
      "Thorough knowledge of CBSE Chemistry curriculum",
      "Laboratory safety certification preferred",
      "Strong communication and teaching skills"
    ],
    benefits: [
      "Competitive pay with annual reviews",
      "Medical insurance",
      "Subsidized housing for outstation candidates",
      "Children education discount",
      "Performance bonuses"
    ],
    matchPercentage: 85,
    postedDate: "2026-08-06",
    deadline: "2026-09-05",
    applicants: 27,
  },
  {
    id: "6",
    slug: "primary-teacher-sunflower-school",
    title: "Primary School Teacher",
    school: "Sunflower Kids Academy",
    schoolVerified: false,
    location: "Kannur, Kerala",
    district: "Kannur",
    state: "Kerala",
    salaryMin: 20000,
    salaryMax: 30000,
    experienceMin: 1,
    experienceMax: 3,
    qualification: "B.A / B.Sc (any discipline)",
    professionalQualification: "D.Ed / B.Ed",
    subject: "General",
    board: "State Board",
    employmentType: "Full-time",
    workTime: "Regular",
    level: "Primary",
    description: "Sunflower Kids Academy is looking for a warm and dedicated Primary School Teacher to nurture young learners. We value creativity, patience and a genuine love for working with children.",
    responsibilities: [
      "Teach all subjects to primary school students (Classes 1-5)",
      "Create engaging and age-appropriate learning activities",
      "Maintain a safe and supportive classroom environment",
      "Communicate regularly with parents about student progress",
      "Organize co-curricular activities and events",
      "Implement activity-based and experiential learning methods"
    ],
    requirements: [
      "Graduate in any discipline",
      "D.Ed or B.Ed qualification mandatory",
      "Minimum 1 year of primary school teaching experience",
      "Patient, creative and nurturing personality",
      "Good communication skills in English and Malayalam",
      "Basic computer literacy"
    ],
    benefits: [
      "Competitive salary",
      "Friendly and supportive work environment",
      "Festival holidays and leave benefits",
      "Professional training opportunities"
    ],
    matchPercentage: 72,
    postedDate: "2026-08-08",
    deadline: "2026-09-25",
    applicants: 15,
  },
  {
    id: "7",
    slug: "biology-teacher-cedar-international",
    title: "Biology Teacher",
    school: "Cedar International School",
    schoolVerified: true,
    location: "Hyderabad, Telangana",
    district: "Hyderabad",
    state: "Telangana",
    salaryMin: 38000,
    salaryMax: 55000,
    experienceMin: 4,
    experienceMax: 8,
    qualification: "M.Sc Biology / Zoology / Botany",
    professionalQualification: "B.Ed",
    subject: "Biology",
    board: "IB",
    employmentType: "Full-time",
    workTime: "Regular",
    level: "Senior Secondary",
    description: "Cedar International School is seeking a seasoned Biology Teacher for our IB Diploma Programme. Experience with international curricula and inquiry-based learning is essential.",
    responsibilities: [
      "Teach IB Biology at Standard and Higher Levels",
      "Develop Internal Assessment projects and lab activities",
      "Guide Extended Essay and Theory of Knowledge components",
      "Participate in IB professional development and workshops",
      "Maintain lab equipment and biological specimen collections",
      "Foster environmental awareness through field trips and projects"
    ],
    requirements: [
      "M.Sc in Biology, Zoology or Botany",
      "B.Ed qualification required",
      "Minimum 4 years of teaching experience, preferably in IB schools",
      "Understanding of IB assessment criteria and methodology",
      "Strong lab management skills",
      "Excellent English communication skills"
    ],
    benefits: [
      "Premium salary package",
      "International school benefits",
      "IB training sponsorship",
      "Health and life insurance",
      "Annual international conference attendance",
      "Gratuity and PF"
    ],
    matchPercentage: 82,
    postedDate: "2026-08-02",
    deadline: "2026-08-28",
    applicants: 19,
  },
  {
    id: "8",
    slug: "hindi-teacher-delhi-public",
    title: "Hindi Teacher",
    school: "Delhi Public Academy",
    schoolVerified: true,
    location: "Delhi, NCR",
    district: "South Delhi",
    state: "Delhi",
    salaryMin: 30000,
    salaryMax: 42000,
    experienceMin: 2,
    experienceMax: 5,
    qualification: "M.A Hindi",
    professionalQualification: "B.Ed",
    subject: "Hindi",
    board: "CBSE",
    employmentType: "Full-time",
    workTime: "Regular",
    level: "Secondary",
    description: "Delhi Public Academy requires a Hindi Teacher who can instill a deep appreciation for Hindi language and literature. The candidate should be passionate about creative expression and cultural heritage.",
    responsibilities: [
      "Teach Hindi to classes 6-10 following CBSE curriculum",
      "Organize Hindi literary events, debates and recitations",
      "Prepare students for board examinations in Hindi",
      "Develop supplementary reading materials",
      "Guide students in creative writing and poetry",
      "Participate in cultural programs and events"
    ],
    requirements: [
      "M.A in Hindi from a recognized university",
      "B.Ed qualification",
      "Minimum 2 years of teaching experience",
      "Deep knowledge of Hindi grammar and literature",
      "Ability to make language learning engaging",
      "Good organizational skills"
    ],
    benefits: [
      "Attractive salary with DA",
      "Government-recognized school benefits",
      "Medical facilities",
      "Leave travel allowance",
      "Children education allowance"
    ],
    matchPercentage: 76,
    postedDate: "2026-08-04",
    deadline: "2026-09-12",
    applicants: 35,
  },
];

export const subjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English",
  "Malayalam", "Hindi", "Social Science", "Computer Science", "Commerce",
  "Economics", "Accountancy", "Political Science", "History", "Geography",
  "Physical Education", "Art & Craft", "Music", "Sanskrit", "General"
];

export const boards = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "NIOS"];

export const locations = [
  "Kochi, Kerala", "Kozhikode, Kerala", "Kannur, Kerala",
  "Thiruvananthapuram, Kerala", "Thrissur, Kerala",
  "Bengaluru, Karnataka", "Chennai, Tamil Nadu",
  "Hyderabad, Telangana", "Mumbai, Maharashtra",
  "Delhi, NCR", "Pune, Maharashtra"
];

export const qualifications = [
  "B.A", "B.Sc", "B.Com", "M.A", "M.Sc", "M.Com", "MCA",
  "B.Ed", "D.Ed", "M.Ed", "Ph.D", "NET/SET Qualified"
];

export const employmentTypes = ["Full-time", "Part-time", "Contract", "Temporary"];

export const experienceRanges = [
  "Fresher", "1-2 years", "2-4 years", "4-6 years", "6-10 years", "10+ years"
];

export const schoolTypes = [
  "Private", "Government", "Government Aided", "International", "CBSE", "ICSE", "State Board"
];

export const designations = [
  "Teacher", "Senior Teacher", "Head of Department", "Vice Principal",
  "Principal", "Academic Coordinator", "Counselor", "Librarian",
  "Lab Assistant", "Sports Coach"
];
