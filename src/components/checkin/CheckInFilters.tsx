"use client";

import React from "react";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  SelectChangeEvent,
  Grid,
  Box,
  Chip,
} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ChildCareIcon from '@mui/icons-material/ChildCare';

interface CheckInFiltersProps {
  checkedInFilter: boolean | null;
  wheelchairFilter: boolean;
  infantFilter: boolean;
  onFilterChange: (filterType: string, value: boolean | null) => void;
  onClearFilters: () => void;
}

const CheckInFilters: React.FC<CheckInFiltersProps> = ({
  checkedInFilter,
  wheelchairFilter,
  infantFilter,
  onFilterChange,
  onClearFilters,
}) => {
  const activeFilters = [
    checkedInFilter !== null,
    wheelchairFilter,
    infantFilter
  ].filter(Boolean).length;

  return (
    <Paper elevation={2} sx={{ mb: 2, p: 2, bgcolor: 'grey.50' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="action" />
          <Typography variant="h6" fontWeight="medium">
            Filters
          </Typography>
          {activeFilters > 0 && (
            <Chip label={`${activeFilters} active`} size="small" color="primary" />
          )}
        </Box>
        <Button
          variant="text"
          size="small"
          onClick={onClearFilters}
          disabled={activeFilters === 0}
        >
          Clear All
        </Button>
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 5 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Check-In Status</InputLabel>
            <Select
              value={
                checkedInFilter === null
                  ? "all"
                  : checkedInFilter
                  ? "checked"
                  : "not-checked"
              }
              label="Check-In Status"
              onChange={(e: SelectChangeEvent) => {
                const value =
                  e.target.value === "all"
                    ? null
                    : e.target.value === "checked";
                onFilterChange("checkedIn", value);
              }}
            >
              <MenuItem value="all">All Passengers</MenuItem>
              <MenuItem value="checked">✓ Checked In</MenuItem>
              <MenuItem value="not-checked">○ Not Checked In</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 7 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mr: 1, display: { xs: 'none', sm: 'block' } }}>
              Special Needs:
            </Typography>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={wheelchairFilter}
                    onChange={(e) =>
                      onFilterChange("wheelchair", e.target.checked)
                    }
                    icon={<AccessibleIcon />}
                    checkedIcon={<AccessibleIcon />}
                  />
                }
                label="Wheelchair"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={infantFilter}
                    onChange={(e) => onFilterChange("infant", e.target.checked)}
                    icon={<ChildCareIcon />}
                    checkedIcon={<ChildCareIcon />}
                  />
                }
                label="Infant"
              />
            </FormGroup>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CheckInFilters;
