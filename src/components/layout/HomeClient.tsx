"use client";

import { useState, lazy, Suspense, type ReactNode } from "react";
import useAuthStore from "@/stores/useAuthStore";
import Auth from "@/components/auth/Auth";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  Box,
  CircularProgress,
  Alert,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import SettingsIcon from "@mui/icons-material/Settings";
import LocaleSelector from "@/components/common/LocaleSelector";

const FlightSearch = lazy(() => import("@/components/customer/FlightSearch"));
const PassengerPortal = lazy(() => import("@/components/customer/PassengerPortal"));
const FlightStatusDashboard = lazy(() => import("@/components/customer/FlightStatusDashboard"));
const StaffCheckIn = lazy(() => import("@/components/checkin/StaffCheckIn"));
const InFlight = lazy(() => import("@/components/inflight/InFlight"));
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard"));

type ViewKey = "search" | "trips" | "status" | "signin" | "checkin" | "inflight" | "admin";
type UserRole = "admin" | "staff" | null;
type AccessLevel = "public" | "staff" | "admin";

interface NavigationItem {
  view: Exclude<ViewKey, "signin">;
  label: string;
  mobileLabel: string;
  description: string;
  icon: ReactNode;
  access: AccessLevel;
}

const navigationItems: NavigationItem[] = [
  {
    view: "search",
    label: "Flights",
    mobileLabel: "Flight Search",
    description: "Find available routes and dates",
    icon: <SearchIcon />,
    access: "public",
  },
  {
    view: "trips",
    label: "My Trips",
    mobileLabel: "My Trips",
    description: "Manage a booking by PNR",
    icon: <ConfirmationNumberIcon />,
    access: "public",
  },
  {
    view: "status",
    label: "Status",
    mobileLabel: "Flight Status",
    description: "Track status, gates, and terminals",
    icon: <ConnectingAirportsIcon />,
    access: "public",
  },
  {
    view: "checkin",
    label: "Check-In",
    mobileLabel: "Check-In",
    description: "Passenger check-in and boarding",
    icon: <AirlineSeatReclineExtraIcon />,
    access: "staff",
  },
  {
    view: "inflight",
    label: "In-Flight",
    mobileLabel: "In-Flight Services",
    description: "Meals, shop, and services",
    icon: <FlightTakeoffIcon />,
    access: "staff",
  },
  {
    view: "admin",
    label: "Admin",
    mobileLabel: "Admin Dashboard",
    description: "Passenger and service management",
    icon: <SettingsIcon />,
    access: "admin",
  },
];

const canAccessLevel = (access: AccessLevel, role: UserRole, isAuthenticated: boolean) => {
  if (access === "public") return true;
  if (!isAuthenticated) return false;
  if (access === "staff") return role === "staff" || role === "admin";
  return role === "admin";
};

const canAccessNavigationItem = (item: NavigationItem, role: UserRole, isAuthenticated: boolean) => {
  return canAccessLevel(item.access, role, isAuthenticated);
};

const LoadingFallback = () => (
  <Box className="loading-container" role="status" aria-live="polite">
    <CircularProgress aria-label="Loading content" />
    <Typography variant="body1" sx={{ ml: 2 }}>
      Loading...
    </Typography>
  </Box>
);

/**
 * HomeClient Component
 * 
 * Client Component that handles:
 * - User authentication state
 * - Navigation between views
 * - Dynamic component loading
 * - Mobile responsive menu
 */
