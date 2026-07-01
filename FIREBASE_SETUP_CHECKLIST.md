# Firebase Real-Time Setup Checklist

## Security Notice

Do not commit real Firebase or Google API keys to Markdown, source code, screenshots, or test fixtures. Store local values in `.env.local` and deployment values in Vercel/Firebase hosting environment variables. If a key is exposed publicly, rotate or revoke it in Google Cloud Console before closing any GitHub secret scanning alert.

## ✅ COMPLETED

### Code Changes
- [x] Updated `.env.local` with your Firebase credentials
  - API Key: stored locally as `NEXT_PUBLIC_FIREBASE_API_KEY` and never committed
  - Project: nextjs-airline
  - Auth Domain: nextjs-airline.firebaseapp.com

- [x] Switched `src/components/Auth.tsx` to Firebase authentication
  - Auto-detects Firebase config
  - Falls back to mock auth if Firebase not configured
  - Handles login/logout with Google Sign-In

- [x] Created `firestore.rules` with authentication requirements
  - All collections require user login
  - Collections protected: flights, passengers, shopItems, ancillaryServices, mealOptions, shopCategories

- [x] Created `firebase.json` for rule deployment

- [x] Firestore database created (asia-south2)

### Documentation
- [x] All 13 .md files updated with current features and secret-safe setup guidance
- [x] Seat management features documented
- [x] i18n & accessibility features documented

---

## 🔄 TO DO - IN FIREBASE CONSOLE

### 1. Enable Google Authentication (Required for sign-in to work)
**Steps:**
1. Open Firebase Console → NextJS-airline project
2. Go to **Authentication** (left sidebar)
3. Click **Get started**
4. Find **Google** in the sign-in methods
5. Click the **Google** option
6. Enable it (toggle ON)
7. Add support email
8. Click **Save**

**Time:** 2 minutes

---

### 2. Publish Firestore Security Rules
**Steps:**
1. Open Firebase Console → **Firestore**
2. Click **Rules** tab
3. Select all text and delete
4. Copy content from `firestore.rules` (in your project root)
5. Paste into rules editor
6. Click **Publish**

**Time:** 2 minutes

**What this does:** Only authenticated users can access your data. Public anonymous access is blocked.

---

### 3. Add Your Vercel Domain to Authorized Domains
**Steps:**
1. Open Firebase Console → **Authentication**
2. Click **Settings** tab
3. Scroll to **Authorized domains**
4. Click **Add domain**
5. Enter your Vercel URL (example: `airline-app.vercel.app`)
6. Click **Add**

**Time:** 1 minute

**Note:** If you deploy a custom domain later, add that too.

---

## 🚀 TO DO - IN VERCEL

### 4. Add Environment Variables to Vercel
**Steps:**
1. Go to Vercel Dashboard
2. Select your airline project
3. Go to **Settings** → **Environment Variables**
4. Add each variable from `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)
5. Click **Save and Redeploy**

**Time:** 3 minutes

---

## 🧪 TO DO - LOCAL TESTING

### 5. Restart Local Dev Server
**Steps:**
1. Stop current server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. Open http://localhost:3000

**Time:** 1 minute

---

### 6. Test Real-Time Updates
**Steps:**
1. Open app in **two browser tabs**
2. Sign in with Google on both
3. In **Tab 1**:
   - Go to Check-In
   - Check in a passenger OR change a seat
4. Look at **Tab 2**:
   - Confirm the passenger list updated WITHOUT page refresh
   - This proves real-time sync is working

**Success indicator:** No manual refresh needed for updates to appear.

**Time:** 2 minutes

---

## 📋 FINAL CHECKLIST

- [ ] Revoke or restrict any previously exposed Google/Firebase API key
- [ ] Create a replacement key if production Firebase auth still needs one
- [ ] Enable Google Auth in Firebase
- [ ] Publish Firestore Rules
- [ ] Add Vercel domain to Firebase authorized domains
- [ ] Add env vars to Vercel
- [ ] Redeploy Vercel (automatic after env vars saved)
- [ ] Restart local dev server
- [ ] Test real-time in two tabs
- [ ] Share production URL with team

---

## 📊 SUMMARY

**Total time remaining:** ~10 minutes  
**Difficulty:** Easy (mostly copy-paste)  
**Risk:** None (all changes are reversible)

Once done, your app will:
✅ Use real Firebase authentication  
✅ Store data in Firestore (persistent)  
✅ Update in real-time across users  
✅ Be shareable on Vercel with auth protection  
✅ Have security rules protecting your data  

---

## 🆘 NEED HELP?

If you get stuck on any Firebase Console step, just ask and I can guide you through the exact clicks.

If real-time updates don't work after all steps, I can debug by checking:
1. Firebase config is loading correctly
2. Firestore rules are active
3. Real-time listeners are subscribing

Ready to proceed? Let me know once you complete the Firebase Console steps! 🚀
