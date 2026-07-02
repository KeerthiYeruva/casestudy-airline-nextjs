"use client";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import type { Flight } from '../../types/flight';
import type { Passenger } from '../../types/passenger';

interface BoardingPassDialogProps {
  open: boolean;
  passenger: Passenger | null;
  flight: Flight | null;
  onClose: () => void;
}

const BOARDING_OFFSET_MINUTES = 45;

function getBoardingTime(flight: Flight): string {
  const departureTime = flight.departureTime || flight.time;
  const timeMatch = departureTime?.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

  if (!timeMatch) {
    return `45 min before ${departureTime || 'departure'}`;
  }

  const [, hourValue, minuteValue, meridiem] = timeMatch;
  const rawHour = Number(hourValue);
  const hour = meridiem.toUpperCase() === 'PM' && rawHour !== 12
    ? rawHour + 12
    : meridiem.toUpperCase() === 'AM' && rawHour === 12
      ? 0
      : rawHour;
  const departure = new Date(`${flight.date}T${String(hour).padStart(2, '0')}:${minuteValue}:00`);

  if (Number.isNaN(departure.getTime())) {
    return `45 min before ${departureTime}`;
  }

  departure.setMinutes(departure.getMinutes() - BOARDING_OFFSET_MINUTES);

  return departure.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function BoardingPassQrMark({ reference }: { reference: string }) {
  const cells = Array.from({ length: 64 }, (_, cellIndex) => {
    const charCode = reference.charCodeAt(cellIndex % reference.length) || cellIndex;
    return (charCode + cellIndex) % 3 !== 0;
  });

  return (
    <Box
      aria-label={`Boarding pass code ${reference}`}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: 0.35,
        width: 104,
        height: 104,
        p: 1,
        bgcolor: 'common.white',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      {cells.map((isFilled, cellIndex) => (
        <Box
          key={`${reference}-${cellIndex}`}
          sx={{
            bgcolor: isFilled ? 'text.primary' : 'transparent',
            borderRadius: 0.25,
          }}
        />
      ))}
    </Box>
  );
}

export default function BoardingPassDialog({ open, passenger, flight, onClose }: BoardingPassDialogProps) {
  if (!passenger || !flight) {
    return null;
  }

  const route = `${flight.origin || flight.from || 'N/A'} to ${flight.destination || flight.to || 'N/A'}`;
  const boardingTime = getBoardingTime(flight);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ConfirmationNumberIcon color="primary" />
        Boarding Pass
      </DialogTitle>
      <DialogContent dividers>
        <Paper
          elevation={0}
          sx={{
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            '@media print': {
              boxShadow: 'none',
              borderColor: 'text.primary',
            },
          }}
        >
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <FlightTakeoffIcon />
              <Box>
                <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 0 }}>
                  Airline Management
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {flight.flightNumber}
                </Typography>
              </Box>
            </Stack>
            <Chip label={flight.status} color="secondary" sx={{ fontWeight: 'bold' }} />
          </Box>

          <Grid container>
            <Grid size={{ xs: 12, md: 8 }} sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                PASSENGER
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                {passenger.name}
              </Typography>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Route</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{route}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{flight.date}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Departure</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{flight.departureTime || flight.time}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Boarding</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{boardingTime}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Gate</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{flight.gate || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">Terminal</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{flight.terminal || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: 'grey.50',
                borderLeft: { md: '1px dashed' },
                borderTop: { xs: '1px dashed', md: 0 },
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <BoardingPassQrMark reference={passenger.bookingReference} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Booking Reference</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                  {passenger.bookingReference}
                </Typography>
              </Box>
              <Divider flexItem />
              <Stack direction="row" spacing={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Seat</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{passenger.seat}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Zone</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {passenger.premiumUpgrade ? '1' : '3'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={<LocalPrintshopIcon />}
          onClick={() => window.print()}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}