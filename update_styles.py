import re

file = 'src/components/LatestVacancies.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

# Update JobCard styles for better contrast (Green)
text = re.sub(
    r'className="flex flex-col h-full border border-\[\#c8d8d0\] bg-white hover:border-\[\#00a264\] hover:bg-\[\#f9fcfb\] transition-colors group rounded-xl"',
    'className="flex flex-col h-full border-2 border-[#00a264]/20 bg-white hover:border-[#00a264] hover:bg-[#f9fcfb] transition-all hover:shadow-md group rounded-xl"',
    text
)

text = re.sub(
    r'className="bg-\[\#f0f7f4\] border-b border-\[\#c8d8d0\] px-4 py-3 rounded-t-xl"',
    'className="bg-[#f0f7f4] border-b-2 border-[#00a264]/20 px-4 py-3 rounded-t-xl"',
    text
)


# Update TeacherCard styles for better contrast (Blue)
text = re.sub(
    r'className="flex flex-col h-full border border-\[\#c0cfe0\] bg-white hover:border-\[\#1e63c3\] hover:bg-\[\#f6f9ff\] transition-colors group rounded-xl"',
    'className="flex flex-col h-full border-2 border-[#1e63c3]/20 bg-white hover:border-[#1e63c3] hover:bg-[#f6f9ff] transition-all hover:shadow-md group rounded-xl"',
    text
)

text = re.sub(
    r'className="bg-\[\#eef3fb\] border-b border-\[\#c0cfe0\] px-4 py-3 rounded-t-xl"',
    'className="bg-[#eef3fb] border-b-2 border-[#1e63c3]/20 px-4 py-3 rounded-t-xl"',
    text
)


with open(file, 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated card styling for better contrast.")
