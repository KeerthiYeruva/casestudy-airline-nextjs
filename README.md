# Airline Management System - Next.js

Modern airline check-in and in-flight management system built with **Next.js 16**, **React 19**, **TypeScript**, **Zustand**, **Firebase**, and **Material-UI**.

##  Migration from Create React App

This project has been migrated from Create React App to Next.js for improved performance, SEO, and developer experience.

### Key Changes:
- **Next.js App Router**: Modern routing with React Server Components
- **Optimized Bundle**: Better code splitting and lazy loading
- **TypeScript Support**: Enhanced type safety
- **Server-Side Rendering**: Improved initial page load
- **Material-UI Next.js Integration**: Optimized styling for SSR

##  Prerequisites

- Node.js 18.17 or higher
- npm or yarn
- Firebase account with project setup

##  Installation

1. Clone the repository:
```bash
git clone https://github.com/KeerthiYeruva/casestudy-airline-nextjs.git
cd casestudy-airline-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a `.env.local` file in the root directory
   - Add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

##  Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

### Run Tests
```bash
npm test
```

##  Project Structure

```
casestudy-airline-nextjs/
 src/
    app/                    # Next.js App Router
       layout.tsx         # Root layout with providers
       page.tsx           # Main application page
       theme.ts           # Material-UI theme
    components/            # React components
       AdminDashboard.js
       Auth.js
       ErrorBoundary.js
       InFlight.js
       SeatMapVisual.js
       StaffCheckIn.js
       ...
    lib/                   # Library utilities
       store.js          # Redux store
       firebaseConfig.js # Firebase configuration
       ReduxProvider.jsx # Redux provider wrapper
    slices/               # Redux slices
    constants/            # App constants
    data/                 # Static data
    styles/               # SCSS stylesheets
 next.config.js            # Next.js configuration
 jest.config.js            # Jest testing configuration
 package.json

```

##  Features

- **Staff Check-In**: Passenger check-in management
- **In-Flight Services**: Meal service and ancillary tracking
- **Admin Dashboard**: Flight and passenger management
- **Authentication**: Firebase Authentication (Google Sign-In)
- **Role-Based Access**: Admin and staff roles
- **Accessibility**: WCAG 2.1 Level AA compliant
- **Responsive Design**: Mobile-first approach

##  Testing

The project uses Jest and React Testing Library:
- Unit tests for components
- Integration tests for Redux slices
- Accessibility tests

##  Documentation

- [Quick Start Guide](./QUICKSTART.md)
- [Implementation Details](./IMPLEMENTATION.md)
- [Authentication Guide](./AUTHENTICATION_GUIDE.md)
- [Accessibility Features](./ACCESSIBILITY.md)
- [Testing Notes](./TESTING_NOTES.md)
- [TypeScript Migration](./TYPESCRIPT_MIGRATION.md) ⭐ **NEW**

##  Technologies

- **Next.js 16**: React framework with App Router & Turbopack
- **React 19**: UI library with latest features
- **TypeScript 5**: Type-safe development ⭐ **NEW**
- **Zustand 5**: Lightweight state management (replaced Redux)
- **Firebase 12**: Authentication and backend
- **Material-UI 7**: Modern component library
- **Sass**: CSS preprocessor
- **Jest 29**: Testing framework

##  License

This project is private and proprietary.

##  Contributing

Please read the contributing guidelines before submitting pull requests.
