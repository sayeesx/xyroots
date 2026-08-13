export interface Teacher {
  id: string;
  slug: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  rating: number;
  experience: number;
  verified: boolean;
  about: string;
  education: { degree: string; institution: string; year: number }[];
  professionalQualifications: string[];
  teachingExperience: {
    role: string;
    school: string;
    duration: string;
    current: boolean;
  }[];
  subjects: string[];
  boards: string[];
  languages: string[];
  skills: string[];
  availability: string;
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  preferredLocations: string[];
  workPreferences: string[];
  hasDemo: boolean;
  hasCV: boolean;
  matchPercentage: number;
  profileCompletion: number;
  profileViews: number;
}

export const teachers: Teacher[] = [
  {
    id: "1",
    slug: "ananya-sharma",
    name: "Ananya Sharma",
    title: "Senior Mathematics Teacher",
    location: "Kochi, Kerala",
    avatar: "AS",
    rating: 4.8,
    experience: 5,
    verified: true,
    about: "Passionate mathematics educator with 5 years of experience across CBSE and ICSE boards. I believe in making abstract concepts tangible through real-world applications and interactive problem-solving sessions. My students consistently achieve top marks in board examinations.",
    education: [
      { degree: "M.Sc Mathematics", institution: "University of Kerala", year: 2019 },
      { degree: "B.Sc Mathematics", institution: "St. Teresa's College, Kochi", year: 2017 },
    ],
    professionalQualifications: ["B.Ed (Mathematics)", "CTET Qualified", "Kerala SET"],
    teachingExperience: [
      { role: "Senior Mathematics Teacher", school: "Model Public School, Kochi", duration: "2022 - Present", current: true },
      { role: "Mathematics Teacher", school: "Holy Cross School, Kochi", duration: "2020 - 2022", current: false },
    ],
    subjects: ["Mathematics", "Statistics"],
    boards: ["CBSE", "ICSE", "State Board"],
    languages: ["English", "Malayalam", "Hindi"],
    skills: ["Algebra", "Calculus", "Geometry", "STEM Education", "Classroom Management", "Competitive Exam Preparation"],
    availability: "Immediate",
    expectedSalaryMin: 35000,
    expectedSalaryMax: 50000,
    preferredLocations: ["Kochi", "Thiruvananthapuram", "Bengaluru"],
    workPreferences: ["Full-time", "Regular Hours"],
    hasDemo: true,
    hasCV: true,
    matchPercentage: 94,
    profileCompletion: 92,
    profileViews: 47,
  },
  {
    id: "2",
    slug: "priya-menon",
    name: "Priya Menon",
    title: "Senior Mathematics Teacher",
    location: "Kochi, Kerala",
    avatar: "PM",
    rating: 4.9,
    experience: 6,
    verified: true,
    about: "Dedicated educator with a knack for simplifying complex mathematical concepts. Experienced in both national and international curricula. Actively involved in curriculum development and teacher training programs.",
    education: [
      { degree: "M.Sc Mathematics", institution: "Cochin University of Science and Technology", year: 2018 },
      { degree: "B.Sc Mathematics", institution: "Maharaja's College, Ernakulam", year: 2016 },
    ],
    professionalQualifications: ["B.Ed (Mathematics)", "NET Qualified"],
    teachingExperience: [
      { role: "Senior Mathematics Teacher", school: "Greenfield International School", duration: "2021 - Present", current: true },
      { role: "Mathematics Teacher", school: "Kendriya Vidyalaya, Kochi", duration: "2019 - 2021", current: false },
    ],
    subjects: ["Mathematics"],
    boards: ["CBSE", "ICSE"],
    languages: ["English", "Malayalam"],
    skills: ["Advanced Mathematics", "Data Analysis", "Educational Technology", "Student Mentoring"],
    availability: "1 Month Notice",
    expectedSalaryMin: 40000,
    expectedSalaryMax: 55000,
    preferredLocations: ["Kochi", "Kozhikode"],
    workPreferences: ["Full-time"],
    hasDemo: true,
    hasCV: true,
    matchPercentage: 98,
    profileCompletion: 96,
    profileViews: 63,
  },
  {
    id: "3",
    slug: "rahul-krishna",
    name: "Rahul Krishna",
    title: "Physics Teacher",
    location: "Kozhikode, Kerala",
    avatar: "RK",
    rating: 4.6,
    experience: 4,
    verified: true,
    about: "Physics teacher with a strong background in experimental physics and laboratory management. I focus on building conceptual understanding through demonstrations and hands-on experiments.",
    education: [
      { degree: "M.Sc Physics", institution: "University of Calicut", year: 2020 },
      { degree: "B.Sc Physics", institution: "Government College, Kozhikode", year: 2018 },
    ],
    professionalQualifications: ["B.Ed (Physical Science)"],
    teachingExperience: [
      { role: "Physics Teacher", school: "Northstar Academy, Kozhikode", duration: "2021 - Present", current: true },
      { role: "Junior Physics Teacher", school: "Malabar Christian College School", duration: "2020 - 2021", current: false },
    ],
    subjects: ["Physics"],
    boards: ["ICSE", "CBSE"],
    languages: ["English", "Malayalam", "Hindi"],
    skills: ["Experimental Physics", "Lab Management", "Science Exhibitions", "Competitive Exam Coaching"],
    availability: "2 Months Notice",
    expectedSalaryMin: 30000,
    expectedSalaryMax: 45000,
    preferredLocations: ["Kozhikode", "Kannur", "Kochi"],
    workPreferences: ["Full-time"],
    hasDemo: true,
    hasCV: true,
    matchPercentage: 87,
    profileCompletion: 88,
    profileViews: 34,
  },
  {
    id: "4",
    slug: "deepa-nambiar",
    name: "Deepa Nambiar",
    title: "English Language Teacher",
    location: "Thiruvananthapuram, Kerala",
    avatar: "DN",
    rating: 4.7,
    experience: 3,
    verified: false,
    about: "Creative English teacher passionate about literature and language arts. I use storytelling, drama and creative writing to make language learning an immersive experience for students.",
    education: [
      { degree: "M.A English Literature", institution: "University of Kerala", year: 2021 },
      { degree: "B.A English", institution: "All Saints' College, Trivandrum", year: 2019 },
    ],
    professionalQualifications: ["B.Ed (English)"],
    teachingExperience: [
      { role: "English Teacher", school: "BrightPath Education, Trivandrum", duration: "2022 - Present", current: true },
    ],
    subjects: ["English"],
    boards: ["State Board", "CBSE"],
    languages: ["English", "Malayalam"],
    skills: ["Creative Writing", "Literature", "Grammar", "Public Speaking", "Drama"],
    availability: "Immediate",
    expectedSalaryMin: 25000,
    expectedSalaryMax: 38000,
    preferredLocations: ["Thiruvananthapuram", "Kochi"],
    workPreferences: ["Full-time", "Part-time"],
    hasDemo: false,
    hasCV: true,
    matchPercentage: 78,
    profileCompletion: 75,
    profileViews: 22,
  },
  {
    id: "5",
    slug: "arjun-pillai",
    name: "Arjun Pillai",
    title: "Computer Science Teacher",
    location: "Bengaluru, Karnataka",
    avatar: "AP",
    rating: 4.9,
    experience: 7,
    verified: true,
    about: "Experienced Computer Science educator with industry background in software development. I bring practical coding experience into the classroom, preparing students for both board exams and real-world tech careers.",
    education: [
      { degree: "MCA", institution: "NIT Calicut", year: 2017 },
      { degree: "BCA", institution: "Christ University, Bengaluru", year: 2014 },
    ],
    professionalQualifications: ["B.Ed (Computer Science)", "Google Certified Educator"],
    teachingExperience: [
      { role: "Senior CS Teacher", school: "Oakwood Academy, Bengaluru", duration: "2020 - Present", current: true },
      { role: "CS Teacher", school: "National Public School, Bengaluru", duration: "2018 - 2020", current: false },
      { role: "Software Developer", school: "Infosys Ltd", duration: "2017 - 2018", current: false },
    ],
    subjects: ["Computer Science", "Information Technology"],
    boards: ["CBSE", "ICSE"],
    languages: ["English", "Malayalam", "Kannada", "Hindi"],
    skills: ["Python", "Java", "Web Development", "AI Basics", "Data Structures", "Project-Based Learning"],
    availability: "1 Month Notice",
    expectedSalaryMin: 45000,
    expectedSalaryMax: 65000,
    preferredLocations: ["Bengaluru", "Kochi", "Hyderabad"],
    workPreferences: ["Full-time"],
    hasDemo: true,
    hasCV: true,
    matchPercentage: 91,
    profileCompletion: 98,
    profileViews: 89,
  },
  {
    id: "6",
    slug: "meera-nair",
    name: "Meera Nair",
    title: "Chemistry Teacher",
    location: "Chennai, Tamil Nadu",
    avatar: "MN",
    rating: 4.5,
    experience: 4,
    verified: true,
    about: "Chemistry teacher with a focus on making organic and inorganic chemistry accessible to all students. Strong believer in laboratory-based learning and real-world chemical applications.",
    education: [
      { degree: "M.Sc Chemistry", institution: "IIT Madras", year: 2020 },
      { degree: "B.Sc Chemistry", institution: "Loyola College, Chennai", year: 2018 },
    ],
    professionalQualifications: ["B.Ed (Chemistry)", "CSIR NET"],
    teachingExperience: [
      { role: "Chemistry Teacher", school: "Horizon Public School, Chennai", duration: "2021 - Present", current: true },
      { role: "Lab Instructor", school: "IIT Madras (TA)", duration: "2019 - 2020", current: false },
    ],
    subjects: ["Chemistry"],
    boards: ["CBSE"],
    languages: ["English", "Tamil", "Malayalam"],
    skills: ["Organic Chemistry", "Lab Safety", "NEET Preparation", "Research Methodology"],
    availability: "Immediate",
    expectedSalaryMin: 35000,
    expectedSalaryMax: 52000,
    preferredLocations: ["Chennai", "Bengaluru", "Kochi"],
    workPreferences: ["Full-time"],
    hasDemo: true,
    hasCV: true,
    matchPercentage: 85,
    profileCompletion: 90,
    profileViews: 41,
  },
];
