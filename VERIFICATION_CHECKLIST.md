# Verification Checklist - Teacher Registration Implementation

Use this checklist to verify that all features are working correctly.

## 🔧 Setup Verification

### Environment Configuration
- [ ] `.env.local` file exists
- [ ] `GROQ_API_KEY` is set (not placeholder)
- [ ] `GROQ_MODEL` is set to `llama-3.3-70b-versatile`
- [ ] Supabase credentials are correct
- [ ] Development server starts without errors: `npm run dev`

### Dependencies
- [ ] All packages installed: `npm install`
- [ ] No package vulnerabilities: `npm audit`
- [ ] TypeScript compiles: `npm run build` (optional check)

---

## 📝 Feature Verification

### 1. Password Security

#### AuthModal (Quick Sign-Up)
- [ ] Click "Sign Up" button anywhere on site
- [ ] Select "I'm a Teacher"
- [ ] Find the Password field
- [ ] Verify eye icon is present
- [ ] Click eye icon - password becomes visible
- [ ] Click eye icon again - password becomes hidden
- [ ] Find the Confirm Password field
- [ ] Verify it has its own eye icon
- [ ] Test confirm password toggle independently
- [ ] Enter different passwords in both fields
- [ ] Try to submit - should show "Passwords do not match"
- [ ] Enter matching passwords - error should disappear

#### Teacher Registration Page
- [ ] Navigate to `/register/teacher`
- [ ] Scroll to step 1 (Personal Details)
- [ ] Find Password field
- [ ] Verify eye toggle works
- [ ] Find Confirm Password field
- [ ] Verify eye toggle works independently
- [ ] Test password mismatch validation
- [ ] Test minimum 8 characters validation

### 2. Resume Upload UI

#### File Selection
- [ ] Navigate to `/register/teacher`
- [ ] See "Autofill from Resume" section at top
- [ ] See drag & drop upload box
- [ ] Click upload box - file picker opens
- [ ] Select a PDF resume
- [ ] File name appears
- [ ] File size appears (e.g., "2.4 MB")
- [ ] "Analyze Resume" button appears
- [ ] "Remove" button (trash icon) is present

#### Drag & Drop
- [ ] Drag a PDF file over upload box
- [ ] Upload box changes appearance (hover state)
- [ ] Drop file
- [ ] File name and size appear
- [ ] Repeat with DOCX file

#### File Removal
- [ ] Upload a file
- [ ] Click the trash icon
- [ ] File is removed
- [ ] Upload box returns to idle state

### 3. Resume Extraction

#### Valid PDF Resume
- [ ] Upload a teacher's PDF resume (text-based)
- [ ] Click "Analyze Resume"
- [ ] See spinner: "Analyzing your resume..."
- [ ] After 2-10 seconds, see: "Resume analyzed"
- [ ] Form fields auto-fill with extracted data:
  - [ ] Full Name populated
  - [ ] Email populated
  - [ ] Phone populated
  - [ ] City/Location populated
  - [ ] Professional Title populated (in step 2)
  - [ ] Subject populated (in step 2)
  - [ ] Qualification populated (in step 3)

#### Valid DOCX Resume
- [ ] Remove previous file
- [ ] Upload a DOCX resume
- [ ] Click "Analyze Resume"
- [ ] Extraction works same as PDF
- [ ] Form fields populated

#### Manual Data Preserved
- [ ] Manually enter a name: "John Doe"
- [ ] Upload resume with different name "Jane Smith"
- [ ] Click "Analyze Resume"
- [ ] Verify name stays as "John Doe" (manual entry preserved)

### 4. Error Handling

#### Wrong File Type
- [ ] Try to upload a .txt file
- [ ] Should be rejected (file picker filters)
- [ ] Try to upload a .jpg image
- [ ] Should be rejected

#### File Too Large
- [ ] Try to upload a file > 10MB
- [ ] Should show error: "File is too large..."

#### Scanned PDF
- [ ] Upload a scanned/image-based PDF
- [ ] Click "Analyze Resume"
- [ ] Should show error: "PDF appears to be scanned..."

#### Network Error Simulation
- [ ] Disconnect internet
- [ ] Upload valid resume
- [ ] Click "Analyze Resume"
- [ ] Should show error: "Couldn't analyze resume..."
- [ ] "Try Another File" button appears

### 5. Complete Registration Flow

#### Without Resume
- [ ] Navigate to `/register/teacher`
- [ ] Skip resume upload
- [ ] Fill all fields manually
- [ ] Enter password
- [ ] Enter confirm password (matching)
- [ ] Complete all 7 steps
- [ ] Click "Complete Registration"
- [ ] Success screen appears
- [ ] Redirected to teacher dashboard
- [ ] Check Supabase: profile created
- [ ] Check Supabase: teacher_profile created

#### With Resume
- [ ] Navigate to `/register/teacher`
- [ ] Upload valid teacher resume
- [ ] Click "Analyze Resume"
- [ ] Verify form auto-fills
- [ ] Review extracted data
- [ ] Edit any incorrect fields
- [ ] Enter password + confirm
- [ ] Complete remaining steps
- [ ] Click "Complete Registration"
- [ ] Account created successfully
- [ ] Profile contains resume-extracted data

### 6. Mobile Responsiveness

#### Mobile View (Resize browser to ~375px width)
- [ ] Resume upload box displays correctly
- [ ] Password fields stack properly
- [ ] Eye toggles are tappable
- [ ] Form inputs are readable
- [ ] Buttons are finger-friendly
- [ ] Multi-step progress bar visible
- [ ] No horizontal scroll

