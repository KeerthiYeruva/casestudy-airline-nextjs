"use client";

import React, { useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
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
  const { isAuthenticated, role } = useSelector((state: any) => state.auth);

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
          <Toolbar>
            <FlightTakeoffIcon sx={{ mr: 2 }} aria-hidden="true" />
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              Airline Management System
            </Typography>
            
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
              <Button
                color="inherit"
                startIcon={<AirlineSeatReclineExtraIcon />}
                onClick={() => setCurrentView("checkin")}
                variant={currentView === "checkin" ? "outlined" : "text"}
                aria-label="Navigate to Check-In"
                aria-current={currentView === "checkin" ? "page" : undefined}
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
