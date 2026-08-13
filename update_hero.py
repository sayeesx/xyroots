import re

file_path = 'src/components/Hero.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add CustomSelect import
if 'CustomSelect' not in content:
    content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport CustomSelect from "@/components/ui/CustomSelect";')

options_to_add = """const qualificationOptions = [
  { value: "bed", label: "B.Ed" },
  { value: "med", label: "M.Ed" },
  { value: "msc", label: "M.Sc / MA" },
  { value: "phd", label: "Ph.D / Doctorate" },
  { value: "net_set", label: "NET / SET Qualified" },
];

const subjectOptions = [
  { value: "maths", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "english", label: "English Literature" },
];

const expFromOptions = [
  { value: "0", label: "Fresher" },
  { value: "1", label: "1 Year" },
  { value: "3", label: "3 Years" },
];

const managementSubjectOptions = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "English", label: "English" },
  { value: "Computer Science", label: "Computer Science" },
];

const managementQualOptions = [
  { value: "bed", label: "B.Ed" },
  { value: "med", label: "M.Ed" },
  { value: "msc", label: "Master's" },
  { value: "phd", label: "Ph.D" },
];

const managementExpOptions = [
  { value: "0", label: "Fresher (0 yrs)" },
  { value: "2", label: "2+ Years" },
  { value: "5", label: "5+ Years" },
  { value: "10", label: "10+ Years" },
];

const institutionOptions = ["""

if 'qualificationOptions' not in content:
    content = content.replace('const institutionOptions = [', options_to_add)

# Replace Job Option (Seeker)
content = re.sub(
    r'<div className="relative">\s*<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xyroots-teal"><i className="bi bi-briefcase text-sm" /></span>\s*<select value={jobOption} onChange={\(e\) => handleInstitutionChange\(e.target.value\)} className="w-full pl-9 pr-8 py-2\.5 text-sm bg-xyroots-surface border border-xyroots-border text-xyroots-text appearance-none outline-none focus:border-xyroots-teal" aria-label="Job option">\s*<option value="">Choose an option</option>\s*\{institutionOptions\.map\(\(opt\) => \(<option key=\{opt\.value\} value=\{opt\.value\}>\{opt\.label\}</option>\)\)\}\s*</select>\s*<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xyroots-muted pointer-events-none text-xs">▼</span>\s*</div>',
    '<CustomSelect value={jobOption} onChange={handleInstitutionChange} options={institutionOptions} placeholder="Choose an option" icon={<i className="bi bi-briefcase text-sm" />} searchable />',
    content
)

# Replace State (Seeker)
content = re.sub(
    r'<div className="relative">\s*<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xyroots-teal"><i className="bi bi-geo-alt text-sm" /></span>\s*<select value=\{stateVal\} onChange=\{\(e\) => handleStateChange\(e.target.value\)\} className="w-full pl-9 pr-8 py-2\.5 text-sm bg-xyroots-surface border border-xyroots-border text-xyroots-text appearance-none outline-none focus:border-xyroots-teal" aria-label="State">\s*\{stateOptions\.map\(\(st\) => \(<option key=\{st\.value\} value=\{st\.value\}>\{st\.label\}</option>\)\)\}\s*</select>\s*<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xyroots-muted pointer-events-none text-xs">▼</span>\s*</div>',
    '<CustomSelect value={stateVal} onChange={handleStateChange} options={stateOptions} placeholder="State" icon={<i className="bi bi-geo-alt text-sm" />} searchable />',
    content
)

# Replace Designation
content = re.sub(
    r'<div className="relative">\s*<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xyroots-teal"><i className="bi bi-book text-sm" /></span>\s*<select value=\{designation\} onChange=\{\(e\) => setDesignation\(e.target.value\)\} className="w-full pl-9 pr-8 py-2\.5 text-sm bg-xyroots-surface border border-xyroots-border text-xyroots-text appearance-none outline-none focus:border-xyroots-teal" aria-label="Designation">\s*<option value="">Select a designation</option>\s*\{availableDesignations\.map\(\(des\) => \(<option key=\{des\.value\} value=\{des\.value\}>\{des\.label\}</option>\)\)\}\s*</select>\s*<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xyroots-muted pointer-events-none text-xs">▼</span>\s*</div>',
    '<CustomSelect value={designation} onChange={setDesignation} options={availableDesignations} placeholder="Select a designation" icon={<i className="bi bi-book text-sm" />} searchable />',
    content
)

