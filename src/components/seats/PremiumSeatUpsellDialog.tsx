'use client';

/**
 * Premium Seat Upsell Dialog
 * Offers passengers premium seat upgrades with enhanced features
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import {
  AirlineSeatReclineExtra as SeatIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  FlightTakeoff as PriorityIcon,
  Power as PowerIcon,
  Weekend as ComfortIcon
} from '@mui/icons-material';
import type { PremiumSeatUpsell, Passenger } from '@/types';
import { formatCurrency } from '@/lib/i18nUtils';

interface PremiumSeatUpsellDialogProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: (seatNumber: string) => void;
  passenger: Passenger;
  availableUpgrades: PremiumSeatUpsell[];
  currency?: string;
  locale?: string;
}

const PremiumSeatUpsellDialog: React.FC<PremiumSeatUpsellDialogProps> = ({
  open,
  onClose,
  onUpgrade,
  passenger,
  availableUpgrades,
  currency = 'USD',
  locale = 'en'
}) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const featureIcons: Record<string, React.ReactElement> = {
    'Extra Legroom': <ComfortIcon />,
    'Priority Boarding': <PriorityIcon />,
    'Enhanced Recline': <SeatIcon />,
    'Power Outlets': <PowerIcon />
  };

  const handleUpgrade = () => {
    if (selectedSeat) {
      onUpgrade(selectedSeat);
      onClose();
    }
  };

  const selectedUpgrade = availableUpgrades.find(u => u.seatNumber === selectedSeat);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <StarIcon color="warning" />
          <Typography variant="h6">Upgrade to Premium Seating</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <Alert severity="info">
            Upgrade {passenger.name}&apos;s seat from <strong>{passenger.seat}</strong> to a premium 
            seat for enhanced comfort and exclusive benefits.
          </Alert>

          {availableUpgrades.length === 0 ? (
            <Alert severity="warning">
              No premium seats are currently available on this flight.
            </Alert>
          ) : (
            <>
              <Typography variant="subtitle1" fontWeight="bold">
                Available Premium Seats
              </Typography>

              <Grid container spacing={2}>
                {availableUpgrades.map(upgrade => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={upgrade.seatNumber}>
                    <Card
                      sx={{
                        cursor: upgrade.available ? 'pointer' : 'not-allowed',
                        border: selectedSeat === upgrade.seatNumber ? 2 : 1,
                        borderColor: selectedSeat === upgrade.seatNumber 
                          ? 'primary.main' 
                          : 'divider',
                        opacity: upgrade.available ? 1 : 0.5,
                        transition: 'all 0.2s',
                        '&:hover': upgrade.available ? {
                          transform: 'translateY(-4px)',
                          boxShadow: 3
                        } : {}
                      }}
                      onClick={() => upgrade.available && setSelectedSeat(upgrade.seatNumber)}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="h6" fontWeight="bold">
                            Seat {upgrade.seatNumber}
                          </Typography>
                          {selectedSeat === upgrade.seatNumber && (
                            <CheckIcon color="primary" />
                          )}
                        </Box>

                        <Chip
                          icon={<StarIcon />}
                          label="Premium"
                          color="warning"
                          size="small"
                          sx={{ mb: 2 }}
                        />

                        <Typography variant="h5" color="primary" fontWeight="bold" mb={1}>
                          {formatCurrency(upgrade.upgradePrice, currency as 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR', locale as 'en' | 'es' | 'fr' | 'de' | 'ja')}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                          Base: {formatCurrency(upgrade.basePrice, currency as 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR', locale as 'en' | 'es' | 'fr' | 'de' | 'ja')}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ mt: 2 }}>
                          {upgrade.features.slice(0, 3).map((feature, idx) => (
                            <Box key={idx} display="flex" alignItems="center" gap={1} mb={0.5}>
                              <CheckIcon fontSize="small" color="success" />
                              <Typography variant="caption">{feature}</Typography>
                            </Box>
                          ))}
                        </Box>

                        {!upgrade.available && (
                          <Chip
                            label="Unavailable"
                            size="small"
                            color="error"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {selectedUpgrade && (
                <Card sx={{ bgcolor: 'primary.50', border: 1, borderColor: 'primary.main' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Premium Features for Seat {selectedUpgrade.seatNumber}
                    </Typography>
                    <List dense>
                      {selectedUpgrade.features.map((feature, idx) => (
                        <ListItem key={idx} disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {featureIcons[feature] || <CheckIcon color="success" />}
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Premium Benefits Include:</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div">
              • Up to 5 extra inches of legroom<br />
              • Priority boarding and deplaning<br />
              • Power outlets and USB ports<br />
              • Enhanced seat recline<br />
              • Premium in-flight service
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Maybe Later</Button>
        <Button
          onClick={handleUpgrade}
          variant="contained"
          color="primary"
          disabled={!selectedSeat}
          startIcon={<StarIcon />}
        >
          {selectedUpgrade 
            ? `Upgrade for ${formatCurrency(selectedUpgrade.upgradePrice, currency as 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR', locale as 'en' | 'es' | 'fr' | 'de' | 'ja')}`
            : 'Select a Seat'
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PremiumSeatUpsellDialog;
