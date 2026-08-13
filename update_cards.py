import re

file = 'src/components/LatestVacancies.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace JobCard links
text = re.sub(
    r'<Link\s+href=\{ctaLink\}\s+className="block text-black font-semibold text-sm leading-snug hover:text-\[\#00a264\] transition-colors line-clamp-2"\s*>',
    '<AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="block text-black font-semibold text-sm leading-snug hover:text-[#00a264] transition-colors line-clamp-2 text-left">',
    text
)
text = re.sub(
    r'</Link>\s*<\/div>\s*\{\/\* Rating',
    '</AuthGuardedLink>\n            </div>\n            {/* Rating',
    text
)

text = re.sub(
    r'<Link href=\{ctaLink\} className="flex-1 text-center text-xs font-medium py-1\.5 border border-\[\#c8d8d0\] text-gray-600 hover:border-\[\#00a264\] hover:text-\[\#00a264\] flex items-center justify-center gap-1 transition-colors rounded-lg">\s*<FaBookmark className="inline w-2\.5 h-2\.5" \/> Save\s*<\/Link>',
    '<AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="flex-1 text-center text-xs font-medium py-1.5 border border-[#c8d8d0] text-gray-600 hover:border-[#00a264] hover:text-[#00a264] flex items-center justify-center gap-1 transition-colors rounded-lg"><FaBookmark className="inline w-2.5 h-2.5" /> Save</AuthGuardedLink>',
    text
)

text = re.sub(
    r'<Link\s+href=\{ctaLink\}\s+className="flex-1 text-center text-xs font-semibold py-1\.5 bg-\[\#00a264\] text-white hover:opacity-90 flex items-center justify-center gap-1 transition-opacity rounded-lg"\s*>\s*Apply Now <FaArrowRight className="inline w-2\.5 h-2\.5" \/>\s*<\/Link>',
    '<AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="flex-1 text-center text-xs font-semibold py-1.5 bg-[#00a264] text-white hover:opacity-90 flex items-center justify-center gap-1 transition-opacity rounded-lg">Apply Now <FaArrowRight className="inline w-2.5 h-2.5" /></AuthGuardedLink>',
    text
)

text = re.sub(
    r'<Link href=\{ctaLink\} className="flex-1 text-center text-xs font-medium py-1\.5 border border-\[\#c8d8d0\] text-gray-600 hover:border-\[\#00a264\] hover:text-\[\#00a264\] transition-colors rounded-lg flex items-center justify-center">\s*Quick Apply\s*<\/Link>',
    '<AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="flex-1 text-center text-xs font-medium py-1.5 border border-[#c8d8d0] text-gray-600 hover:border-[#00a264] hover:text-[#00a264] transition-colors rounded-lg flex items-center justify-center">Quick Apply</AuthGuardedLink>',
    text
)


# Replace TeacherCard links
text = re.sub(
    r'<Link\s+href=\{ctaLink\}\s+className="block text-black font-semibold text-sm leading-snug hover:text-\[\#1e63c3\] transition-colors"\s*>',
    '<AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="block text-black font-semibold text-sm leading-snug hover:text-[#1e63c3] transition-colors text-left">',
    text
)

text = re.sub(
    r'</Link>\s*<p className="text-xs text-gray-500 mt-0\.5 flex items-center gap-1">',
    '</AuthGuardedLink>\n            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">',
    text
)

text = re.sub(
    r'<Link\s+href=\{ctaLink\}\s+className="flex-1 text-center text-xs font-semibold py-1\.5 bg-\[\#1e63c3\] text-white hover:opacity-90 flex items-center justify-center gap-1 transition-opacity rounded-lg"\s*>\s*<FaUser className="inline w-2\.5 h-2\.5" \/> View Profile\s*<\/Link>',
    '<AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="flex-1 text-center text-xs font-semibold py-1.5 bg-[#1e63c3] text-white hover:opacity-90 flex items-center justify-center gap-1 transition-opacity rounded-lg"><FaUser className="inline w-2.5 h-2.5" /> View Profile</AuthGuardedLink>',
    text
)

text = re.sub(
    r'<Link href=\{ctaLink\} className="flex-1 text-center text-xs font-medium py-1\.5 border border-\[\#c0cfe0\] text-gray-600 hover:border-\[\#1e63c3\] hover:text-\[\#1e63c3\] flex items-center justify-center gap-1 transition-colors rounded-lg">\s*<FaEnvelope className="inline w-2\.5 h-2\.5" \/> Contact\s*<\/Link>',
    '<AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="flex-1 text-center text-xs font-medium py-1.5 border border-[#c0cfe0] text-gray-600 hover:border-[#1e63c3] hover:text-[#1e63c3] flex items-center justify-center gap-1 transition-colors rounded-lg"><FaEnvelope className="inline w-2.5 h-2.5" /> Contact</AuthGuardedLink>',
    text
)

text = re.sub(
    r'<Link href=\{ctaLink\} className="flex-1 text-center text-xs font-medium py-1\.5 border border-\[\#c0cfe0\] text-gray-600 hover:border-\[\#1e63c3\] hover:text-\[\#1e63c3\] flex items-center justify-center gap-1 transition-colors rounded-lg">\s*<FaBookmark className="inline w-2\.5 h-2\.5" \/> Shortlist\s*<\/Link>',
    '<AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="flex-1 text-center text-xs font-medium py-1.5 border border-[#c0cfe0] text-gray-600 hover:border-[#1e63c3] hover:text-[#1e63c3] flex items-center justify-center gap-1 transition-colors rounded-lg"><FaBookmark className="inline w-2.5 h-2.5" /> Shortlist</AuthGuardedLink>',
    text
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated LatestVacancies links.")