# Replace District (Seeker)
content = re.sub(
    r'<select value=\{district\} onChange=\{\(e\) => setDistrict\(e.target.value\)\} className="w-full sm:w-auto px-3 py-1\.5 bg-xyroots-surface border border-xyroots-border text-xyroots-muted hover:text-xyroots-text cursor-pointer outline-none">\s*<option value="">District</option>\s*\{availableDistricts\.map\(\(d\) => \(<option key=\{d\.value\} value=\{d\.value\}>\{d\.label\}</option>\)\)\}\s*</select>',
    '<div className="w-full sm:w-32"><CustomSelect value={district} onChange={setDistrict} options={availableDistricts} placeholder="District" searchable /></div>',
    content
)

# Replace Qualification (Seeker)
content = re.sub(
    r'<select value=\{qualification\} onChange=\{\(e\) => setQualification\(e.target.value\)\} className="w-full sm:w-auto px-3 py-1\.5 bg-xyroots-surface border border-xyroots-border text-xyroots-muted hover:text-xyroots-text cursor-pointer outline-none">\s*<option value="">Qualification</option>\s*<option value="bed">B\.Ed</option>\s*<option value="med">M\.Ed</option>\s*<option value="msc">M\.Sc / MA</option>\s*<option value="phd">Ph\.D / Doctorate</option>\s*<option value="net_set">NET / SET Qualified</option>\s*</select>',
    '<div className="w-full sm:w-36"><CustomSelect value={qualification} onChange={setQualification} options={qualificationOptions} placeholder="Qualification" /></div>',
    content
)

# Replace Subject (Seeker)
content = re.sub(
    r'<select value=\{subject\} onChange=\{\(e\) => setSubject\(e.target.value\)\} className="w-full sm:w-auto px-3 py-1\.5 bg-xyroots-surface border border-xyroots-border text-xyroots-muted hover:text-xyroots-text cursor-pointer outline-none">\s*<option value="">Subject</option>\s*<option value="maths">Mathematics</option>\s*<option value="physics">Physics</option>\s*<option value="chemistry">Chemistry</option>\s*<option value="english">English Literature</option>\s*</select>',
    '<div className="w-full sm:w-36"><CustomSelect value={subject} onChange={setSubject} options={subjectOptions} placeholder="Subject" searchable /></div>',
    content
)

# Replace Exp From (Seeker)
content = re.sub(
    r'<select value=\{expFrom\} onChange=\{\(e\) => setExpFrom\(e.target.value\)\} className="w-full sm:w-auto px-3 py-1\.5 bg-xyroots-surface border border-xyroots-border text-xyroots-muted hover:text-xyroots-text cursor-pointer outline-none">\s*<option value="">Exp From</option>\s*<option value="0">Fresher</option>\s*<option value="1">1 Year</option>\s*<option value="3">3 Years</option>\s*</select>',
    '<div className="w-full sm:w-36"><CustomSelect value={expFrom} onChange={setExpFrom} options={expFromOptions} placeholder="Exp From" /></div>',
    content
)

# Replace Subject (Management)
content = re.sub(
    r'<div className="relative">\s*<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xyroots-teal"><i className="bi bi-book text-sm" /></span>\s*<select value=\{subject\} onChange=\{\(e\) => setSubject\(e.target.value\)\} className="w-full pl-9 pr-8 py-2\.5 text-sm bg-xyroots-surface border border-xyroots-border text-xyroots-text appearance-none outline-none focus:border-xyroots-teal" aria-label="Subject">\s*<option value="">Subject specialisation</option>\s*<option value="Mathematics">Mathematics</option>\s*<option value="Physics">Physics</option>\s*<option value="Chemistry">Chemistry</option>\s*<option value="Biology">Biology</option>\s*<option value="English">English</option>\s*<option value="Computer Science">Computer Science</option>\s*</select>\s*<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xyroots-muted pointer-events-none text-xs">▼</span>\s*</div>',
    '<CustomSelect value={subject} onChange={setSubject} options={managementSubjectOptions} placeholder="Subject specialisation" icon={<i className="bi bi-book text-sm" />} searchable />',
    content
)

