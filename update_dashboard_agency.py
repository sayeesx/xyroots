import re

file = 'src/app/dashboard/agency/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    text = f.read()

# Add import Loader
if 'import Loader' not in text:
    text = text.replace('import Navbar from "@/components/Navbar";', 'import Navbar from "@/components/Navbar";\nimport Loader from "@/components/Loader";')

# Update loader state UI
text = re.sub(
    r'<div className="flex h-40 items-center justify-center">\s*<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-xyroots-teal"><\/div>\s*<\/div>',
    '<div className="flex h-64 items-center justify-center">\n            <Loader />\n          </div>',
    text
)

# Update Banner styles
text = re.sub(
    r'className="bg-xyroots-dark text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden"',
    'className="bg-gradient-to-br from-[#074526] to-[#042816] text-white rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_40px_rgb(0,0,0,0.12)] mb-8 relative overflow-hidden border border-white/10"',
    text
)

text = re.sub(
    r'className="absolute top-0 right-0 w-80 h-80 bg-xyroots-teal/20 rounded-full blur-3xl pointer-events-none"',
    'className="absolute -top-20 -right-20 w-96 h-96 bg-xyroots-teal/30 rounded-full blur-[100px] pointer-events-none"\n              /><div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"',
    text
)

# Buttons fix
buttons_match = re.search(r'<div className="flex items-center gap-3">.*?</div>', text, flags=re.DOTALL)
if buttons_match:
    b = buttons_match.group(0)
    new_buttons = """<div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setShowPostJobModal(true)}
                    className="px-5 py-3 rounded-xl font-semibold text-xs bg-xyroots-yellow text-black hover:bg-yellow-400 transition-all flex items-center gap-2 btn-hover"
                  >
                    <FaCirclePlus className="w-4 h-4" />
                    Post Vacancy
                  </button>
                  <button
                    onClick={() => setShowPostTeacherModal && setShowPostTeacherModal(true)}
                    className="px-5 py-3 rounded-xl font-semibold text-xs bg-white text-black hover:bg-gray-100 transition-all flex items-center gap-2 btn-hover"
                  >
                    <FaUser className="w-4 h-4" />
                    Post Teacher Profile
                  </button>
                </div>"""
    text = text.replace(b, new_buttons)

if 'const [showPostTeacherModal, setShowPostTeacherModal]' not in text:
    text = text.replace('const [showPostJobModal, setShowPostJobModal] = useState(false);', 'const [showPostJobModal, setShowPostJobModal] = useState(false);\n  const [showPostTeacherModal, setShowPostTeacherModal] = useState(false);')

# Add Modals
modal_code = """
      {/* Post Teacher Modal */}
      {showPostTeacherModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-modal-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-black">Post a Teacher Profile</h2>
                <p className="text-sm text-gray-500 mt-1">Add a candidate profile on behalf of a teacher.</p>
              </div>
              <button 
                onClick={() => setShowPostTeacherModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Close"
              >
                <FaXmark className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wide">Candidate Name *</label>
                <input type="text" placeholder="e.g. Rahul Sharma" className="w-full p-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-xyroots-teal outline-none transition-all" />
              </div>
              <div className="pt-4 flex gap-3">
                <button onClick={() => setShowPostTeacherModal(false)} className="px-6 py-3.5 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1">
                  Cancel
                </button>
                <button onClick={() => setShowPostTeacherModal(false)} className="px-6 py-3.5 text-sm font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-[#068050] transition-colors flex-[2] flex justify-center items-center gap-2">
                  <FaCircleCheck className="w-4 h-4" /> Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-modal-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-black">Post a Teaching Vacancy</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in the details to find the best educators.</p>
              </div>
              <button 
                onClick={() => setShowPostJobModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Close"
              >
                <FaXmark className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wide">Job Title *</label>
                <input type="text" placeholder="e.g. Senior Post Graduate Biology Teacher" className="w-full p-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-xyroots-teal outline-none transition-all" />
              </div>

              <div className="pt-4 flex gap-3">
                <button onClick={() => setShowPostJobModal(false)} className="px-6 py-3.5 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1">
                  Cancel
                </button>
                <button onClick={() => setShowPostJobModal(false)} className="px-6 py-3.5 text-sm font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-[#068050] transition-colors flex-[2] flex justify-center items-center gap-2">
                  <FaCircleCheck className="w-4 h-4" /> Post Vacancy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
"""
text = text.replace('</main>', modal_code + '\n      </main>')

with open(file, 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated Agency Dashboard UI")
