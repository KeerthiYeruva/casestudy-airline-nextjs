"use client";

import { useState, lazy, Suspense } from "react";
import useAuthStore from "@/stores/useAuthStore";
import Auth from "@/components/Auth";
import ErrorBoundary from "@/components/ErrorBoundary";
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
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import SettingsIcon from "@mui/icons-material/Settings";
import LocaleSelector from "@/components/LocaleSelector";

const StaffCheckIn = lazy(() => import("@/components/StaffCheckIn"));
const InFlight = lazy(() => import("@/components/InFlight"));
const AdminDashboard = lazy(() => import("@/components/AdminDashboard"));

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
  const [currentView, setCurrentView] = useState("checkin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Auth />;
  }

  const canAccessAdmin = role === "admin";

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
              <Button
                color="inherit"
                startIcon={<AirlineSeatReclineExtraIcon />}
                onClick={() => setCurrentView("checkin")}
                variant={currentView === "checkin" ? "outlined" : "text"}
                aria-label="Navigate to Check-In"
                aria-current={currentView === "checkin" ? "page" : undefined}
                size="small"
                sx={{ fontSize: '0.875rem', px: 2 }}
              >
                Check-In
              </Button>
              <Button
                color="inherit"
                startIcon={<FlightTakeoffIcon />}
                onClick={() => setCurrentView("inflight")}
                variant={currentView === "inflight" ? "outlined" : "text"}
                aria-label="Navigate to In-Flight"
                aria-current={currentView === "inflight" ? "page" : undefined}
                size="small"
                sx={{ fontSize: '0.875rem', px: 2 }}
              >
                In-Flight
              </Button>
              {canAccessAdmin && (
                <Button
                  color="inherit"
                  startIcon={<SettingsIcon />}
                  onClick={() => setCurrentView("admin")}
                  variant={currentView === "admin" ? "outlined" : "text"}
                  aria-label="Navigate to Admin Dashboard"
                  aria-current={currentView === "admin" ? "page" : undefined}
                  size="small"
                  sx={{ fontSize: '0.875rem', px: 2 }}
                >
                  Admin
                </Button>
              )}
            </Box>
            
            {/* Locale Selector - Always visible */}
            <Box sx={{ display: 'flex', mr: 1 }}>
              <LocaleSelector />
            </Box>
            
            {/* Auth Component - Always Visible */}
            <Auth />
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
              <Typography variant="h6" color="primary" fontWeight="bold">
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
          
          {/* User Info Section in Drawer */}
          <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Logged in as
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ flex: 1 }}>
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
          <Divider />
          
          <List>
            <ListItem disablePadding>
              <ListItemButton 
                selected={currentView === "checkin"}
                onClick={() => {
                  setCurrentView("checkin");
                  setMobileMenuOpen(false);
                }}
              >
                <ListItemIcon>
                  <AirlineSeatReclineExtraIcon color={currentView === "checkin" ? "primary" : "inherit"} />
                </ListItemIcon>
                <ListItemText 
                  primary="Check-In" 
                  secondary="Passenger check-in and boarding"
                  primaryTypographyProps={{ fontWeight: currentView === "checkin" ? 'bold' : 'normal' }}
                />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                selected={currentView === "inflight"}
                onClick={() => {
                  setCurrentView("inflight");
                  setMobileMenuOpen(false);
                }}
              >
                <ListItemIcon>
                  <FlightTakeoffIcon color={currentView === "inflight" ? "primary" : "inherit"} />
                </ListItemIcon>
                <ListItemText 
                  primary="In-Flight Services" 
                  secondary="Meals, shop, and services"
                  primaryTypographyProps={{ fontWeight: currentView === "inflight" ? 'bold' : 'normal' }}
                />
              </ListItemButton>
            </ListItem>
            
            {canAccessAdmin && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={currentView === "admin"}
                    onClick={() => {
                      setCurrentView("admin");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <ListItemIcon>
                      <SettingsIcon color={currentView === "admin" ? "secondary" : "inherit"} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Admin Dashboard" 
                      secondary="Passenger and service management"
                      primaryTypographyProps={{ 
                        fontWeight: currentView === "admin" ? 'bold' : 'normal',
                        color: currentView === "admin" ? 'secondary.main' : 'inherit'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Drawer>

        <Box component="main" id="main-content" sx={{ mt: 3, mb: 3 }} role="main">
          {!canAccessAdmin && currentView === "admin" && (
            <Alert severity="error" sx={{ m: 2 }}>
              Access Denied: Admin privileges required. Please switch to Admin role.
            </Alert>
          )}
          
          <Suspense fallback={<LoadingFallback />}>
            {currentView === "checkin" && <StaffCheckIn />}
            {currentView === "inflight" && <InFlight />}
            {currentView === "admin" && canAccessAdmin && <AdminDashboard />}
          </Suspense>
        </Box>
      </Box>
    </ErrorBoundary>
  );
}
