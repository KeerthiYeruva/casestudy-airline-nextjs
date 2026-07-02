"use client";

import React from "react";
import { Alert, Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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

const getActionLabel = (
  recommendation: SeatRecommendation,
  hasApplyRecommendation: boolean,
  hasSelectPassenger: boolean
) => {
  if (recommendation.category === "family" || recommendation.category === "group" || hasApplyRecommendation) {
    return recommendation.actionLabel;
  }

  return hasSelectPassenger ? "View passenger details" : recommendation.actionLabel;
};

const getInsightTone = (count: number) => count > 0 ? "warning" : "success";

const SeatingRecommendationsPanel: React.FC<SeatingRecommendationsPanelProps> = ({
  passengers,
  onReviewFamily,
  onReviewGroup,
  onApplyRecommendation,
  onSelectPassenger,
}) => {
  const recommendations = getSeatRecommendations(passengers).slice(0, 5);
  const allRecommendations = getSeatRecommendations(passengers);
  const familyExceptions = allRecommendations.filter((recommendation) => recommendation.category === "family");
  const groupExceptions = allRecommendations.filter((recommendation) => recommendation.category === "group");
  const assistanceExceptions = allRecommendations.filter((recommendation) => recommendation.category === "assistance");
  const premiumOpportunities = allRecommendations.filter((recommendation) => recommendation.category === "premium");
  const infantExceptions = familyExceptions.filter((recommendation) => recommendation.title.toLowerCase().includes("infant"));
  const hasInfants = passengers.some((passenger) => passenger.infant);
  const insightItems = [
    {
      icon: <FamilyRestroomIcon fontSize="small" />,
      label: familyExceptions.length > 0 ? `${familyExceptions.length} family seating issue${familyExceptions.length === 1 ? "" : "s"}` : "Families seated together",
      color: getInsightTone(familyExceptions.length),
    },
    {
      icon: <AccessibleIcon fontSize="small" />,
      label: assistanceExceptions.length > 0 ? `${assistanceExceptions.length} wheelchair seating issue${assistanceExceptions.length === 1 ? "" : "s"}` : "Wheelchair seating optimized",
      color: getInsightTone(assistanceExceptions.length),
    },
    {
      icon: <CheckCircleIcon fontSize="small" />,
      label: infantExceptions.length > 0 ? `${infantExceptions.length} infant seating issue${infantExceptions.length === 1 ? "" : "s"}` : hasInfants ? "All infants seated with adults" : "No infant seating issues",
      color: getInsightTone(infantExceptions.length),
    },
    {
      icon: <StarIcon fontSize="small" />,
      label: premiumOpportunities.length > 0 ? `${premiumOpportunities.length} premium upgrade opportunit${premiumOpportunities.length === 1 ? "y" : "ies"}` : "Premium preferences satisfied",
      color: premiumOpportunities.length > 0 ? "info" : "success",
    },
    {
      icon: <GroupIcon fontSize="small" />,
      label: groupExceptions.length > 0 ? `${groupExceptions.length} group seating issue${groupExceptions.length === 1 ? "" : "s"}` : "Groups clustered",
      color: getInsightTone(groupExceptions.length),
    },
  ] as const;

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

        <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", rowGap: 0.75 }}>
          {insightItems.map((item) => (
            <Chip
              key={item.label}
              icon={item.icon}
              label={item.label}
              size="small"
              color={item.color}
              variant="outlined"
            />
          ))}
        </Stack>

        {recommendations.length === 0 ? (
          <Alert severity="success" variant="outlined">
            No family, group, assistance, or premium seating exceptions detected.
          </Alert>
        ) : (
          recommendations.map((recommendation, recommendationIndex) => {
            const action = getAction(recommendation, passengers, onReviewFamily, onReviewGroup, onApplyRecommendation, onSelectPassenger);
            const actionLabel = getActionLabel(recommendation, !!onApplyRecommendation, !!onSelectPassenger);

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

                  <Stack spacing={0.75}>
                    {recommendation.currentSeats.length > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">Current seat</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.25 }}>
                          {recommendation.currentSeats.map((seat) => (
                            <Chip key={seat} label={seat} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                    {recommendation.suggestedSeats.length > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">Recommended seats</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.25 }}>
                          {recommendation.suggestedSeats.map((seat) => (
                            <Chip key={seat} label={seat} size="small" color="primary" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Stack>

                  {action && (
                    <Button size="small" variant="outlined" onClick={action} sx={{ alignSelf: "flex-start" }}>
                      {actionLabel}
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
