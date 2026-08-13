import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env.local file
config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const dummyTeachers = [
  {
    email: "kavya.test@xyroots.com",
    fullName: "Kavya T",
    password: "Password#123",
    subject: "Mathematics",
    title: "Senior Mathematics Teacher",
    qualification: "M.Sc Mathematics, B.Ed",
    location: "Kochi, Kerala",
    experience_years: 5,
    bio: "Passionate mathematics teacher with 5 years of experience in CBSE schools.",
    avatar_url: "/lady-teacher.webp"
  },
  {
    email: "raj.test@xyroots.com",
    fullName: "Rajesh Kumar",
    password: "Password#123",
    subject: "Physics",
    title: "Physics Dept Head",
    qualification: "M.Sc Physics",
    location: "Bangalore, Karnataka",
    experience_years: 12,
    bio: "Experienced physics educator.",
    avatar_url: "https://i.pravatar.cc/150?img=11"
  },
  {
    email: "anjali.test@xyroots.com",
    fullName: "Anjali Menon",
    password: "Password#123",
    subject: "English",
    title: "English Literature Teacher",
    qualification: "MA English",
    location: "Chennai, Tamil Nadu",
    experience_years: 7,
    bio: "Focuses on creative writing and literature appreciation.",
    avatar_url: "https://i.pravatar.cc/150?img=9"
  }
];

async function seed() {
  console.log("Seeding Database...");
  
  for (const t of dummyTeachers) {
    console.log(`Processing ${t.email}...`);
    
    // 1. Create User via Admin API
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: t.email,
      password: t.password,
      email_confirm: true,
      user_metadata: { role: 'teacher' }
    });

    if (authErr) {
      if (authErr.message.includes("already exists")) {
        console.log(`User ${t.email} already exists. Skipping.`);
        continue;
      } else {
        console.error("Error creating auth user:", authErr);
        continue;
      }
    }

    const userId = authData.user.id;

    // 2. Add Profile
    const { data: profile, error: profErr } = await supabase.from('profiles').insert({
      auth_user_id: userId,
      role: 'teacher',
      email: t.email,
      full_name: t.fullName,
      avatar_url: t.avatar_url,
      status: 'active'
    }).select().single();

    if (profErr) {
      console.error("Error creating profile:", profErr);
      continue;
    }

    // 3. Add Teacher Profile
    const { error: tpErr } = await supabase.from('teacher_profiles').insert({
      profile_id: profile.id,
      subject: t.subject,
      title: t.title,
      bio: t.bio,
      qualification: t.qualification,
      location: t.location,
      experience_years: t.experience_years,
      profile_completion: 100
    });

    if (tpErr) {
      console.error("Error creating teacher profile:", tpErr);
    } else {
      console.log(`Successfully created ${t.fullName}!`);
    }
  }

  console.log("Seeding complete.");
}

seed();
