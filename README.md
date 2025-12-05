# Airline Management System - Next.js

Modern airline check-in and in-flight management system built with **Next.js 16**, **React 19**, **TypeScript**, **Zustand**, **Firebase**, and **Material-UI**.

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

##  Features

### Core Modules
- **Staff Check-In System**
  - Passenger check-in management with filtering (by status, special needs, passport verification)
  - Interactive seat map visualization
  - Seat change functionality with real-time seat locking
  - Undo check-in capability
  - Passport verification workflow
  - **Advanced Seat Management** ⭐ NEW
    - Set passenger seat preferences (window/aisle, front/back, exit row)
    - Allocate group seating for travelers together
    - Auto-allocate family seating with safety rules (adults, children, infants)
    - Offer premium seat upgrades with pricing and features
    - Visual indicators for seat preferences, groups, families, and upgrades

- **In-Flight Services Management**
  - Meal service tracking (breakfast, lunch, dinner options)
  - Ancillary services (extra baggage, priority boarding, lounge access, Wi-Fi, entertainment)
  - In-flight shopping with multiple categories
  - Passenger service history
  - Shopping cart management
  - Visual badges for premium seats, group/family seating

- **Admin Dashboard**
  - Flight CRUD operations (Create, Read, Update, Delete)
  - Passenger management with advanced filtering
  - Meal options configuration
  - Ancillary services management
  - Shop items and categories management
  - Real-time data synchronization
  - **Seat Management Tab** ⭐ NEW
    - Centralized seat preference management
    - Group seating allocation interface
    - Family seating allocation with counters
    - Premium seat upsell management

- **Internationalization (i18n)** ⭐ NEW
  - Multi-language support (English, Spanish, French, German, Japanese)
  - Currency conversion (USD, EUR, GBP, JPY, CNY, INR)
  - Timezone handling (11+ global timezones)
  - Locale-specific date/time formatting
  - LocaleSelector component in navigation
  - Real-time language switching without page reload
  - Persistent locale preferences in localStorage

- **Authentication & Authorization**
  - Firebase Authentication integration (Google Sign-In)
  - Role-based access control (Admin/Staff roles)
  - Protected routes and component-level security
  - Persistent authentication state
  - Mock authentication for development

### Technical Features
- **State Management**: Zustand stores with persistence and devtools
- **API Routes**: RESTful API endpoints with TypeScript
- **Real-time Updates**: Automatic data synchronization across components with Server-Sent Events (SSE)
- **Seat Locking**: Real-time seat locking during changes to prevent conflicts
- **Error Handling**: Global error boundaries and toast notifications
- **Accessibility**: WCAG 2.1 Level AA compliant with ARIA labels
- **Responsive Design**: Mobile-first approach with Material-UI v7
- **Type Safety**: Full TypeScript implementation with strict mode
- **Internationalization**: next-intl integration for server-side translations
- **Testing**: Unit and integration tests with Jest and React Testing Library
- **Performance**: Next.js optimizations (Server Components, code splitting, lazy loading, Turbopack)

##  Testing

The project uses Jest and React Testing Library:
- Unit tests for components
- Integration tests for Zustand stores
- Accessibility tests

##  Documentation

### Getting Started
- [Quick Start Guide](./QUICKSTART.md) - Fast setup and initial configuration
- [Authentication Guide](./AUTHENTICATION_GUIDE.md) - Firebase auth setup

### Feature Guides
- [Check-In Guide](./CHECK_IN_GUIDE.md) - Staff check-in system walkthrough
- [In-Flight Guide](./INFLIGHT_GUIDE.md) - In-flight services management
- [Admin Dashboard Guide](./ADMIN_DASHBOARD_GUIDE.md) - Admin features
- [Services Menu Guide](./SERVICES_MENU_GUIDE.md) - Meal and shop management
- [Internationalization (i18n) Guide](./I18N_GUIDE.md) ⭐ NEW - Multi-language setup
- [Seat Management Guide](./SEAT_MANAGEMENT_GUIDE.md) ⭐ NEW - Advanced seating features