export default function HomeClient() {
  const [currentView, setCurrentView] = useState<ViewKey>("search");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, role } = useAuthStore();

  const canAccessAdmin = isAuthenticated && role === "admin";
  const accessibleNavigationItems = navigationItems.filter((item) => canAccessNavigationItem(item, role, isAuthenticated));
  const canAccessCurrentView = currentView === "signin"
    ? !isAuthenticated
    : navigationItems.some((item) => item.view === currentView && canAccessNavigationItem(item, role, isAuthenticated));
  const activeView: ViewKey = canAccessCurrentView ? currentView : "search";

  return (
    <ErrorBoundary>
      <Box sx={{ flexGrow: 1 }}>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <AppBar position="static" component="nav" role="navigation">
          <Toolbar sx={{ gap: 1, py: { xs: 1, sm: 1.5 } }}>
            {/* Mobile Hamburger Menu */}
            <IconButton
              color="inherit"
              aria-label="Open navigation menu"
              edge="start"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              <FlightTakeoffIcon aria-hidden="true" />
              <Typography 
                variant="h6" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  mr: { xs: 0, md: 2 }
                }}
              >
                Airline Management
              </Typography>
            </Box>
            
            {/* Desktop Navigation - Hidden on Mobile */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 1.5, 
              alignItems: "center"
            }}>
              {accessibleNavigationItems.map((item) => (
                <Button
                  key={item.view}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => setCurrentView(item.view)}
                  variant={activeView === item.view ? "outlined" : "text"}
                  aria-label={`Navigate to ${item.mobileLabel}`}
                  aria-current={activeView === item.view ? "page" : undefined}
                  size="small"
                  sx={{ fontSize: '0.875rem', px: 2 }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
            
            {/* Locale Selector - Always visible */}
            <Box sx={{ display: 'flex', mr: 1 }}>
              <LocaleSelector />
            </Box>
            
            {isAuthenticated ? (
              <Auth />
            ) : (
              <Button
                color="inherit"
                variant={activeView === "signin" ? "outlined" : "text"}
                onClick={() => setCurrentView("signin")}
                aria-label="Sign in"
                size="small"
                sx={{ fontSize: '0.875rem', px: 2 }}
              >
                Sign In
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer Menu */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: 280,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlightTakeoffIcon color="primary" />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                Menu
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          
          {isAuthenticated ? (
            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Logged in as
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold', flex: 1 }}>
                  {useAuthStore.getState().user?.displayName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40 }}>
                  Role:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                  <Button
                    variant={role === 'staff' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => useAuthStore.getState().setRole('staff')}
                    fullWidth
                    sx={{ fontSize: '0.75rem', py: 0.5 }}
                  >
                    Staff
                  </Button>
                  <Button
                    variant={role === 'admin' ? 'contained' : 'outlined'}
                    size="small"
                    color="secondary"
                    onClick={() => useAuthStore.getState().setRole('admin')}
                    fullWidth
                    sx={{ fontSize: '0.75rem', py: 0.5 }}
                  >
                    Admin
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Guest access
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Search and book flights, or sign in for staff tools.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setCurrentView("signin");
                  setMobileMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            </Box>
          )}
          <Divider />
          
          <List>
            {accessibleNavigationItems.map((item, index) => (
              <Box key={item.view}>
                {item.access === "admin" && index > 0 && <Divider sx={{ my: 1 }} />}
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={activeView === item.view}
                    onClick={() => {
                      setCurrentView(item.view);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{ color: activeView === item.view ? 'primary.main' : 'inherit', display: 'flex' }}>
                        {item.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.mobileLabel} 
                      secondary={item.description}
                      slotProps={{
                        primary: {
                          sx: { 
                            fontWeight: activeView === item.view ? 'bold' : 'normal',
                            color: activeView === item.view && item.access === 'admin' ? 'secondary.main' : 'inherit'
                          }
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Box>
            ))}
          </List>
        </Drawer>

        <Box component="main" id="main-content" sx={{ mt: 3, mb: 3 }} role="main">
          {isAuthenticated && !canAccessAdmin && currentView === "admin" && (
            <Alert severity="error" sx={{ m: 2 }}>
              Access Denied: Admin privileges required. Please switch to Admin role.
            </Alert>
          )}
          
          <Suspense fallback={<LoadingFallback />}>
            {activeView === "search" && <FlightSearch />}
            {activeView === "trips" && <PassengerPortal />}
            {activeView === "status" && <FlightStatusDashboard />}
            {activeView === "signin" && <Auth />}
            {activeView === "checkin" && <StaffCheckIn />}
            {activeView === "inflight" && <InFlight />}
            {activeView === "admin" && canAccessAdmin && <AdminDashboard />}
          </Suspense>
        </Box>
      </Box>
    </ErrorBoundary>
  );
}
