import re

file = 'src/app/dashboard/teacher/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

if 'import Loader' not in text:
    text = text.replace('import Navbar from "@/components/Navbar";', 'import Navbar from "@/components/Navbar";\nimport Loader from "@/components/Loader";')

# Update loader state UI
text = re.sub(
    r'<div className="flex h-40 items-center justify-center">\s*<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"><\/div>\s*<\/div>',
    '<div className="flex h-64 items-center justify-center">\n            <Loader />\n          </div>',
    text
)

# Update Banner styles
text = re.sub(
    r'className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden"',
    'className="bg-gradient-to-br from-[#0a1e3f] to-[#040e1c] text-white rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_40px_rgb(0,0,0,0.12)] mb-8 relative overflow-hidden border border-white/10"',
    text
)

text = re.sub(
    r'className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"',
    'className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] pointer-events-none"\n              /><div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"',
    text
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated Teacher Dashboard")
