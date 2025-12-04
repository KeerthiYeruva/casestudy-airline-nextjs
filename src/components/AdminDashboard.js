import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectFlight,
  setAdminFilter,
  clearAdminFilters,
} from '../slices/adminSlice';
import {
  addPassenger,
  updatePassenger,
  deletePassenger,
  addAncillaryService,
  updateAncillaryService,
  deleteAncillaryService,
  addMealOption,
  updateMealOption,
  deleteMealOption,
  addShopItem,
  updateShopItem,
  deleteShopItem,
} from '../slices/dataSlice';
import { showToast } from '../slices/toastSlice';
import SimpleInputDialog from './SimpleInputDialog';
import ConfirmDialog from './ConfirmDialog';
import { SHOP_CATEGORIES } from '../constants/appConstants';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box,
  Tabs,
  Tab,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { flights, passengers, ancillaryServices, mealOptions, shopItems } =
    useSelector((state) => state.data);
  const { selectedFlight, filterOptions } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState(0);
  const [passengerDialog, setPassengerDialog] = useState(false);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [mealDialog, setMealDialog] = useState(false);
  const [shopItemDialog, setShopItemDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: () => {} });

  const [passengerForm, setPassengerForm] = useState({
    id: '',
    name: '',
    seat: '',
    flightId: '',
    passport: { number: '', expiryDate: '', country: '' },
    address: '',
    dateOfBirth: '',
    ancillaryServices: [],
    specialMeal: 'Regular',
    wheelchair: false,
    infant: false,
    checkedIn: false,
    bookingReference: '',
    shopRequests: [],
  });

  const [serviceForm, setServiceForm] = useState('');
  const [editingService, setEditingService] = useState('');
  const [mealForm, setMealForm] = useState('');
  const [editingMeal, setEditingMeal] = useState('');
  const [shopItemForm, setShopItemForm] = useState({
    id: '',
    name: '',
    category: 'Perfumes & Cosmetics',
    price: 0,
    currency: 'USD',
  });

  // Filter passengers
  const filteredPassengers = selectedFlight
    ? passengers.filter((p) => {
        if (p.flightId !== selectedFlight.id) return false;
        if (filterOptions.missingPassport && p.passport?.number) return false;
        if (filterOptions.missingAddress && p.address) return false;
        if (filterOptions.missingDOB && p.dateOfBirth) return false;
        return true;
      })
    : passengers.filter((p) => {
        if (filterOptions.missingPassport && p.passport?.number) return false;
        if (filterOptions.missingAddress && p.address) return false;
        if (filterOptions.missingDOB && p.dateOfBirth) return false;
        return true;
      });

  const handleFlightSelect = (flight) => {
    dispatch(selectFlight(flight));
  };

  const handleOpenPassengerDialog = (passenger = null) => {
    if (passenger) {
      setEditMode(true);
      // Ensure all fields have default values to prevent undefined errors
      setPassengerForm({
        ...passenger,
        passport: passenger.passport || { number: '', expiryDate: '', country: '' },
        address: passenger.address || '',
        dateOfBirth: passenger.dateOfBirth || '',
        ancillaryServices: passenger.ancillaryServices || [],
        specialMeal: passenger.specialMeal || 'Regular',
        wheelchair: passenger.wheelchair || false,
        infant: passenger.infant || false,
        checkedIn: passenger.checkedIn || false,
        bookingReference: passenger.bookingReference || '',
        shopRequests: passenger.shopRequests || [],
      });
    } else {
      setEditMode(false);
      setPassengerForm({
        id: `P${Date.now()}`,
        name: '',
        seat: '',
        flightId: selectedFlight?.id || '',
        passport: { number: '', expiryDate: '', country: '' },
        address: '',
        dateOfBirth: '',
        ancillaryServices: [],
        specialMeal: 'Regular',
        wheelchair: false,
        infant: false,
        checkedIn: false,
        bookingReference: `BK${Date.now()}`,
        shopRequests: [],
      });
    }
    setPassengerDialog(true);
  };

  const handleSavePassenger = () => {
    // Validate required fields
    if (!passengerForm.name || !passengerForm.name.trim()) {
      dispatch(showToast({ message: 'Passenger name is required', severity: 'error' }));
      return;
    }
    if (!passengerForm.seat || !passengerForm.seat.trim()) {
      dispatch(showToast({ message: 'Seat number is required', severity: 'error' }));
      return;
    }
    if (!passengerForm.flightId) {
      dispatch(showToast({ message: 'Flight selection is required', severity: 'error' }));
      return;
    }
    
    if (editMode) {
      dispatch(updatePassenger(passengerForm));
      dispatch(showToast({ message: `Passenger ${passengerForm.name} updated successfully`, severity: 'success' }));
    } else {
      dispatch(addPassenger(passengerForm));
      dispatch(showToast({ message: `Passenger ${passengerForm.name} added successfully`, severity: 'success' }));
    }
    setPassengerDialog(false);
  };

  const handleDeletePassenger = (id) => {
    const passenger = passengers.find(p => p.id === id);
    setConfirmDialog({
      open: true,
      title: 'Delete Passenger',
      message: `Are you sure you want to delete ${passenger?.name || 'this passenger'}?`,
      severity: 'error',
      onConfirm: () => {
        dispatch(deletePassenger(id));
        dispatch(showToast({ message: `Passenger ${passenger?.name || id} deleted successfully`, severity: 'success' }));
      },
    });
  };

  const handleOpenServiceDialog = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm(service);
    } else {
      setEditingService('');
      setServiceForm('');
    }
    setServiceDialog(true);
  };

  const handleSaveService = () => {
    if (!serviceForm || !serviceForm.trim()) {
      dispatch(showToast({ message: 'Service name cannot be empty', severity: 'error' }));
      return;
    }
    if (editingService) {
      dispatch(updateAncillaryService({ oldService: editingService, newService: serviceForm.trim() }));
      dispatch(showToast({ message: 'Service updated successfully', severity: 'success' }));
    } else {
      dispatch(addAncillaryService(serviceForm.trim()));
      dispatch(showToast({ message: 'Service added successfully', severity: 'success' }));
    }
    setServiceDialog(false);
  };

  const handleDeleteService = (service) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Service',
      message: `Delete "${service}"?`,
      severity: 'error',
      onConfirm: () => {
        dispatch(deleteAncillaryService(service));
        dispatch(showToast({ message: 'Service deleted successfully', severity: 'success' }));
      },
    });
  };

  const handleOpenMealDialog = (meal = null) => {
    if (meal) {
      setEditingMeal(meal);
      setMealForm(meal);
    } else {
      setEditingMeal('');
      setMealForm('');
    }
    setMealDialog(true);
  };

  const handleSaveMeal = () => {
    if (!mealForm || !mealForm.trim()) {
      dispatch(showToast({ message: 'Meal option name cannot be empty', severity: 'error' }));
      return;
    }
    if (editingMeal) {
      dispatch(updateMealOption({ oldMeal: editingMeal, newMeal: mealForm.trim() }));
      dispatch(showToast({ message: 'Meal option updated successfully', severity: 'success' }));
    } else {
      dispatch(addMealOption(mealForm.trim()));
      dispatch(showToast({ message: 'Meal option added successfully', severity: 'success' }));
    }
    setMealDialog(false);
  };

  const handleDeleteMeal = (meal) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Meal',
      message: `Delete "${meal}"?`,
      severity: 'error',
      onConfirm: () => {
        dispatch(deleteMealOption(meal));
        dispatch(showToast({ message: 'Meal option deleted successfully', severity: 'success' }));
      },
    });
  };

  const handleOpenShopItemDialog = (item = null) => {
    if (item) {
      setEditMode(true);
      setShopItemForm(item);
    } else {
      setEditMode(false);
      setShopItemForm({
        id: `SHOP${Date.now()}`,
        name: '',
        category: 'Perfumes & Cosmetics',
        price: 0,
        currency: 'USD',
      });
    }
    setShopItemDialog(true);
  };

  const handleSaveShopItem = () => {
    if (!shopItemForm.name || !shopItemForm.name.trim()) {
      dispatch(showToast({ message: 'Item name is required', severity: 'error' }));
      return;
    }
    if (!shopItemForm.price || shopItemForm.price <= 0) {
      dispatch(showToast({ message: 'Item price must be greater than 0', severity: 'error' }));
      return;
    }
    if (editMode) {
      dispatch(updateShopItem(shopItemForm));
      dispatch(showToast({ message: `${shopItemForm.name} updated successfully`, severity: 'success' }));
    } else {
      dispatch(addShopItem({ ...shopItemForm, id: `SHOP${Date.now()}` }));
      dispatch(showToast({ message: `${shopItemForm.name} added successfully`, severity: 'success' }));
    }
    setShopItemDialog(false);
  };

  const handleDeleteShopItem = (id) => {
    const item = shopItems.find(i => i.id === id);
    setConfirmDialog({
      open: true,
      title: 'Delete Shop Item',
      message: `Are you sure you want to delete ${item?.name || 'this item'}?`,
      severity: 'error',
      onConfirm: () => {
        dispatch(deleteShopItem(id));
        dispatch(showToast({ message: `${item?.name || 'Item'} deleted successfully`, severity: 'success' }));
      },
    });
  };

  const hasMissingInfo = (passenger) => {
    return !passenger.passport?.number || !passenger.address || !passenger.dateOfBirth;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Admin Dashboard
        </Typography>

        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Passengers" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Services & Menu" icon={<SettingsIcon />} iconPosition="start" />
        </Tabs>

        {activeTab === 0 && (
          <>
            {/* Flight Selection & Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter by Flight</InputLabel>
                  <Select
                    value={selectedFlight?.id || ''}
                    label="Filter by Flight"
                    onChange={(e) => {
                      const flight = flights.find((f) => f.id === e.target.value);
                      handleFlightSelect(flight || null);
                    }}
                  >
                    <MenuItem value="">All Flights</MenuItem>
                    {flights.map((flight) => (
                      <MenuItem key={flight.id} value={flight.id}>
                        {flight.name} - {flight.time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography variant="body2">Filter by missing:</Typography>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filterOptions.missingPassport}
                          onChange={(e) =>
                            dispatch(setAdminFilter({ missingPassport: e.target.checked }))
                          }
                        />
                      }
                      label="Passport"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filterOptions.missingAddress}
                          onChange={(e) =>
                            dispatch(setAdminFilter({ missingAddress: e.target.checked }))
                          }
                        />
                      }
                      label="Address"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filterOptions.missingDOB}
                          onChange={(e) =>
                            dispatch(setAdminFilter({ missingDOB: e.target.checked }))
                          }
                        />
                      }
                      label="DOB"
                    />
                  </FormGroup>
                  <Button size="small" onClick={() => dispatch(clearAdminFilters())}>
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Passenger List */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Passengers ({filteredPassengers.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenPassengerDialog()}
              >
                Add Passenger
              </Button>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Flight</TableCell>
                  <TableCell>Seat</TableCell>
                  <TableCell>Ancillary Services</TableCell>
                  <TableCell>Passport</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>DOB</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPassengers.map((passenger) => (
                  <TableRow
                    key={passenger.id}
                    sx={{
                      bgcolor: hasMissingInfo(passenger) ? '#fff3e0' : 'transparent',
                    }}
                  >
                    <TableCell>
                      {passenger.name}
                      {hasMissingInfo(passenger) && (
                        <Chip label="Incomplete" size="small" color="warning" sx={{ ml: 1 }} />
                      )}
                    </TableCell>
                    <TableCell>
                      {flights.find((f) => f.id === passenger.flightId)?.name || 'N/A'}
                    </TableCell>
                    <TableCell>{passenger.seat}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {passenger.ancillaryServices?.slice(0, 2).map((service) => (
                          <Chip key={service} label={service} size="small" />
                        ))}
                        {passenger.ancillaryServices?.length > 2 && (
                          <Chip label={`+${passenger.ancillaryServices.length - 2}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {passenger.passport?.number ? (
                        <Chip label="✓" color="success" size="small" />
                      ) : (
                        <Chip label="Missing" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {passenger.address ? (
                        <Chip label="✓" color="success" size="small" />
                      ) : (
                        <Chip label="Missing" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {passenger.dateOfBirth ? (
                        <Chip label="✓" color="success" size="small" />
                      ) : (
                        <Chip label="Missing" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenPassengerDialog(passenger)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeletePassenger(passenger.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {/* Ancillary Services */}
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Ancillary Services</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenServiceDialog()}
                  >
                    Add
                  </Button>
                </Box>
                <List>
                  {ancillaryServices.map((service) => (
                    <ListItem
                      key={service}
                      secondaryAction={
                        <>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleOpenServiceDialog(service)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleDeleteService(service)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemText primary={service} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Meal Options */}
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Meal Options</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenMealDialog()}
                  >
                    Add
                  </Button>
                </Box>
                <List>
                  {mealOptions.map((meal) => (
                    <ListItem
                      key={meal}
                      secondaryAction={
                        <>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleOpenMealDialog(meal)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleDeleteMeal(meal)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemText primary={meal} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Shop Items */}
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Shop Items ({shopItems.length})</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenShopItemDialog()}
                  >
                    Add
                  </Button>
                </Box>
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {shopItems.map((item) => (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        <>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleOpenShopItemDialog(item)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleDeleteShopItem(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.category} - $${item.price}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Passenger Dialog */}
      <Dialog open={passengerDialog} onClose={() => setPassengerDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Passenger' : 'Add Passenger'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={passengerForm.name}
                onChange={(e) => setPassengerForm({ ...passengerForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Seat"
                value={passengerForm.seat}
                onChange={(e) => setPassengerForm({ ...passengerForm, seat: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Flight</InputLabel>
                <Select
                  value={passengerForm.flightId}
                  label="Flight"
                  onChange={(e) => setPassengerForm({ ...passengerForm, flightId: e.target.value })}
                >
                  {flights.map((flight) => (
                    <MenuItem key={flight.id} value={flight.id}>
                      {flight.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="caption">Passport Details</Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Passport Number"
                value={passengerForm.passport.number}
                onChange={(e) =>
                  setPassengerForm({
                    ...passengerForm,
                    passport: { ...passengerForm.passport, number: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={passengerForm.passport.expiryDate}
                onChange={(e) =>
                  setPassengerForm({
                    ...passengerForm,
                    passport: { ...passengerForm.passport, expiryDate: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Country"
                value={passengerForm.passport.country}
                onChange={(e) =>
                  setPassengerForm({
                    ...passengerForm,
                    passport: { ...passengerForm.passport, country: e.target.value },
                  })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={passengerForm.address}
                onChange={(e) => setPassengerForm({ ...passengerForm, address: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={passengerForm.dateOfBirth}
                onChange={(e) => setPassengerForm({ ...passengerForm, dateOfBirth: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Booking Reference"
                value={passengerForm.bookingReference}
                onChange={(e) =>
                  setPassengerForm({ ...passengerForm, bookingReference: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={passengerForm.wheelchair}
                      onChange={(e) =>
                        setPassengerForm({ ...passengerForm, wheelchair: e.target.checked })
                      }
                    />
                  }
                  label="Wheelchair"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={passengerForm.infant}
                      onChange={(e) =>
                        setPassengerForm({ ...passengerForm, infant: e.target.checked })
                      }
                    />
                  }
                  label="Infant"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPassengerDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePassenger} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Dialog */}
      <SimpleInputDialog
        open={serviceDialog}
        onClose={() => setServiceDialog(false)}
        title={editingService ? 'Edit Service' : 'Add Service'}
        label="Service Name"
        value={serviceForm}
        onChange={(e) => setServiceForm(e.target.value)}
        onSave={handleSaveService}
        editMode={!!editingService}
      />

      {/* Meal Dialog */}
      <SimpleInputDialog
        open={mealDialog}
        onClose={() => setMealDialog(false)}
        title={editingMeal ? 'Edit Meal' : 'Add Meal'}
        label="Meal Name"
        value={mealForm}
        onChange={(e) => setMealForm(e.target.value)}
        onSave={handleSaveMeal}
        editMode={!!editingMeal}
      />

      {/* Shop Item Dialog */}
      <Dialog open={shopItemDialog} onClose={() => setShopItemDialog(false)}>
        <DialogTitle>{editMode ? 'Edit Shop Item' : 'Add Shop Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Item Name"
                value={shopItemForm.name}
                onChange={(e) => setShopItemForm({ ...shopItemForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={shopItemForm.category}
                  label="Category"
                  onChange={(e) => setShopItemForm({ ...shopItemForm, category: e.target.value })}
                >
                  {SHOP_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={shopItemForm.price}
                onChange={(e) =>
                  setShopItemForm({ ...shopItemForm, price: parseFloat(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Currency"
                value={shopItemForm.currency}
                onChange={(e) => setShopItemForm({ ...shopItemForm, currency: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShopItemDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveShopItem} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        severity={confirmDialog.severity}
      />
    </Container>
  );
};

export default AdminDashboard;
