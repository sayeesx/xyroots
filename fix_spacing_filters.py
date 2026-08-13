import re

files = ['src/app/dashboard/employer/page.tsx', 'src/app/dashboard/agency/page.tsx']
for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fh:
            text = fh.read()
        text = text.replace(
            'className="flex-1 pt-24 lg:pt-32 pb-24"',
            'className="flex-1 pt-16 lg:pt-20 pb-20"'
        )
        text = text.replace(
            'className="min-h-screen flex flex-col bg-xyroots-cream/30"',
            'className="min-h-screen flex flex-col bg-[#f7f8fa]"'
        )
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(text)
        print(f"Updated {f}")
    except FileNotFoundError:
        print(f"Not found: {f}")

# Also fix jobs/page.tsx and teachers/page.tsx to clear filters on load
# Jobs page: reset selectedJobTypes instead of pre-populating
jobs_file = 'src/app/jobs/page.tsx'
with open(jobs_file, 'r', encoding='utf-8') as fh:
    text = fh.read()

# Reset pre-populated filters to empty arrays
text = text.replace(
    'const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(["Full-time", "Part-time", "Contract", "Internship"]);',
    'const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);'
)
with open(jobs_file, 'w', encoding='utf-8') as fh:
    fh.write(text)
print(f"Cleared job type pre-selections in jobs/page.tsx")

# Teachers page: reset
teachers_file = 'src/app/teachers/page.tsx'
with open(teachers_file, 'r', encoding='utf-8') as fh:
    text = fh.read()

text = text.replace(
    'const [selectedVerification, setSelectedVerification] = useState<string[]>(["Verified Only"]);',
    'const [selectedVerification, setSelectedVerification] = useState<string[]>([]);'
).replace(
    'const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Mathematics", "Physics"]);',
    'const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);'
).replace(
    'const [selectedExperiences, setSelectedExperiences] = useState<string[]>(["1-3 years"]);',
    'const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);'
)
with open(teachers_file, 'w', encoding='utf-8') as fh:
    fh.write(text)
print("Cleared teacher filter pre-selections")

# Also fix teachers page to have correct pt
with open(teachers_file, 'r', encoding='utf-8') as fh:
    text = fh.read()
text = text.replace(
    'className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"',
    'className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8"'
)
text = text.replace(
    'className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8"',
    'className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 flex gap-8"'
)
with open(teachers_file, 'w', encoding='utf-8') as fh:
    fh.write(text)

with open(jobs_file, 'r', encoding='utf-8') as fh:
    text = fh.read()
text = text.replace(
    'className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"',
    'className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8"'
)
text = text.replace(
    'className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8"',
    'className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 flex gap-8"'
)
with open(jobs_file, 'w', encoding='utf-8') as fh:
    fh.write(text)
print("Fixed spacing on jobs/teachers pages")
