# Quick Start Guide - Airline Management System

## 🚀 2-Minute Setup

### 1. Install Dependencies (First Time Only)
```powershell
npm install
```

### 2. Start Development Server
```powershell
npm start
```
Opens at: http://localhost:3000

**That's it!** No Firebase or external setup required. The app uses mock authentication.

---

## 🔐 Login & Access

### Mock Authentication
- **No Firebase setup required** - uses built-in mock users
- Instant login with pre-configured users
- Perfect for demo and development

### Login Steps
1. Click "Sign in with Google" button
2. Select a mock user:
   - **John Doe** (john.doe@airline.com)
   - **Jane Smith** (jane.smith@airline.com)
3. Choose role: **Admin** or **Staff**
4. Access granted!

### Mock Users
Both users work identically - pick either one:
- Avatar auto-generated
- Full name and email displayed
- Works with all features

### Role Permissions
| Feature | Admin | Staff |
|---------|-------|-------|
| Check-In Module | ✅ | ✅ |
| In-Flight Services | ✅ | ✅ |
| Admin Dashboard | ✅ | ❌ |

---

## 📱 Navigation

### Main Modules
1. **Check-In** - Flight selection, seat map, passenger check-in
2. **In-Flight** - Meal preferences, services, shopping
3. **Admin** - Passenger management, services catalog (Admin only)

### Quick Actions
- **Switch Role**: Click profile → Select role dropdown
- **Logout**: Click "Logout" button in profile
- **Filter Passengers**: Use checkboxes on left panel
- **Change Seat**: Click seat on map → Enter new seat

---

## 🧪 Testing

### Run All Tests
```powershell
npm test
```

### Run Specific Test
```powershell
npm test Auth.test.js
```

### Watch Mode (Auto-rerun)
```powershell
npm test -- --watch
```

---

## 🏗️ Build for Production

### Create Production Build
```powershell
npm run build
```
Output: `build/` folder

### Test Production Build Locally
```powershell
# Install serve globally (first time only)
npm install -g serve

# Serve production build
serve -s build
```

---

## 📊 Sample Data

### Included Flights
- **AI101**: Mumbai → Delhi (8:00 AM)
- **AI202**: Delhi → Bangalore (2:00 PM) - Delayed
- **AI303**: Bangalore → Chennai (6:00 PM)

### Sample Passengers
- 20+ passengers with complete data
- Mix of wheelchair/infant requirements
- Various check-in statuses
- Different meal preferences

### Catalog Items
- **Meals**: 10 options (Veg, Non-Veg, Vegan, etc.)
- **Services**: 10 ancillary services ($20-$100)
- **Shop**: 24 items in 6 categories ($5-$300)

---

## 🎨 Responsive Breakpoints

### Device Sizes
- **Mobile**: ≤600px (Small)
- **Tablet**: 601-960px (Medium)
- **Desktop**: ≥961px (Large)

### Test Responsiveness
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device or resize window

---

## ♿ Accessibility Testing

### Keyboard Navigation
- **Tab**: Move between elements
- **Enter/Space**: Activate buttons
- **Escape**: Close dialogs
- **Arrow Keys**: Navigate dropdowns

### Skip Navigation
- Press **Tab** on page load
- First element: "Skip to main content" link
- Press **Enter** to jump to content

### Screen Reader Testing
- **Windows**: NVDA (free) or JAWS
- **macOS**: VoiceOver (built-in, Cmd+F5)
- **Linux**: Orca

---

## 🐛 Common Issues & Solutions

### Issue: Firebase Error on Login
**Solution**: Check firebaseConfig.js has correct API key and authDomain

### Issue: "Module not found" Error
**Solution**: Run `npm install` to install dependencies

### Issue: Port 3000 Already in Use
**Solution**: 
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or use different port
$env:PORT=3001; npm start
```

### Issue: Changes Not Reflecting
**Solution**: 
1. Stop server (Ctrl+C)
2. Clear cache: `npm run build` (then Ctrl+C)
3. Restart: `npm start`

### Issue: Tests Failing
**Solution**: 
1. Check Node version: `node --version` (need v16+)
2. Reinstall: `Remove-Item -Recurse node_modules; npm install`
3. Run: `npm test`

---

## 📂 Key Files & Locations

### Components
```
src/components/
├── Auth.js              # Login/logout
├── StaffCheckIn.js      # Check-in interface
├── InFlight.js          # In-flight services
└── AdminDashboard.js    # Admin panel
```

### State Management
```
src/slices/
├── authSlice.js         # Authentication state
├── checkInSlice.js      # Check-in state
└── adminSlice.js        # Admin state
```

### Styling
```
src/
├── App.scss             # Global styles
└── styles/
    ├── Accessibility.scss   # WCAG styles
    ├── StaffCheckIn.scss
    ├── SeatMap.scss
    └── FlightList.scss
```

### Configuration
```
src/
├── firebaseConfig.js    # Firebase setup
├── Store.js             # Redux store
└── data/
    └── flightData.js    # Mock data
```

---

## 🔧 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm test` | Run test suite |
| `npm run build` | Create production build |
| `npm run eject` | Eject from Create React App (⚠️ irreversible) |

---

## 📚 Documentation Files

- **README.md** - Complete documentation (557 lines)
- **ACCESSIBILITY.md** - Accessibility guide
- **IMPLEMENTATION.md** - Technical implementation details
- **QUICKSTART.md** - This file

---

## 💡 Tips & Tricks

### Fast Development
1. Keep DevTools open for console errors
2. Use React DevTools extension for state inspection
3. Use Redux DevTools for state debugging

### Finding Features
- **Check-In**: Click flight → See seat map + passenger list
- **Change Meal**: In-Flight tab → Select passenger → Meal dropdown
- **Add Service**: In-Flight tab → Select passenger → Ancillary Services section
- **Shop**: In-Flight tab → Select passenger → Scroll to Shop section
- **Admin CRUD**: Admin tab → "Passengers" → + Add Passenger button

### Keyboard Shortcuts
- **Ctrl+Shift+I**: Open DevTools
- **Ctrl+Shift+M**: Toggle device toolbar (responsive testing)
- **F5**: Refresh page
- **Ctrl+F5**: Hard refresh (clear cache)

---

## 🎯 Next Steps

1. ✅ Configure Firebase authentication
2. ✅ Start development server
3. ✅ Login with Google account
4. ✅ Explore check-in module
5. ✅ Test in-flight shopping
6. ✅ Try admin features (if Admin role)
7. ✅ Run tests
8. ✅ Build for production

---

## 📞 Need Help?

- Check README.md for detailed documentation
- Review ACCESSIBILITY.md for accessibility features
- Read IMPLEMENTATION.md for technical details
- Open an issue in the repository

---

**Happy Coding! ✈️**
