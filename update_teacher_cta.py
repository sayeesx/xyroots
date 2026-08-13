import re

file = 'src/components/TeacherSection.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
if 'AuthGuardedLink' not in text:
    text = text.replace('import Link from "next/link";', 'import Link from "next/link";\nimport AuthGuardedLink from "@/components/AuthGuardedLink";')

# Replace button
text = re.sub(
    r'<button\s+className="flex-1 px-4 py-2\.5 text-sm font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-black transition-colors">\s*Message Kavya\s*<\/button>',
    '<AuthGuardedLink href="/teachers" type="institution" className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-[#074526] transition-colors flex items-center justify-center text-center">\n                    Find Top Profiles\n                  </AuthGuardedLink>',
    text,
    flags=re.MULTILINE
)

# Replace <button className="..."><i className="bi bi-bookmark"></i></button> to also use proper styles without dark green usage if any, but it's text-black now due to previous replace script
# Let's ensure the replace worked.
with open(file, 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated TeacherSection CTA.")
