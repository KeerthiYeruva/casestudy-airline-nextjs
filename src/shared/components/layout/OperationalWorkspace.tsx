"use client";

import React, { type ReactNode } from "react";
import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import PageHeader from "../ui/PageHeader";
import StatusChip from "../ui/StatusChip";
import type { Flight } from "../../../domain/flights/types";

interface OperationalWorkspaceProps {
  title: string;
  isConnected?: boolean;
  selectedFlight?: Flight | null;
  leftRail: ReactNode;
  children: ReactNode;
  rightRail?: ReactNode;
  emptyState?: ReactNode;
  className?: string;
  leftRailWidth?: { md: number; lg: number; xl?: number };
  rightRailWidth?: { lg: number; xl?: number };
}

const getRoute = (flight: Flight) => {
  const origin = flight.origin || flight.from || "N/A";
  const destination = flight.destination || flight.to || "N/A";
  return `${origin} -> ${destination}`;
};

const getTime = (flight: Flight) => flight.time || flight.departureTime || "TBD";

export default function OperationalWorkspace({
  title,
  isConnected = false,
  selectedFlight,
  leftRail,
  children,
  rightRail,
  emptyState,
  className,
  leftRailWidth = { md: 3, lg: 2.6, xl: 2.4 },
  rightRailWidth = { lg: 4, xl: 3.6 },
}: OperationalWorkspaceProps) {
  const contentWidth = {
    xs: 12,
    sm: 12,
    md: 12 - leftRailWidth.md,
    lg: 12 - leftRailWidth.lg,
    xl: 12 - (leftRailWidth.xl ?? leftRailWidth.lg),
  };
  const mainTaskWidth = {
    xs: 12,
    sm: 12,
    md: 12,
    lg: rightRail ? 12 - rightRailWidth.lg : 12,
    xl: rightRail ? 12 - (rightRailWidth.xl ?? rightRailWidth.lg) : 12,
  };
  const contextRailWidth = {
    xs: 12,
    sm: 12,
    md: 12,
    lg: rightRailWidth.lg,
    xl: rightRailWidth.xl ?? rightRailWidth.lg,
  };

  return (
    <Container
      className={className}
      maxWidth={false}
      sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 2, md: 3 }, minWidth: 0 }}
    >
      <PageHeader title={title} isConnected={isConnected} selectedFlightNumber={selectedFlight?.flightNumber} />

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 0, alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, sm: 12, md: leftRailWidth.md, lg: leftRailWidth.lg, xl: leftRailWidth.xl ?? leftRailWidth.lg }} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              position: { xs: "static", md: "sticky" },
              top: { md: 16 },
              maxHeight: { md: "calc(100vh - 32px)" },
              overflow: { md: "auto" },
              pr: { md: 0.5 },
            }}
          >
            {leftRail}
          </Box>
        </Grid>

        <Grid size={contentWidth} sx={{ minWidth: 0 }}>
          {selectedFlight ? (
            <Stack spacing={2}>
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 1.25, sm: 1.5 },
                  position: { md: "sticky" },
                  top: { md: 16 },
                  zIndex: 2,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                }}
              >
                <Grid container spacing={1.5} sx={{ alignItems: "center" }}>
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Typography variant="caption" color="text.secondary">Flight</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                      {selectedFlight.flightNumber || selectedFlight.name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Typography variant="caption" color="text.secondary">Route</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 650 }}>{getRoute(selectedFlight)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3, lg: 2 }}>
                    <Typography variant="caption" color="text.secondary">Departure</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 650 }}>{getTime(selectedFlight)}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3, lg: 2 }}>
                    <Typography variant="caption" color="text.secondary">Gate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 650 }}>{selectedFlight.gate || "TBD"}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, lg: 2 }} sx={{ display: "flex", justifyContent: { xs: "flex-start", lg: "flex-end" } }}>
                    <StatusChip status={selectedFlight.status} />
                  </Grid>
                </Grid>
              </Paper>

              <Grid container spacing={2} sx={{ minWidth: 0, alignItems: "flex-start" }}>
                <Grid size={mainTaskWidth} sx={{ minWidth: 0 }}>
                  {children}
                </Grid>
                {rightRail && (
                  <Grid size={contextRailWidth} sx={{ minWidth: 0 }}>
                    <Box
                      sx={{
                        position: { xs: "static", lg: "sticky" },
                        top: { lg: 104 },
                        maxHeight: { lg: "calc(100vh - 120px)" },
                        overflow: { lg: "auto" },
                        pr: { lg: 0.5 },
                      }}
                    >
                      {rightRail}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Stack>
          ) : (
            emptyState ?? (
              <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary">Select a flight to continue</Typography>
              </Paper>
            )
          )}
        </Grid>
      </Grid>
    </Container>
  );
}