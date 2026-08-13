import re

file = 'src/app/dashboard/teacher/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

# Add states for profile visibility
if 'const [isProfileVisible, setIsProfileVisible]' not in text:
    text = text.replace('const [isLoadingData, setIsLoadingData] = useState(true);', 'const [isLoadingData, setIsLoadingData] = useState(true);\n  const [isProfileVisible, setIsProfileVisible] = useState(false);')

# Toggle UI
toggle_ui = """
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 mt-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Profile Visibility (For Institutions)</h3>
                    <p className="text-xs text-gray-500 mt-1">If active, institutions can discover your profile.</p>
                  </div>
                  <button 
                    onClick={() => setIsProfileVisible(!isProfileVisible)}
                    className={`w-12 h-6 rounded-full relative transition-colors shadow-inner ${isProfileVisible ? 'bg-[#00a264]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isProfileVisible ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
"""

text = re.sub(
    r'<div className="pt-4 border-t border-gray-100">',
    toggle_ui + '\n                <div className="pt-4 border-t border-gray-100">',
    text
)

# And update supabase fetch mock logic in teachers matching
with open(file, 'w', encoding='utf-8') as f:
    f.write(text)

file2 = 'src/app/teachers/page.tsx'
with open(file2, 'r', encoding='utf-8') as f:
    text2 = f.read()

text2 = text2.replace(
    'verified: t.profile_completion > 80, // mock rule',
    'verified: t.profile_completion > 80, // mock rule\n          is_visible: t.is_visible !== false,'
)

text2 = text2.replace(
    'return dbTeachers.filter(t => {',
    'return dbTeachers.filter(t => {\n      if (!t.is_visible) return false;'
)

with open(file2, 'w', encoding='utf-8') as f:
    f.write(text2)

print("Added Profile Visibility settings")