### Technical Documentation
- [Accessibility Features](./ACCESSIBILITY.md) - WCAG compliance details
- [Responsive Design](./RESPONSIVE_DESIGN.md) - Mobile-first approach
- [Performance Guide](./PERFORMANCE_GUIDE.md) - Optimization strategies
- [Testing Notes](./TESTING_NOTES.md) - Test coverage and strategies
- [Features Implementation](./FEATURES_IMPLEMENTATION.md) ⭐ NEW - i18n & seat management

##  Technologies Stack

### Frontend Framework
- **Next.js 16.0.7**: React framework with App Router & Turbopack for optimal performance
- **React 19.2.0**: Latest UI library with React Server Components
- **TypeScript 5**: Full type-safe development with strict mode
- **next-intl 4.5.8** ⭐ NEW: Internationalization framework for Next.js App Router

### State Management
- **Zustand 5.0.2**: Lightweight, performant state management
  - Persist middleware for localStorage synchronization
  - Devtools integration for debugging
  - Multiple specialized stores (Auth, Admin, CheckIn, Data, Toast)

### UI & Styling
- **Material-UI (MUI) 7.3.6**: Comprehensive React component library
  - @mui/material: Core components
  - @mui/icons-material: Icon library
  - @mui/material-nextjs: Next.js integration for SSR optimization
- **Emotion 11.14**: CSS-in-JS for styled components
- **Sass 1.94.2**: CSS preprocessor for custom styling

### Backend & Database
- **Firebase 12.6.0**: Backend-as-a-Service platform
  - Authentication (Google Sign-In)
  - Real-time data capabilities
- **Next.js API Routes**: RESTful API endpoints with TypeScript
- **In-memory Database**: Custom DB implementation for development

### Testing
- **Jest 29.7.0**: JavaScript testing framework
- **React Testing Library 16.3.0**: Component testing utilities
- **@testing-library/jest-dom 6.9.1**: Custom Jest matchers
- **@testing-library/user-event 14.6.1**: User interaction simulation
- **jest-environment-jsdom**: DOM testing environment

### Development Tools
- **ESLint 9**: Code linting with Next.js config
- **Babel React Compiler 1.0.0**: React performance optimization
- **TypeScript Compiler**: Static type checking

### Additional Features
- **Server-Side Rendering (SSR)**: Improved SEO and initial page load
- **App Router**: Modern Next.js routing with nested layouts
- **Code Splitting**: Automatic bundle optimization
- **Hot Module Replacement**: Fast development experience
- **Environment Variables**: Secure configuration management

##  Complete Feature List

### Passenger Management
- ✅ Check-in/Undo check-in
- ✅ Seat assignment and changes
- ✅ Passport verification
- ✅ Special requirements (wheelchair, infant)
- ✅ Filtering and search
- ✅ Seat preferences ⭐ NEW
- ✅ Group seating allocation ⭐ NEW
- ✅ Family seating allocation ⭐ NEW
- ✅ Premium seat upgrades ⭐ NEW

### In-Flight Services
- ✅ Meal selection and changes
- ✅ Ancillary services management
- ✅ Duty-free shopping
- ✅ Service history tracking
- ✅ Real-time updates

### Administration
- ✅ Flight CRUD operations
- ✅ Passenger management
- ✅ Services configuration
- ✅ Shop catalog management
- ✅ Real-time monitoring
- ✅ Seat management dashboard ⭐ NEW

### Internationalization ⭐ NEW
- ✅ 5 languages (EN, ES, FR, DE, JA)
- ✅ 6 currencies (USD, EUR, GBP, JPY, CNY, INR)
- ✅ 11+ timezones
- ✅ Date/time formatting
- ✅ Currency conversion
- ✅ Persistent preferences

### Technical Features
- ✅ TypeScript strict mode
- ✅ Server-Side Rendering (SSR)
- ✅ Real-time updates (SSE)
- ✅ State management (Zustand)
- ✅ Responsive design (Mobile-first)
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Testing (Jest + RTL)
- ✅ Error handling
- ✅ Performance optimization

##  License

This project is private and proprietary.

##  Contributing

Please read the contributing guidelines before submitting pull requests.
