import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PaidIcon from '@mui/icons-material/Paid';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StarIcon from '@mui/icons-material/Star';
import TodayIcon from '@mui/icons-material/Today';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { Flight } from '@/types/flight';
import type { Passenger } from '@/types/passenger';

const PREMIUM_SEAT_REVENUE = 49;

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

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function getTopAncillaryService(passengers: Passenger[]) {
  const serviceCounts = passengers.reduce<Record<string, number>>((counts, passenger) => {
    passenger.ancillaryServices.forEach((service) => {
      counts[service] = (counts[service] || 0) + 1;
    });

    return counts;
  }, {});

  const [topService, topCount] = Object.entries(serviceCounts).sort((firstService, secondService) => {
    return secondService[1] - firstService[1] || firstService[0].localeCompare(secondService[0]);
  })[0] || ['None', 0];

  return { topService, topCount };
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
  const today = getTodayIsoDate();
  const todaysFlightIds = new Set(flights.filter((flight) => flight.date === today).map((flight) => flight.id));
  const flightsToday = todaysFlightIds.size;
  const passengersToday = passengers.filter((passenger) => todaysFlightIds.has(passenger.flightId)).length;
  const totalPassengers = passengers.length;
  const checkedInPassengers = passengers.filter((passenger) => passenger.checkedIn).length;
  const totalSeats = flights.reduce((total, flight) => total + flight.totalSeats, 0);
  const occupancyRate = totalSeats > 0 ? (totalPassengers / totalSeats) * 100 : 0;
  const premiumPassengers = passengers.filter((passenger) => passenger.premiumUpgrade).length;
  const premiumSeatRevenue = premiumPassengers * PREMIUM_SEAT_REVENUE;
  const { topService, topCount } = getTopAncillaryService(passengers);
  const ancillaryRevenue = passengers.reduce((total, passenger) => {
    const passengerTotal = passenger.shopRequests.reduce((subtotal, request) => {
      return subtotal + request.price * request.quantity;
    }, 0);

    return total + passengerTotal;
  }, 0);

  const metrics = [
    {
      label: 'Passengers Today',
      value: passengersToday.toLocaleString(),
      helper: `${flightsToday} flights departing today`,
      icon: <TodayIcon fontSize="small" />,
      tone: 'primary' as const,
    },
    {
      label: 'Flights Today',
      value: flightsToday.toLocaleString(),
      helper: `${flights.length} flights tracked`,
      icon: <PeopleAltIcon fontSize="small" />,
      tone: 'info' as const,
    },
    {
      label: 'Check-In %',
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
      label: 'Premium Seat Revenue',
      value: formatCurrency(premiumSeatRevenue),
      helper: `${premiumPassengers} premium upgrades`,
      icon: <PaidIcon fontSize="small" />,
      tone: 'warning' as const,
    },
    {
      label: 'Top Ancillary Service',
      value: topService,
      helper: topCount > 0 ? `${topCount} passengers selected` : 'No services selected yet',
      icon: <TrendingUpIcon fontSize="small" />,
      tone: 'secondary' as const,
    },
    {
      label: 'Shop Revenue',
      value: formatCurrency(ancillaryRevenue),
      helper: 'In-flight shop requests',
      icon: <StarIcon fontSize="small" />,
      tone: 'warning' as const,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {metrics.map((metric) => (
        <Grid key={metric.label} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 12 / 7 }}>
          <MetricCard {...metric} />
        </Grid>
      ))}
    </Grid>
  );
}