# Authentication Switching Guide

This application supports **both Mock Authentication and Firebase Authentication**. You can easily switch between them.

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

5. Update `src/firebaseConfig.js`:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 2: Update Auth Component (`src/components/Auth.js`)

**Comment out MOCK sections and uncomment FIREBASE sections:**

1. **Import Section** (top of file):
```javascript
// UNCOMMENT THIS:
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '../firebaseConfig';

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

### Step 3: Update Auth Slice (`src/slices/authSlice.js`)

**Comment out MOCK thunks and uncomment FIREBASE thunks:**

1. **Import Section**:
```javascript
// UNCOMMENT THESE:
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
```

2. **Async Thunks**:
```javascript
// COMMENT OUT: Mock loginWithGoogle and logoutUser

// UNCOMMENT THESE:
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        uid: result.user.uid,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Step 4: Update Store.js (No changes needed)

The Redux store middleware is already configured to handle Firebase user objects:
```javascript
serializableCheck: {
  ignoredActions: ['auth/loginSuccess', 'auth/setUser', 'auth/loginWithGoogle/fulfilled'],
  ignoredPaths: ['auth.user'],
}
```

### Step 5: Test Firebase Authentication

1. Stop the development server (Ctrl+C)
2. Start it again: `npm start`
3. Click "Sign in with Google"
4. Select your Google account
5. Choose role (Admin/Staff)
6. Verify authentication works!

---

## 🔙 How to Switch Back to Mock Authentication

Simply reverse the process:
1. Comment out all FIREBASE sections
2. Uncomment all MOCK sections
3. Restart the dev server

---

## 📝 Quick Reference: File Locations

| File | What to Change |
|------|----------------|
| `src/firebaseConfig.js` | Replace Firebase config values |
| `src/components/Auth.js` | Toggle MOCK/FIREBASE comments |
| `src/slices/authSlice.js` | Toggle MOCK/FIREBASE comments |
| `src/Store.js` | ✅ No changes needed |

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
**Solution:** Double-check your Firebase config in `firebaseConfig.js`

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

