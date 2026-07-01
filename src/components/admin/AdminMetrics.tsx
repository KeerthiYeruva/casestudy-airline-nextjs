import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PaidIcon from '@mui/icons-material/Paid';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StarIcon from '@mui/icons-material/Star';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { Flight } from '@/types/flight';
import type { Passenger } from '@/types/passenger';

interface AdminMetricsProps {
  flights: Flight[];
  passengers: Passenger[];
}

interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  tone: 'primary' | 'success' | 'info' | 'warning' | 'secondary';
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return '0%';
  return `${Math.round(value)}%`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function MetricCard({ label, value, helper, icon, tone }: MetricCardProps) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        gap: 1.5,
        alignItems: 'flex-start',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          bgcolor: `${tone}.50`,
          color: `${tone}.main`,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {helper}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function AdminMetrics({ flights, passengers }: AdminMetricsProps) {
  const totalPassengers = passengers.length;
  const checkedInPassengers = passengers.filter((passenger) => passenger.checkedIn).length;
  const totalSeats = flights.reduce((total, flight) => total + flight.totalSeats, 0);
  const occupancyRate = totalSeats > 0 ? (totalPassengers / totalSeats) * 100 : 0;
  const premiumPassengers = passengers.filter((passenger) => passenger.premiumUpgrade).length;
  const premiumConversion = totalPassengers > 0 ? (premiumPassengers / totalPassengers) * 100 : 0;
  const ancillaryRevenue = passengers.reduce((total, passenger) => {
    const passengerTotal = passenger.shopRequests.reduce((subtotal, request) => {
      return subtotal + request.price * request.quantity;
    }, 0);

    return total + passengerTotal;
  }, 0);

  const metrics = [
    {
      label: 'Passengers',
      value: totalPassengers.toLocaleString(),
      helper: `${flights.length} flights tracked`,
      icon: <PeopleAltIcon fontSize="small" />,
      tone: 'primary' as const,
    },
    {
      label: 'Check-In Rate',
      value: formatPercent(totalPassengers > 0 ? (checkedInPassengers / totalPassengers) * 100 : 0),
      helper: `${checkedInPassengers}/${totalPassengers} completed`,
      icon: <CheckCircleIcon fontSize="small" />,
      tone: 'success' as const,
    },
    {
      label: 'Occupancy',
      value: formatPercent(occupancyRate),
      helper: `${totalPassengers}/${totalSeats || 0} seats assigned`,
      icon: <EventSeatIcon fontSize="small" />,
      tone: 'info' as const,
    },
    {
      label: 'Ancillary Revenue',
      value: formatCurrency(ancillaryRevenue),
      helper: 'In-flight shop requests',
      icon: <PaidIcon fontSize="small" />,
      tone: 'warning' as const,
    },
    {
      label: 'Premium Conversion',
      value: formatPercent(premiumConversion),
      helper: `${premiumPassengers} upgrades`,
      icon: <StarIcon fontSize="small" />,
      tone: 'secondary' as const,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {metrics.map((metric) => (
        <Grid key={metric.label} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <MetricCard {...metric} />
        </Grid>
      ))}
    </Grid>
  );
}