'use client';

/**
 * Seat Preferences Dialog
 * Allows passengers to set their seat preferences
 */

import React, { useState } from 'react';
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
import type { SeatPreferences, SeatPreference, SeatType } from '@/types';

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
  const [preferences, setPreferences] = useState<SeatPreferences>(
    currentPreferences || {
      position: [],
      type: 'standard',
      nearFamily: false
    }
  );

  const positionOptions: { value: SeatPreference; label: string; icon: string }[] = [
    { value: 'window', label: 'Window', icon: '🪟' },
    { value: 'aisle', label: 'Aisle', icon: '🚶' },
    { value: 'middle', label: 'Middle', icon: '⬜' },
    { value: 'front', label: 'Front', icon: '⬆️' },
    { value: 'back', label: 'Back', icon: '⬇️' },
    { value: 'exitRow', label: 'Exit Row', icon: '🚪' }
  ];

  const handlePositionToggle = (position: SeatPreference) => {
    setPreferences(prev => ({
      ...prev,
      position: prev.position?.includes(position)
        ? prev.position.filter(p => p !== position)
        : [...(prev.position || []), position]
    }));
  };

  const handleTypeChange = (type: SeatType) => {
    setPreferences(prev => ({ ...prev, type }));
  };

  const handleNearFamilyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({ ...prev, nearFamily: event.target.checked }));
  };

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  const hasSelections = (preferences.position && preferences.position.length > 0) || preferences.nearFamily;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ bgcolor: 'primary.50', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AirlineSeatReclineExtraIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight="bold">
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
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Seat Type
            </Typography>
            <RadioGroup
              value={preferences.type}
              onChange={(e) => handleTypeChange(e.target.value as SeatType)}
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
                  onClick={() => handleTypeChange('standard')}
                >
                  <FormControlLabel
                    value="standard"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={preferences.type === 'standard' ? 'bold' : 'normal'}>
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
                  onClick={() => handleTypeChange('premium')}
                >
                  <FormControlLabel
                    value="premium"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={preferences.type === 'premium' ? 'bold' : 'normal'}>
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
                  onClick={() => handleTypeChange('exit')}
                >
                  <FormControlLabel
                    value="exit"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={preferences.type === 'exit' ? 'bold' : 'normal'}>
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
                  onClick={() => handleTypeChange('bulkhead')}
                >
                  <FormControlLabel
                    value="bulkhead"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={preferences.type === 'bulkhead' ? 'bold' : 'normal'}>
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
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.nearFamily}
                    onChange={handleNearFamilyChange}
                    color="secondary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={preferences.nearFamily ? 'bold' : 'normal'}>
                      Seat near family members
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Try to allocate seats close to other family members
                    </Typography>
                  </Box>
                }
              />
            </FormGroup>
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
          onClick={handleSave} 
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
