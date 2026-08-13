import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing Supabase credentials in .env.local" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
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

  const results = [];

  for (const t of dummyTeachers) {
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: t.email,
      password: t.password,
      email_confirm: true,
      user_metadata: { role: 'teacher' }
    });

    if (authErr && !authErr.message.includes("already exists")) {
      results.push({ email: t.email, error: authErr.message });
      continue;
    }

    if (authData?.user) {
      const userId = authData.user.id;
      
      const { data: profile, error: profErr } = await supabase.from('profiles').insert({
        auth_user_id: userId,
        role: 'teacher',
        email: t.email,
        full_name: t.fullName,
        avatar_url: t.avatar_url,
        status: 'active'
      }).select().single();

      if (profErr) {
        results.push({ email: t.email, error: profErr.message });
        continue;
      }

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
        results.push({ email: t.email, error: tpErr.message });
      } else {
        results.push({ email: t.email, status: 'success' });
      }
    } else {
      results.push({ email: t.email, status: 'skipped (already exists)' });
    }
  }

  return NextResponse.json({ message: "Seeding complete", results });
}
