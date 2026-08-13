import re

file = 'src/components/Footer.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
if 'AuthGuardedLink' not in text:
    text = text.replace('import Link from "next/link";', 'import Link from "next/link";\nimport AuthGuardedLink from "@/components/AuthGuardedLink";')

# Replace the specific links with AuthGuardedLink directly
text = re.sub(
    r'<FooterLink href="/register/teacher">Create Profile</FooterLink>',
    '<li><AuthGuardedLink href="/dashboard/teacher" type="teacher" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Create Profile</AuthGuardedLink></li>',
    text
)
text = re.sub(
    r'<FooterLink href="/dashboard/teacher">Saved Jobs</FooterLink>',
    '<li><AuthGuardedLink href="/dashboard/teacher" type="teacher" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Saved Jobs</AuthGuardedLink></li>',
    text
)
text = re.sub(
    r'<FooterLink href="/dashboard/teacher">Applications</FooterLink>',
    '<li><AuthGuardedLink href="/dashboard/teacher" type="teacher" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Applications</AuthGuardedLink></li>',
    text
)
text = re.sub(
    r'<FooterLink href="/dashboard/teacher">Interview Schedule</FooterLink>',
    '<li><AuthGuardedLink href="/dashboard/teacher" type="teacher" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Interview Schedule</AuthGuardedLink></li>',
    text
)
text = re.sub(
    r'<FooterLink href="/register/employer">Post a Job</FooterLink>',
    '<li><AuthGuardedLink href="/dashboard/employer" type="institution" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Post a Job</AuthGuardedLink></li>',
    text
)
text = re.sub(
    r'<FooterLink href="/dashboard/employer">Find Teachers</FooterLink>',
    '<li><AuthGuardedLink href="/dashboard/employer" type="institution" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Find Teachers</AuthGuardedLink></li>',
    text
)
text = re.sub(
    r'<FooterLink href="/dashboard/employer">Candidate Search</FooterLink>',
    '<li><AuthGuardedLink href="/dashboard/employer" type="institution" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Candidate Search</AuthGuardedLink></li>',
    text
)
text = re.sub(
    r'<FooterLink href="/dashboard/employer">Hiring Dashboard</FooterLink>',
    '<li><AuthGuardedLink href="/dashboard/employer" type="institution" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">Hiring Dashboard</AuthGuardedLink></li>',
    text
)

# Fix dashboard redirects on failure
for dashboard_file in ['src/app/dashboard/employer/page.tsx', 'src/app/dashboard/teacher/page.tsx', 'src/app/dashboard/agency/page.tsx']:
    try:
        with open(dashboard_file, 'r', encoding='utf-8') as f:
            d_text = f.read()
        d_text = re.sub(r'router\.push\(\'/login\?redirect=.*\'\);', 'router.push(\'/\');', d_text)
        with open(dashboard_file, 'w', encoding='utf-8') as f:
            f.write(d_text)
    except FileNotFoundError:
        pass

with open(file, 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated Footer links and dashboard redirects")
