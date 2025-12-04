'use client';

import React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';

const SeatMapVisual = ({ passengers, onSeatClick, mode = 'checkin' }) => {
  const rows = 10;
  const seatsPerRow = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getSeatColor = (seat) => {
    const passenger = passengers.find((p) => p.seat === seat);
    if (!passenger) return 'available';

    if (mode === 'checkin') {
      if (passenger.wheelchair) return 'wheelchair';
      if (passenger.infant) return 'infant';
      if (passenger.checkedIn) return 'checked-in';
      return 'not-checked-in';
    } else if (mode === 'inflight') {
      if (passenger.specialMeal && passenger.specialMeal !== 'Regular') {
        return 'special-meal';
      }
      return 'regular';
    }

    return 'available';
  };

  const renderLegend = () => {
    if (mode === 'checkin') {
      return (
        <>
          <Chip label="Available" className="seat-chip available" size="small" />
          <Chip label="Checked In" className="seat-chip checked-in" size="small" />
          <Chip label="Not Checked In" className="seat-chip not-checked-in" size="small" />
          <Chip label="Wheelchair" className="seat-chip wheelchair" size="small" />
          <Chip label="Infant" className="seat-chip infant" size="small" />
        </>
      );
    } else if (mode === 'inflight') {
      return (
        <>
          <Chip label="Available" className="seat-chip available" size="small" />
          <Chip label="Regular Meal" className="seat-chip regular" size="small" />
          <Chip label="Special Meal Required" className="seat-chip special-meal" size="small" />
        </>
      );
    }
    return null;
  };

  return (
    <Box className={`seat-map ${mode === 'inflight' ? 'inflight' : ''}`}>
      <Typography variant="h6" gutterBottom>
        Seat Map
      </Typography>
      <Box className="legend">{renderLegend()}</Box>
      <Box className="seats-container">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <Box key={rowIndex} className="seat-row">
            <Typography className="row-number">{rowIndex + 1}</Typography>
            {seatsPerRow.map((seatLetter, seatIndex) => {
              const seatNumber = `${rowIndex + 1}${seatLetter}`;
              const seatColor = getSeatColor(seatNumber);
              const passenger = passengers.find((p) => p.seat === seatNumber);

              return (
                <React.Fragment key={seatNumber}>
                  <Button
                    className={`seat ${seatColor}`}
                    onClick={() => onSeatClick(seatNumber)}
                    variant="outlined"
                    size="small"
                    disabled={mode === 'inflight' && !passenger}
                  >
                    {seatNumber}
                  </Button>
                  {seatIndex === 2 && <Box className="aisle" />}
                </React.Fragment>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SeatMapVisual;

