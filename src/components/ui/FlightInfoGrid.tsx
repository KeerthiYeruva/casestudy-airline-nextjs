import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Flight } from '@/types/flight';
import StatusChip from '@/components/ui/StatusChip';

interface FlightInfoGridProps {
  flight: Flight;
  sx?: SxProps<Theme>;
}

export default function FlightInfoGrid({ flight, sx }: FlightInfoGridProps) {
  const origin = flight.origin || flight.from || 'N/A';
  const destination = flight.destination || flight.to || 'N/A';
  const route = `${origin} → ${destination}`;
  const time = flight.time || flight.departureTime;

  return (
    <Paper
      elevation={3}
      className="flight-details"
      sx={{ mb: 2, p: { xs: 1.5, sm: 2, md: 2.5 }, ...sx }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, mb: { xs: 1, sm: 1.5 } }}
      >
        {flight.name || flight.flightNumber}
      </Typography>
      <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Time
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 'medium' }}>
            {time}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Route
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 'medium' }}>
            {route}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Gate
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 'medium' }}>
            {flight.gate || 'N/A'}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Status
          </Typography>
          <StatusChip status={flight.status} />
        </Grid>
      </Grid>
    </Paper>
  );
}