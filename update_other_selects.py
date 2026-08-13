import re

def update_file(file_path, select_patterns, add_imports_and_options=None):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'CustomSelect' not in content:
        content = content.replace('import Link', 'import Link from "next/link";\nimport CustomSelect from "@/components/ui/CustomSelect";\n// @ts-ignore - remove duplicate import Link if exists')
        content = content.replace('// @ts-ignore - remove duplicate import Link if exists from "next/link";', '')
        
    if add_imports_and_options and 'Options =' not in content:
        content = content.replace('export default function', add_imports_and_options + '\nexport default function')
        
    for p, repl in select_patterns:
        content = re.sub(p, repl, content, flags=re.DOTALL)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Update Teacher Registration Page
teacher_opts = """
const subjectOptions = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "English", label: "English" },
];

const boardOptions = [
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "State Board", label: "State Board" },
  { value: "IB / IGCSE", label: "IB / IGCSE" },
];
"""

teacher_selects = [
    (r'<select\s+value=\{formData\.subject\}\s+onChange=\{\(e\) => setFormData\(\{ \.\.\.formData, subject: e\.target\.value \}\)\}\s+className="w-full.*?bg-xyroots-cream/60.*?">.*?<\/select>', 
     '<CustomSelect value={formData.subject} onChange={(val) => setFormData({ ...formData, subject: val })} options={subjectOptions} placeholder="Select subject" />'),
    
    (r'<select\s+value=\{formData\.board\}\s+onChange=\{\(e\) => setFormData\(\{ \.\.\.formData, board: e\.target\.value \}\)\}\s+className="w-full.*?bg-xyroots-cream/60.*?">.*?<\/select>', 
     '<CustomSelect value={formData.board} onChange={(val) => setFormData({ ...formData, board: val })} options={boardOptions} placeholder="Select board" />')
]
update_file('src/app/register/teacher/page.tsx', teacher_selects, teacher_opts)


# Update Employer Registration Page
employer_opts = """
const typeOptions = [
  { value: "K-12 CBSE School", label: "K-12 CBSE School" },
  { value: "ICSE / ISC School", label: "ICSE / ISC School" },
  { value: "Junior College / Higher Secondary", label: "Junior College / Higher Secondary" },
  { value: "Educational Trust / Group", label: "Educational Trust / Group" },
  { value: "International School (IB/IGCSE)", label: "International School (IB/IGCSE)" },
];
"""

employer_selects = [
    (r'<select\s+value=\{formData\.type\}\s+onChange=\{\(e\) => setFormData\(\{ \.\.\.formData, type: e\.target\.value \}\)\}\s+className="w-full.*?bg-xyroots-cream/60.*?">.*?<\/select>', 
     '<CustomSelect value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })} options={typeOptions} placeholder="Select institution type" />'),
]
update_file('src/app/register/employer/page.tsx', employer_selects, employer_opts)

# Update Teachers List Page filters
teachers_list_opts = """
const verificationOptions = [
  { value: "all", label: "All Teachers" },
  { value: "verified", label: "Verified Only" },
];
const qualificationOptions = [
  { value: "", label: "Any Qualification" },
  { value: "bed", label: "B.Ed" },
  { value: "med", label: "M.Ed" },
  { value: "msc", label: "Master's" },
  { value: "phd", label: "Ph.D" },
];
"""

teachers_list_selects = [
    (r'<select className="w-full p-3 text-sm bg-xyroots-cream rounded-xl border border-xyroots-border">\s*<option>All Teachers</option>\s*<option>Verified Only</option>\s*</select>',
     '<CustomSelect value="all" onChange={()=>{}} options={verificationOptions} placeholder="Verification" />'),
    (r'<select className="w-full p-3 text-sm bg-xyroots-cream rounded-xl border border-xyroots-border">\s*<option>Any Qualification</option>\s*<option>B.Ed</option>\s*<option>M.Ed</option>\s*<option>Master\'s</option>\s*<option>Ph.D</option>\s*</select>',
     '<CustomSelect value="" onChange={()=>{}} options={qualificationOptions} placeholder="Qualification" />')
]
update_file('src/app/teachers/[slug]/page.tsx', teachers_list_selects, teachers_list_opts)

print("Updated all other pages")