# Replace State (Management)
content = re.sub(
    r'<div className="relative">\s*<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xyroots-teal"><i className="bi bi-geo-alt text-sm" /></span>\s*<select value=\{stateVal\} onChange=\{\(e\) => handleStateChange\(e.target.value\)\} className="w-full pl-9 pr-8 py-2\.5 text-sm bg-xyroots-surface border border-xyroots-border text-xyroots-text appearance-none outline-none focus:border-xyroots-teal" aria-label="State">\s*\{stateOptions\.map\(\(st\) => \(<option key=\{st\.value\} value=\{st\.value\}>\{st\.label\}</option>\)\)\}\s*</select>\s*<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xyroots-muted pointer-events-none text-xs">▼</span>\s*</div>',
    '<CustomSelect value={stateVal} onChange={handleStateChange} options={stateOptions} placeholder="State" icon={<i className="bi bi-geo-alt text-sm" />} searchable />',
    content
)

# Replace Qual (Management)
content = re.sub(
    r'<div className="relative">\s*<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xyroots-teal"><i className="bi bi-award text-sm" /></span>\s*<select value=\{qualification\} onChange=\{\(e\) => setQualification\(e.target.value\)\} className="w-full pl-9 pr-8 py-2\.5 text-sm bg-xyroots-surface border border-xyroots-border text-xyroots-text appearance-none outline-none focus:border-xyroots-teal" aria-label="Qualification">\s*<option value="">Any Qualification</option>\s*<option value="bed">B\.Ed</option>\s*<option value="med">M\.Ed</option>\s*<option value="msc">Master\'s</option>\s*<option value="phd">Ph\.D</option>\s*</select>\s*<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xyroots-muted pointer-events-none text-xs">▼</span>\s*</div>',
    '<CustomSelect value={qualification} onChange={setQualification} options={managementQualOptions} placeholder="Any Qualification" icon={<i className="bi bi-award text-sm" />} searchable />',
    content
)

# Replace District (Management)
content = re.sub(
    r'<select value=\{district\} onChange=\{\(e\) => setDistrict\(e.target.value\)\} className="w-full sm:w-auto px-3 py-1\.5 bg-xyroots-surface border border-xyroots-border text-xyroots-muted hover:text-xyroots-text cursor-pointer outline-none">\s*<option value="">District Limit</option>\s*\{availableDistricts\.map\(\(d\) => \(<option key=\{d\.value\} value=\{d\.value\}>\{d\.label\}</option>\)\)\}\s*</select>',
    '<div className="w-full sm:w-36"><CustomSelect value={district} onChange={setDistrict} options={availableDistricts} placeholder="District Limit" searchable /></div>',
    content
)

# Replace Exp (Management)
content = re.sub(
    r'<select value=\{expFrom\} onChange=\{\(e\) => setExpFrom\(e.target.value\)\} className="w-full sm:w-auto px-3 py-1\.5 bg-xyroots-surface border border-xyroots-border text-xyroots-muted hover:text-xyroots-text cursor-pointer outline-none">\s*<option value="">Min Experience</option>\s*<option value="0">Fresher \(0 yrs\)</option>\s*<option value="2">2\+ Years</option>\s*<option value="5">5\+ Years</option>\s*<option value="10">10\+ Years</option>\s*</select>',
    '<div className="w-full sm:w-36"><CustomSelect value={expFrom} onChange={setExpFrom} options={managementExpOptions} placeholder="Min Experience" /></div>',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Hero.tsx successfully")
