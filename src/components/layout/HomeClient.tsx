"use client";

import { useState, lazy, Suspense, type ReactNode } from "react";
import useAuthStore from "@/stores/useAuthStore";
import { UserRole, normalizeUserRole, roleLabels, rolePermissions } from "@/types/auth";
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
  ListSubheader,
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
type AccessLevel = "public" | "customer" | "checkin" | "cabin" | "admin";

interface NavigationItem {
  view: Exclude<ViewKey, "signin">;
  label: string;
  mobileLabel: string;
  description: string;
  icon: ReactNode;
  access: AccessLevel;
}

interface NavigationSection {
  title: string;
  views: NavigationItem["view"][];
}

const staffDrawerWidth = 280;

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
    access: "customer",
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
    access: "checkin",
  },
  {
    view: "inflight",
    label: "In-Flight",
    mobileLabel: "In-Flight Services",
    description: "Meals, shop, and services",
    icon: <FlightTakeoffIcon />,
    access: "cabin",
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

const canAccessLevel = (access: AccessLevel, role: UserRole | null, isAuthenticated: boolean) => {
  if (access === "public") return true;
  if (access === "customer") {
    if (!isAuthenticated) return true;
    const currentRole = normalizeUserRole(role);
    if (!currentRole) return false;
    return rolePermissions[currentRole].canUseCustomerPortal;
  }
  if (!isAuthenticated) return false;
  const currentRole = normalizeUserRole(role);
  if (!currentRole) return false;

  const permissions = rolePermissions[currentRole];
  if (access === "checkin") return permissions.canUseCheckIn;
  if (access === "cabin") return permissions.canUseInFlightServices;
  return permissions.canAccessAdminDashboard;
};

const canAccessNavigationItem = (item: NavigationItem, role: UserRole | null, isAuthenticated: boolean) => {
  return canAccessLevel(item.access, role, isAuthenticated);
};

const publicNavigationViews: NavigationItem["view"][] = ["search", "status"];
const customerNavigationViews: NavigationItem["view"][] = ["search", "trips", "status"];
const checkInNavigationViews: NavigationItem["view"][] = ["checkin", "status"];
const cabinNavigationViews: NavigationItem["view"][] = ["inflight", "status"];
const operationsNavigationViews: NavigationItem["view"][] = ["checkin", "inflight", "status"];
const adminNavigationViews: NavigationItem["view"][] = ["admin", "checkin", "inflight", "status"];

const checkInNavigationSections: NavigationSection[] = [
  { title: "Operations", views: ["checkin", "status"] },
];

const cabinNavigationSections: NavigationSection[] = [
  { title: "Cabin", views: ["inflight", "status"] },
];

const operationsNavigationSections: NavigationSection[] = [
  { title: "Operations", views: ["checkin", "inflight", "status"] },
];

const adminNavigationSections: NavigationSection[] = [
  { title: "Dashboard", views: ["admin"] },
  { title: "Operations", views: ["checkin", "inflight", "status"] },
];

const getNavigationViewsForRole = (role: UserRole | null, isAuthenticated: boolean) => {
  if (!isAuthenticated) return publicNavigationViews;
  if (!role) return publicNavigationViews;

  switch (role) {
    case UserRole.PASSENGER:
      return customerNavigationViews;
    case UserRole.CHECKIN_AGENT:
      return checkInNavigationViews;
    case UserRole.CABIN_CREW:
      return cabinNavigationViews;
    case UserRole.OPERATIONS:
      return operationsNavigationViews;
    case UserRole.ADMIN:
    case UserRole.SUPER_ADMIN:
      return adminNavigationViews;
    default:
      return publicNavigationViews;
  }
};

const getNavigationItemsForContext = (role: UserRole | null, isAuthenticated: boolean) => {
  return getNavigationViewsForRole(role, isAuthenticated)
    .map((view) => navigationItems.find((item) => item.view === view))
    .filter((item): item is NavigationItem => !!item && canAccessNavigationItem(item, role, isAuthenticated));
};

const getNavigationSectionsForContext = (role: UserRole | null, isAuthenticated: boolean) => {
  if (!isAuthenticated || !role || role === UserRole.PASSENGER) return [];

  const sections = (() => {
    switch (role) {
      case UserRole.CHECKIN_AGENT:
        return checkInNavigationSections;
      case UserRole.CABIN_CREW:
        return cabinNavigationSections;
      case UserRole.OPERATIONS:
        return operationsNavigationSections;
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return adminNavigationSections;
      default:
        return [];
    }
  })();

  return sections
    .map((section) => ({
      ...section,
      items: section.views
        .map((view) => navigationItems.find((item) => item.view === view))
        .filter((item): item is NavigationItem => !!item && canAccessNavigationItem(item, role, isAuthenticated)),
    }))
    .filter((section) => section.items.length > 0);
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
  const currentRole = normalizeUserRole(role);

  const canAccessAdmin = isAuthenticated && !!currentRole && rolePermissions[currentRole].canAccessAdminDashboard;
  const accessibleNavigationItems = getNavigationItemsForContext(currentRole, isAuthenticated);
  const isStaffExperience = isAuthenticated && !!currentRole && currentRole !== UserRole.PASSENGER;
  const staffNavigationSections = getNavigationSectionsForContext(currentRole, isAuthenticated);
  const canAccessCurrentView = currentView === "signin"
    ? !isAuthenticated
    : accessibleNavigationItems.some((item) => item.view === currentView);
  const fallbackView = accessibleNavigationItems[0]?.view || "search";
  const activeView: ViewKey = canAccessCurrentView ? currentView : fallbackView;

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
                {isStaffExperience ? "Airline Operations" : "Airline Management"}
              </Typography>
            </Box>
            
            {/* Desktop Navigation - Hidden on Mobile */}
            {!isStaffExperience && (
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
            )}
            
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
                {currentRole && (
                  <Typography variant="caption" sx={{ flex: 1, fontWeight: 700 }}>
                    {roleLabels[currentRole]}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={currentRole === UserRole.CHECKIN_AGENT ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => useAuthStore.getState().setRole(UserRole.CHECKIN_AGENT)}
                  fullWidth
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Check-In
                </Button>
                <Button
                  variant={currentRole === UserRole.CABIN_CREW ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => useAuthStore.getState().setRole(UserRole.CABIN_CREW)}
                  fullWidth
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Cabin
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  variant={currentRole === UserRole.OPERATIONS ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => useAuthStore.getState().setRole(UserRole.OPERATIONS)}
                  fullWidth
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Ops
                </Button>
                <Button
                  variant={currentRole === UserRole.ADMIN ? 'contained' : 'outlined'}
                  size="small"
                  color="secondary"
                  onClick={() => useAuthStore.getState().setRole(UserRole.ADMIN)}
                  fullWidth
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Admin
                </Button>
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
                    aria-label={`Navigate to ${item.mobileLabel}`}
                    aria-current={activeView === item.view ? "page" : undefined}
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

        <Box sx={{ display: 'flex', minHeight: isStaffExperience ? { md: 'calc(100vh - 64px)' } : undefined }}>
          {isStaffExperience && (
            <Box component="nav" aria-label="Operations navigation" sx={{ display: { xs: 'none', md: 'block' } }}>
              <Drawer
                variant="permanent"
                sx={{
                  width: staffDrawerWidth,
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    width: staffDrawerWidth,
                    boxSizing: 'border-box',
                    position: 'relative',
                    height: '100%',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                  },
                }}
              >
                <Box sx={{ px: 2.5, py: 2 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0 }}>
                    Airline Operations
                  </Typography>
                  {currentRole && (
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                      {roleLabels[currentRole]}
                    </Typography>
                  )}
                </Box>
                <Divider />
                {staffNavigationSections.map((section) => (
                  <List
                    key={section.title}
                    subheader={
                      <ListSubheader component="div" sx={{ bgcolor: 'background.paper', fontWeight: 700 }}>
                        {section.title}
                      </ListSubheader>
                    }
                  >
                    {section.items.map((item) => (
                      <ListItem key={item.view} disablePadding sx={{ px: 1 }}>
                        <ListItemButton
                          selected={activeView === item.view}
                          aria-label={`Navigate to ${item.mobileLabel}`}
                          aria-current={activeView === item.view ? "page" : undefined}
                          onClick={() => setCurrentView(item.view)}
                          sx={{ borderRadius: 1 }}
                        >
                          <ListItemIcon>
                            <Box sx={{ color: activeView === item.view ? 'primary.main' : 'inherit', display: 'flex' }}>
                              {item.icon}
                            </Box>
                          </ListItemIcon>
                          <ListItemText primary={item.mobileLabel} secondary={item.description} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ))}
              </Drawer>
            </Box>
          )}

          <Box
            component="main"
            id="main-content"
            sx={{
              flexGrow: 1,
              minWidth: 0,
              mt: isStaffExperience ? { xs: 3, md: 0 } : 3,
              mb: 3,
              p: isStaffExperience ? { xs: 0, md: 3 } : 0,
              bgcolor: isStaffExperience ? { md: 'grey.50' } : 'transparent',
            }}
            role="main"
          >
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
      </Box>
    </ErrorBoundary>
  );
}
