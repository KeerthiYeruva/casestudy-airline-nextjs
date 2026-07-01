'use client';

/**
 * Seat Preferences Dialog
 * Allows passengers to set their seat preferences
 */

import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Typography,
  Box,
  Chip,
  Stack,
  Alert,
  Divider
} from '@mui/material';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { SeatPreferences, SeatPreference, SeatType } from '@/types/seat';
import { SeatPreferencesDialogSchema, type SeatPreferencesDialogFormData } from '@/lib/validationSchemas';

interface SeatPreferencesDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (preferences: SeatPreferences) => void;
  currentPreferences?: SeatPreferences;
  passengerName: string;
}

const SeatPreferencesDialog: React.FC<SeatPreferencesDialogProps> = ({
  open,
  onClose,
  onSave,
  currentPreferences,
  passengerName
}) => {
  const { control, handleSubmit, reset, setValue } = useForm<SeatPreferencesDialogFormData>({
    resolver: zodResolver(SeatPreferencesDialogSchema),
    defaultValues: {
      position: currentPreferences?.position || [],
      type: currentPreferences?.type || 'standard',
      nearFamily: currentPreferences?.nearFamily || false,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        position: currentPreferences?.position || [],
        type: currentPreferences?.type || 'standard',
        nearFamily: currentPreferences?.nearFamily || false,
      });
    }
  }, [currentPreferences, open, reset]);

  const preferences = useWatch({ control });

  const positionOptions: { value: SeatPreference; label: string; icon: string }[] = [
    { value: 'window', label: 'Window', icon: '🪟' },
    { value: 'aisle', label: 'Aisle', icon: '🚶' },
    { value: 'middle', label: 'Middle', icon: '⬜' },
    { value: 'front', label: 'Front', icon: '⬆️' },
    { value: 'back', label: 'Back', icon: '⬇️' },
    { value: 'exitRow', label: 'Exit Row', icon: '🚪' }
  ];

  const handlePositionToggle = (position: SeatPreference) => {
    const currentPositions = preferences.position || [];
    const updatedPositions = currentPositions.includes(position)
      ? currentPositions.filter((selectedPosition) => selectedPosition !== position)
      : [...currentPositions, position];

    setValue('position', updatedPositions, { shouldDirty: true, shouldValidate: true });
  };

  const handleSave = (formData: SeatPreferencesDialogFormData) => {
    const preferences: SeatPreferences = formData;
    onSave(preferences);
    onClose();
  };

  const hasSelections = (preferences.position && preferences.position.length > 0) || preferences.nearFamily;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle sx={{ bgcolor: 'primary.50', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AirlineSeatReclineExtraIcon color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Seat Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {passengerName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Alert severity="info" icon={false}>
            <Typography variant="body2">
              Help us find your perfect seat! Select your preferences and we&apos;ll do our best to accommodate them.
            </Typography>
          </Alert>

          {/* Position Preferences */}
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold' }}>
              Position Preferences
              {preferences.position && preferences.position.length > 0 && (
                <Chip 
                  label={`${preferences.position.length} selected`}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select your preferred seat positions (multiple selections allowed)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {positionOptions.map(option => (
                <Chip
                  key={option.value}
                  label={`${option.icon} ${option.label}`}
                  onClick={() => handlePositionToggle(option.value)}
                  color={preferences.position?.includes(option.value) ? 'primary' : 'default'}
                  variant={preferences.position?.includes(option.value) ? 'filled' : 'outlined'}
                  icon={preferences.position?.includes(option.value) ? <CheckCircleIcon /> : undefined}
                  sx={{ 
                    fontSize: '0.9rem', 
                    padding: '20px 12px',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Seat Type */}
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Seat Type
            </Typography>
            <RadioGroup
              value={preferences.type}
              onChange={(e) => setValue('type', e.target.value as SeatType, { shouldDirty: true, shouldValidate: true })}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1, 
                    border: '2px solid',
                    borderColor: preferences.type === 'standard' ? 'primary.main' : 'divider',
                    bgcolor: preferences.type === 'standard' ? 'primary.50' : 'transparent',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setValue('type', 'standard', { shouldDirty: true, shouldValidate: true })}
                >
                  <FormControlLabel
                    value="standard"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: preferences.type === 'standard' ? 'bold' : 'normal' }}>
                          Standard
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Regular seating with standard amenities
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1, 
                    border: '2px solid',
                    borderColor: preferences.type === 'premium' ? 'warning.main' : 'divider',
                    bgcolor: preferences.type === 'premium' ? 'warning.50' : 'transparent',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setValue('type', 'premium', { shouldDirty: true, shouldValidate: true })}
                >
                  <FormControlLabel
                    value="premium"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: preferences.type === 'premium' ? 'bold' : 'normal' }}>
                          Premium 💎
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Extra legroom and enhanced comfort (additional charge may apply)
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1, 
                    border: '2px solid',
                    borderColor: preferences.type === 'exit' ? 'info.main' : 'divider',
                    bgcolor: preferences.type === 'exit' ? 'info.50' : 'transparent',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setValue('type', 'exit', { shouldDirty: true, shouldValidate: true })}
                >
                  <FormControlLabel
                    value="exit"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: preferences.type === 'exit' ? 'bold' : 'normal' }}>
                          Exit Row 🚪
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Extra legroom, must meet safety requirements
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1, 
                    border: '2px solid',
                    borderColor: preferences.type === 'bulkhead' ? 'secondary.main' : 'divider',
                    bgcolor: preferences.type === 'bulkhead' ? 'secondary.50' : 'transparent',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setValue('type', 'bulkhead', { shouldDirty: true, shouldValidate: true })}
                >
                  <FormControlLabel
                    value="bulkhead"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: preferences.type === 'bulkhead' ? 'bold' : 'normal' }}>
                          Bulkhead
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Front row with extra space
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Box>
            </RadioGroup>
          </Box>

          <Divider />

          {/* Near Family Option */}
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 1, 
              border: '2px solid',
              borderColor: preferences.nearFamily ? 'secondary.main' : 'divider',
              bgcolor: preferences.nearFamily ? 'secondary.50' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <Controller
              name="nearFamily"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(event) => field.onChange(event.target.checked)}
                        color="secondary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: preferences.nearFamily ? 'bold' : 'normal' }}>
                          Seat near family members
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Try to allocate seats close to other family members
                        </Typography>
                      </Box>
                    }
                  />
                </FormGroup>
              )}
            />
          </Box>

          {hasSelections && (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              <Typography variant="body2">
                Great! We&apos;ll do our best to find a seat that matches your preferences.
              </Typography>
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
        <Button onClick={onClose} size="large">Cancel</Button>
        <Button 
          onClick={handleSubmit(handleSave)} 
          variant="contained" 
          color="primary"
          size="large"
          startIcon={<AirlineSeatReclineExtraIcon />}
          disabled={!hasSelections}
        >
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SeatPreferencesDialog;
