"use client";

import React from "react";
import { Alert, Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import type { Passenger } from "../../../domain/passengers/types";
import { getSeatRecommendations, type SeatRecommendation } from "../utils/seatRecommendations";

interface SeatingRecommendationsPanelProps {
  passengers: Passenger[];
  onReviewFamily?: () => void;
  onReviewGroup?: () => void;
  onApplyRecommendation?: (recommendation: SeatRecommendation) => void;
  onSelectPassenger?: (passenger: Passenger) => void;
}

const categoryIcon: Record<SeatRecommendation["category"], React.ReactNode> = {
  family: <FamilyRestroomIcon fontSize="small" />,
  group: <GroupIcon fontSize="small" />,
  assistance: <AccessibleIcon fontSize="small" />,
  premium: <StarIcon fontSize="small" />,
};

const severityColor: Record<SeatRecommendation["severity"], "error" | "warning" | "info"> = {
  high: "error",
  medium: "warning",
  low: "info",
};

const getAction = (
  recommendation: SeatRecommendation,
  passengers: Passenger[],
  onReviewFamily?: () => void,
  onReviewGroup?: () => void,
  onApplyRecommendation?: (recommendation: SeatRecommendation) => void,
  onSelectPassenger?: (passenger: Passenger) => void
) => {
  if (recommendation.category === "family") return onReviewFamily;
  if (recommendation.category === "group") return onReviewGroup;

  if (onApplyRecommendation) return () => onApplyRecommendation(recommendation);

  const passenger = passengers.find((item) => item.id === recommendation.passengerIds[0]);
  if (!passenger || !onSelectPassenger) return undefined;

  return () => onSelectPassenger(passenger);
};

const SeatingRecommendationsPanel: React.FC<SeatingRecommendationsPanelProps> = ({
  passengers,
  onReviewFamily,
  onReviewGroup,
  onApplyRecommendation,
  onSelectPassenger,
}) => {
  const recommendations = getSeatRecommendations(passengers).slice(0, 5);

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoFixHighIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1">Seating Intelligence</Typography>
          </Box>
          <Chip label={`${recommendations.length} open`} size="small" color={recommendations.length ? "warning" : "success"} />
        </Box>

        {recommendations.length === 0 ? (
          <Alert severity="success" variant="outlined">
            No family, group, assistance, or premium seating exceptions detected.
          </Alert>
        ) : (
          recommendations.map((recommendation, recommendationIndex) => {
            const action = getAction(recommendation, passengers, onReviewFamily, onReviewGroup, onApplyRecommendation, onSelectPassenger);

            return (
              <Box
                key={`${recommendation.id}-${recommendationIndex}`}
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  bgcolor: "background.paper",
                }}
              >
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                      {categoryIcon[recommendation.category]}
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {recommendation.title}
                      </Typography>
                    </Box>
                    <Chip label={recommendation.severity} size="small" color={severityColor[recommendation.severity]} variant="outlined" />
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {recommendation.description}
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {recommendation.currentSeats.length > 0 && (
                      <Chip label={`Current ${recommendation.currentSeats.join(", ")}`} size="small" variant="outlined" />
                    )}
                    {recommendation.suggestedSeats.length > 0 && (
                      <Chip label={`Suggest ${recommendation.suggestedSeats.join(", ")}`} size="small" color="primary" />
                    )}
                  </Box>

                  {action && (
                    <Button size="small" variant="outlined" onClick={action} sx={{ alignSelf: "flex-start" }}>
                      {recommendation.actionLabel}
                    </Button>
                  )}
                </Stack>
              </Box>
            );
          })
        )}
      </Stack>
    </Paper>
  );
};

export default SeatingRecommendationsPanel;