#### Tablet View (~768px width)
- [ ] Layout adjusts appropriately
- [ ] Two-column grid works (where applicable)
- [ ] Upload box sized correctly

### 7. Accessibility

#### Keyboard Navigation
- [ ] Tab through all form fields
- [ ] Tab reaches password toggle
- [ ] Press Space/Enter on toggle - it works
- [ ] Tab reaches upload button
- [ ] All interactive elements focusable
- [ ] Focus indicators visible

#### Screen Reader (if available)
- [ ] Password toggle has label "Show password"
- [ ] When visible: "Hide password"
- [ ] Confirm password toggle labeled
- [ ] Upload button has descriptive text
- [ ] Error messages announced

### 8. Database Verification

#### Check Supabase After Registration
- [ ] Open Supabase dashboard
- [ ] Navigate to Table Editor
- [ ] Check `profiles` table:
  - [ ] New record exists
  - [ ] `role` is "teacher"
  - [ ] `full_name` populated
  - [ ] `email` correct
  - [ ] `phone` populated
- [ ] Check `teacher_profiles` table:
  - [ ] New record exists
  - [ ] `profile_id` matches profiles.id
  - [ ] `subject` populated
  - [ ] `qualification` populated
  - [ ] `experience_years` correct (if from resume)
- [ ] Check `auth.users` table:
  - [ ] User record exists
  - [ ] Email correct
  - [ ] Password is hashed (not plain text)
- [ ] Verify NO `confirmPassword` field anywhere
- [ ] Verify NO `passportNumber` field anywhere

---

## 🔍 Edge Cases

### Resume Content
- [ ] Resume with no email - field stays empty
- [ ] Resume with no phone - field stays empty
- [ ] Resume with no experience - array empty
- [ ] Resume with multiple jobs - all extracted
- [ ] Resume with multiple degrees - all extracted
- [ ] Resume with explicit age "32 years old" - extracted
- [ ] Resume with NO age mentioned - stays null
- [ ] Resume mentioning "Physics degree" - NOT auto-filled as teaching subject

### Form Behavior
- [ ] Clear browser cache, reload - form empty
- [ ] Start filling form, refresh - data lost (expected)
- [ ] Upload resume, go to step 2, come back - extracted data still there
- [ ] Try to skip required fields - validation prevents

### Authentication
- [ ] Try to register with existing email - error shown
- [ ] Successfully register, then sign out
- [ ] Try to sign in with new account - works
- [ ] Dashboard accessible after login

---

## 🚨 Common Issues & Solutions

### Issue: Resume extraction fails
**Check:**
- [ ] GROQ_API_KEY is set correctly
- [ ] Not a placeholder value
- [ ] API key is valid (test at console.groq.com)
- [ ] Internet connection active
- [ ] Resume has readable text (not scanned)

### Issue: Password toggle not working
**Check:**
- [ ] Clear browser cache
- [ ] Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Check browser console for errors
- [ ] Verify PasswordInput component imported

### Issue: Form not auto-filling
**Check:**
- [ ] Resume extraction succeeded (green success message)
- [ ] Browser console for errors
- [ ] Fields are not manually filled already
- [ ] Resume contains relevant data

### Issue: Build errors
**Check:**
- [ ] Run `npm install`
- [ ] Delete `.next` folder
- [ ] Restart dev server
- [ ] Check for TypeScript errors

---

## ✅ Final Verification

Once all checkboxes are complete:

- [ ] All password features work
- [ ] Resume upload and extraction work
- [ ] Form auto-fills correctly
- [ ] Validation works properly
- [ ] Mobile experience is good
- [ ] Database records created correctly
- [ ] No security issues
- [ ] Documentation reviewed

## 🎉 Success Criteria

You can consider the implementation successful if:

1. ✅ Teachers can register without resume (manual entry)
2. ✅ Teachers can upload PDF/DOCX resume
3. ✅ Resume data extracts and auto-fills form
4. ✅ Password fields have working eye toggles
5. ✅ Confirm password validates correctly
6. ✅ Complete registration creates Supabase profile
7. ✅ Mobile experience is smooth
8. ✅ No errors in browser console
9. ✅ No sensitive data exposed
10. ✅ User can review data before submission

---

## 📊 Test Results

| Category | Pass | Fail | Notes |
|----------|------|------|-------|
| Password Security | ☐ | ☐ | |
| Resume Upload | ☐ | ☐ | |
| Resume Extraction | ☐ | ☐ | |
| Error Handling | ☐ | ☐ | |
| Complete Registration | ☐ | ☐ | |
| Mobile Responsive | ☐ | ☐ | |
| Accessibility | ☐ | ☐ | |
| Database Integrity | ☐ | ☐ | |

---

## 🆘 Need Help?

If any checklist item fails:

1. **Check browser console** for error messages
2. **Review error messages** shown to user
3. **Verify environment variables** in `.env.local`
4. **Check Supabase connection** in dashboard
5. **Review documentation** in other MD files
6. **Check code comments** in relevant files

## 📝 Notes Section

Use this space to note any issues or observations:

```
Issue: 

Solution: 


Issue: 

Solution: 


```

---

**Date Tested:** _____________

**Tested By:** _____________

**Overall Result:** ☐ Pass | ☐ Fail

**Ready for Production:** ☐ Yes | ☐ No
