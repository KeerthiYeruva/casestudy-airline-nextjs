"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Typography,
  TableContainer,
  Paper,
  Collapse,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PersonIcon from "@mui/icons-material/Person";
import { Passenger, Flight } from "@/types";

interface PassengerTableProps {
  passengers: Passenger[];
  flights: Flight[];
  onEdit: (passenger: Passenger) => void;
  onDelete: (id: string) => void;
}

const PassengerTable: React.FC<PassengerTableProps> = ({
  passengers,
  flights,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const getMissingFields = (passenger: Passenger) => {
    const missing = [];
    if (!passenger.passport?.number) missing.push('Passport');
    if (!passenger.address) missing.push('Address');
    if (!passenger.dateOfBirth) missing.push('DOB');
    return missing;
  };

  const toggleRow = (passengerId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(passengerId)) {
      newExpanded.delete(passengerId);
    } else {
      newExpanded.add(passengerId);
    }
    setExpandedRows(newExpanded);
  };

  if (isMobile) {
    // Mobile Card View
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {passengers.map((passenger) => {
          const flight = flights.find((f) => f.id === passenger.flightId);
          const missingFields = getMissingFields(passenger);
          const isExpanded = expandedRows.has(passenger.id);

          return (
            <Paper key={passenger.id} elevation={2} sx={{ p: 2, border: missingFields.length > 0 ? '2px solid' : 'none', borderColor: 'warning.main' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
                <Avatar sx={{ bgcolor: missingFields.length > 0 ? 'warning.main' : 'primary.main' }}>
                  {missingFields.length > 0 ? <ErrorIcon /> : <PersonIcon />}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {passenger.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    <Chip label={passenger.seat} size="small" />
                    <Chip label={flight?.flightNumber || 'N/A'} size="small" variant="outlined" />
                    {missingFields.length > 0 && (
                      <Chip label={`${missingFields.length} missing`} size="small" color="warning" />
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" color="primary" onClick={() => onEdit(passenger)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={() => toggleRow(passenger.id)}>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={isExpanded}>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  {missingFields.length > 0 && (
                    <Box sx={{ mb: 1, p: 1, bgcolor: 'warning.50', borderRadius: 1 }}>
                      <Typography variant="caption" color="warning.dark" fontWeight="medium">
                        Missing: {missingFields.join(', ')}
                      </Typography>
                    </Box>
                  )}
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Flight:</strong> {flight?.flightNumber} - {flight?.origin || flight?.from} → {flight?.destination || flight?.to}
                  </Typography>
                  
                  {passenger.ancillaryServices.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Services:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {passenger.ancillaryServices.map((service) => (
                          <Chip key={service} label={service} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton size="small" color="error" onClick={() => onDelete(passenger.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Box>
    );
  }

  // Desktop Table View
  return (
    <TableContainer component={Paper} elevation={1} sx={{ maxHeight: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Passenger</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Flight</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Seat</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Services</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Verification</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100', textAlign: 'right' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {passengers.map((passenger) => {
            const flight = flights.find((f) => f.id === passenger.flightId);
            const missingFields = getMissingFields(passenger);
            
            return (
              <TableRow
                key={passenger.id}
                hover
                sx={{
                  bgcolor: missingFields.length > 0 ? "warning.50" : "transparent",
                  '&:hover': {
                    bgcolor: missingFields.length > 0 ? 'warning.100' : 'action.hover',
                  }
                }}
              >
                <TableCell>
                  {missingFields.length === 0 ? (
                    <Tooltip title="Complete">
                      <CheckCircleIcon color="success" />
                    </Tooltip>
                  ) : (
                    <Tooltip title={`Missing: ${missingFields.join(', ')}`}>
                      <ErrorIcon color="warning" />
                    </Tooltip>
                  )}
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                      {passenger.name}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {flight?.flightNumber || "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {flight?.origin || flight?.from} → {flight?.destination || flight?.to}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip label={passenger.seat} size="small" color="primary" variant="outlined" />
                </TableCell>
                
                <TableCell>
                  {passenger.ancillaryServices?.length > 0 ? (
                    <Tooltip title={passenger.ancillaryServices.join(', ')}>
                      <Chip 
                        label={`${passenger.ancillaryServices.length} services`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">None</Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <Chip 
                      label="Passport" 
                      size="small" 
                      color={passenger.passport?.number ? "success" : "error"}
                      variant="outlined"
                    />
                    <Chip 
                      label="Address" 
                      size="small" 
                      color={passenger.address ? "success" : "error"}
                      variant="outlined"
                    />
                    <Chip 
                      label="DOB" 
                      size="small" 
                      color={passenger.dateOfBirth ? "success" : "error"}
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <Tooltip title="Edit Passenger">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(passenger)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Passenger">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(passenger.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PassengerTable;
