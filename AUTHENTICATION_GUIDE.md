# Authentication Switching Guide

This application supports **both Mock Authentication and Firebase Authentication**. You can easily switch between them.

## Current Status

Authentication is implemented in `src/components/auth/Auth.tsx` with Zustand state in `src/stores/useAuthStore.ts`. Firebase config is read from environment variables in `src/lib/firebaseConfig.js`; do not paste real Firebase API keys into this guide or any committed source file.

---

## 🎯 Current Setup: MOCK Authentication (Active)

The app is currently using **mock authentication** - no Firebase setup required!

---

## 🔄 How to Switch to Firebase Authentication

### Step 1: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Google Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Google provider
   - Add authorized domains if needed

4. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Copy the Firebase configuration

5. Create or update `.env.local` with Firebase values:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

`src/lib/firebaseConfig.js` already reads these variables and falls back to mock-safe placeholders when they are absent.

### Step 2: Verify Auth Component (`src/components/auth/Auth.tsx`)

The current auth component auto-detects Firebase configuration and can fall back to mock users for local/demo development. You should not need to manually comment or uncomment large code sections.

1. **Import Section** (top of file):
```javascript
// UNCOMMENT THIS:
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '../../lib/firebaseConfig';

// COMMENT OUT: Mock user data section
// const MOCK_USERS = [ ... ];
```

2. **Add useEffect** (in Auth component):
```javascript
// UNCOMMENT THIS:
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser && !isAuthenticated) {
      setRoleDialog(true);
    }
  });
  return () => unsubscribe();
}, [isAuthenticated]);
```

3. **Login Handler**:
```javascript
// COMMENT OUT: Mock handleLogin

// UNCOMMENT THIS:
const handleLogin = async () => {
  dispatch(loginStart());
  try {
    await signInWithPopup(auth, googleProvider);
    setRoleDialog(true);
  } catch (error) {
    dispatch(loginFailure(error.message));
    console.error('Login error:', error);
  }
};
```

4. **Role Selection Handler**:
```javascript
// COMMENT OUT: Mock handleRoleSelection

// UNCOMMENT THIS:
const handleRoleSelection = () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    dispatch(loginSuccess({
      user: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
      },
      role: selectedRole,
    }));
    setRoleDialog(false);
  }
};
```

5. **Logout Handler**:
```javascript
// COMMENT OUT: Mock handleLogout

// UNCOMMENT THIS:
const handleLogout = async () => {
  try {
    await signOut(auth);
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

6. **Remove Mock User Selection from Dialog**:
Remove the "User" FormControl that shows John Doe / Jane Smith selection.

### Step 3: Verify Zustand Auth Store

Authentication state is managed in `src/stores/useAuthStore.ts`. The store tracks the current user, role, loading/error state, and role permissions. No separate global store setup is required for Firebase user objects in the current codebase.

### Step 4: Verify Role-Based Navigation

`src/components/layout/HomeClient.tsx` reads auth state and role permissions to decide which views are available. Customers can use public/customer workflows, staff can access operations, and admins can access the full management surface.

### Step 5: Test Firebase Authentication

1. Stop the development server (Ctrl+C)
2. Start it again: `npm run dev`
3. Click "Sign in with Google"
4. Select your Google account
5. Choose role (Admin/Staff)
6. Verify authentication works!

---

## 🔙 How to Switch Back to Mock Authentication

Remove or leave blank the Firebase environment variables and restart the dev server. The auth component can fall back to mock/demo behavior when Firebase is not configured.

---

## 📝 Quick Reference: File Locations

| File | What to Change |
|------|----------------|
| `.env.local` | Store local Firebase values, ignored by git |
| `src/lib/firebaseConfig.js` | Reads Firebase values from environment variables |
| `src/components/auth/Auth.tsx` | Login/logout and role selection UI |
| `src/stores/useAuthStore.ts` | Auth and role state |
| `src/components/layout/HomeClient.tsx` | Role-based navigation and view access |

---

## 🎯 Comparison: Mock vs Firebase

### Mock Authentication (Current)
✅ **Pros:**
- No setup required
- Works immediately
- Perfect for demo/development
- No external dependencies
- No API costs

❌ **Cons:**
- Not production-ready
- No real authentication
- Limited to 2 hardcoded users

### Firebase Authentication
✅ **Pros:**
- Production-ready
- Real Google OAuth
- Secure authentication
- Unlimited users
- Session management
- Industry standard

❌ **Cons:**
- Requires Firebase account
- Setup time (5-10 minutes)
- Needs configuration
- External dependency

---

## 🆘 Troubleshooting

### Firebase Error: "Auth domain not whitelisted"
**Solution:** Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Firebase Error: "API key not valid"
**Solution:** Double-check `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local` or your deployment environment. If the key was exposed publicly, revoke or restrict it in Google Cloud Console and create a replacement.

### App Still Shows Mock Users After Switching
**Solution:** 
1. Make sure you uncommented Firebase code
2. Make sure you commented out Mock code
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart dev server

### "Module not found" Error
**Solution:** Make sure you didn't delete the Firebase imports from `firebaseConfig.js`

---

## 💡 Best Practices

1. **Development:** Use Mock authentication for quick testing
2. **Staging:** Switch to Firebase to test real authentication flow
3. **Production:** Always use Firebase authentication
4. **Demo:** Mock authentication is perfect for presentations

---

## 📧 Support

For Firebase setup help:
- [Firebase Documentation](https://firebase.google.com/docs/auth)
- [Google Sign-In Guide](https://firebase.google.com/docs/auth/web/google-signin)

---

## 📱 Mobile Role Switching (NEW!)

### Switching Roles on Any Device

You can now **change your role** (Staff ↔ Admin) directly from the navigation bar on **all devices including mobile**!

#### Desktop/Tablet
- Look for the role dropdown next to your name in the top-right corner
- Click the dropdown and select Staff or Admin

#### Mobile
- Find the **compact role dropdown** in the top navigation bar
- It's positioned right after your avatar (showing S or A badge)
- Tap the dropdown to switch between roles
- Width: 60px (compact for mobile)
- Height: 32px (touch-friendly)

#### Visual Indicators
- **Mobile:** Small badge showing "S" (Staff) or "A" (Admin)
- **Desktop:** Full chip with "Staff" or "Admin" text
- **Dropdown:** Always shows current active role

#### No Logout Required!
- Switch roles instantly
- No need to sign out and sign back in
- Changes take effect immediately
- Navigation updates automatically

**For detailed mobile role switching guide, see:** `MOBILE_ROLE_SWITCHING.md`

---

**Current Status:** ✅ Mock Authentication Active | ✅ Mobile Role Switching Enabled

