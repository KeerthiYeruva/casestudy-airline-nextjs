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
  Alert
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import SettingsIcon from "@mui/icons-material/Settings";

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

export default function Home() {
  const [currentView, setCurrentView] = useState("checkin");
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
          <Toolbar sx={{ flexWrap: 'wrap', gap: 1, py: { xs: 1, sm: 1.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: { xs: 1, sm: 0 } }}>
              <FlightTakeoffIcon sx={{ display: { xs: 'block', sm: 'block' } }} aria-hidden="true" />
              <Typography 
                variant="h6" 
                component="h1" 
                sx={{ 
                  flexGrow: { xs: 1, md: 1 },
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  mr: { xs: 0, md: 2 }
                }}
              >
                Airline Management
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: "flex", 
              gap: { xs: 0.5, sm: 1 }, 
              alignItems: "center", 
              flexWrap: "wrap",
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Button
                color="inherit"
                startIcon={<AirlineSeatReclineExtraIcon sx={{ display: { xs: 'none', sm: 'block' } }} />}
                onClick={() => setCurrentView("checkin")}
                variant={currentView === "checkin" ? "outlined" : "text"}
                aria-label="Navigate to Check-In"
                aria-current={currentView === "checkin" ? "page" : undefined}
                size="small"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, px: { xs: 1, sm: 2 } }}
              >
                Check-In
              </Button>
              <Button
                color="inherit"
                startIcon={<FlightTakeoffIcon sx={{ display: { xs: 'none', sm: 'block' } }} />}
                onClick={() => setCurrentView("inflight")}
                variant={currentView === "inflight" ? "outlined" : "text"}
                aria-label="Navigate to In-Flight"
                aria-current={currentView === "inflight" ? "page" : undefined}
                size="small"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, px: { xs: 1, sm: 2 } }}
              >
                In-Flight
              </Button>
              {canAccessAdmin && (
                <Button
                  color="inherit"
                  startIcon={<SettingsIcon sx={{ display: { xs: 'none', sm: 'block' } }} />}
                  onClick={() => setCurrentView("admin")}
                  variant={currentView === "admin" ? "outlined" : "text"}
                  aria-label="Navigate to Admin Dashboard"
                  aria-current={currentView === "admin" ? "page" : undefined}
                  size="small"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, px: { xs: 1, sm: 2 } }}
                >
                  Admin
                </Button>
              )}
              <Auth />
            </Box>
          </Toolbar>
        </AppBar>

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
