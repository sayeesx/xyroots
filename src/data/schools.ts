export interface School {
  id: string;
  slug: string;
  name: string;
  type: string;
  location: string;
  established: number;
  board: string[];
  students: number;
  teachers: number;
  verified: boolean;
  description: string;
  openPositions: number;
  logo: string;
}

export const schools: School[] = [
  {
    id: "1",
    slug: "greenfield-international-school",
    name: "Greenfield International School",
    type: "International",
    location: "Kochi, Kerala",
    established: 2005,
    board: ["CBSE", "IGCSE"],
    students: 2400,
    teachers: 180,
    verified: true,
    description: "A premier international school offering world-class education with a blend of Indian and global curricula.",
    openPositions: 5,
    logo: "GIS",
  },
  {
    id: "2",
    slug: "northstar-academy",
    name: "Northstar Academy",
    type: "Private",
    location: "Kozhikode, Kerala",
    established: 1998,
    board: ["ICSE"],
    students: 1800,
    teachers: 140,
    verified: true,
    description: "An ICSE school committed to academic excellence and holistic student development.",
    openPositions: 3,
    logo: "NA",
  },
  {
    id: "3",
    slug: "brightpath-education",
    name: "BrightPath Education",
    type: "Private",
    location: "Thiruvananthapuram, Kerala",
    established: 2010,
    board: ["State Board", "CBSE"],
    students: 1200,
    teachers: 95,
    verified: true,
    description: "Progressive school focused on holistic education, creative learning and student well-being.",
    openPositions: 4,
    logo: "BE",
  },
  {
    id: "4",
    slug: "oakwood-academy",
    name: "Oakwood Academy",
    type: "International",
    location: "Bengaluru, Karnataka",
    established: 2002,
    board: ["CBSE", "IB"],
    students: 3200,
    teachers: 240,
    verified: true,
    description: "One of Bengaluru's top schools offering CBSE and IB curricula with state-of-the-art facilities.",
    openPositions: 7,
    logo: "OA",
  },
  {
    id: "5",
    slug: "horizon-public-school",
    name: "Horizon Public School",
    type: "Private",
    location: "Chennai, Tamil Nadu",
    established: 1995,
    board: ["CBSE"],
    students: 2800,
    teachers: 200,
    verified: true,
    description: "A CBSE school with three decades of excellence in academics, sports and cultural education.",
    openPositions: 6,
    logo: "HPS",
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization?: string;
  content: string;
  type: "teacher" | "school";
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Meera Nair",
    role: "Mathematics Teacher",
    content: "Xyroots helped me discover schools I would never have found on traditional job boards. My profile actually showed what I could do in the classroom.",
    type: "teacher",
    avatar: "MN",
  },
  {
    id: "2",
    name: "Rahul Menon",
    role: "Academic Director",
    organization: "Greenfield International School",
    content: "We reduced the time spent screening candidates dramatically. The profiles and matching system made it much easier to find teachers who actually fit our requirements.",
    type: "school",
    avatar: "RM",
  },
  {
    id: "3",
    name: "Sujata Krishnan",
    role: "English Teacher",
    content: "The application tracking and interview scheduling features saved me hours of back-and-forth. I found my current position within three weeks of creating my profile.",
    type: "teacher",
    avatar: "SK",
  },
  {
    id: "4",
    name: "Dr. Anil Kumar",
    role: "Principal",
    organization: "Northstar Academy",
    content: "Finding qualified teachers for niche subjects used to be our biggest challenge. Xyroots gives us access to a verified pool of educators we can trust.",
    type: "school",
    avatar: "AK",
  },
];

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "₹0",
    period: "",
    description: "For occasional hiring.",
    features: [
      "Post up to 2 jobs per month",
      "Basic candidate search",
      "Application management",
      "Basic filters",
      "Email notifications",
    ],
    highlighted: false,
    cta: "Get Started Free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹2,999",
    period: "/month",
    description: "For growing schools.",
    features: [
      "Unlimited job postings",
      "Advanced candidate search",
      "AI-powered candidate matching",
      "Candidate shortlisting tools",
      "Interview scheduling",
      "Hiring analytics dashboard",
      "Priority candidate access",
      "Dedicated support",
    ],
    highlighted: true,
    cta: "Start 14-Day Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    description: "For education groups.",
    features: [
      "Multi-school management",
      "Advanced recruitment workflows",
      "Custom integrations & API access",
      "Dedicated account manager",
      "Hiring analytics & reporting",
      "Bulk job posting",
      "SLA guarantee",
      "On-premise deployment option",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];
