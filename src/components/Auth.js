import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout, setRole } from '../slices/authSlice';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

// ========================================
// FIREBASE AUTHENTICATION (COMMENTED OUT)
// Uncomment these imports when you have Firebase configured
// ========================================
// import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '../firebaseConfig';

// ========================================
// MOCK AUTHENTICATION (ACTIVE)
// Comment out this section when using Firebase
// ========================================
// Mock user data
const MOCK_USERS = [
  {
    uid: 'mock-user-1',
    displayName: 'John Doe',
    email: 'john.doe@airline.com',
    photoURL: 'https://ui-avatars.com/api/?name=John+Doe&background=1976d2&color=fff',
  },
  {
    uid: 'mock-user-2',
    displayName: 'Jane Smith',
    email: 'jane.smith@airline.com',
    photoURL: 'https://ui-avatars.com/api/?name=Jane+Smith&background=dc004e&color=fff',
  },
];

const Auth = () => {
  const dispatch = useDispatch();
  const { user, role, loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [roleDialog, setRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('staff');
  const [selectedMockUser, setSelectedMockUser] = useState(0);

  // ========================================
  // FIREBASE: Uncomment this useEffect when using Firebase
  // ========================================
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     if (currentUser && !isAuthenticated) {
  //       setRoleDialog(true);
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [isAuthenticated]);

  // ========================================
  // MOCK LOGIN: Comment out when using Firebase
  // ========================================
  const handleLogin = () => {
    dispatch(loginStart());
    try {
      // Simulate async login
      setTimeout(() => {
        setRoleDialog(true);
      }, 500);
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.error('Login error:', error);
    }
  };

  // ========================================
  // FIREBASE LOGIN: Uncomment when using Firebase
  // ========================================
  // const handleLogin = async () => {
  //   dispatch(loginStart());
  //   try {
  //     await signInWithPopup(auth, googleProvider);
  //     setRoleDialog(true);
  //   } catch (error) {
  //     dispatch(loginFailure(error.message));
  //     console.error('Login error:', error);
  //   }
  // };

  // ========================================
  // MOCK ROLE SELECTION: Comment out when using Firebase
  // ========================================
  const handleRoleSelection = () => {
    const mockUser = MOCK_USERS[selectedMockUser];
    dispatch(loginSuccess({
      user: mockUser,
      role: selectedRole,
    }));
    setRoleDialog(false);
  };

  // ========================================
  // FIREBASE ROLE SELECTION: Uncomment when using Firebase
  // ========================================
  // const handleRoleSelection = () => {
  //   const currentUser = auth.currentUser;
  //   if (currentUser) {
  //     dispatch(loginSuccess({
  //       user: {
  //         uid: currentUser.uid,
  //         displayName: currentUser.displayName,
  //         email: currentUser.email,
  //         photoURL: currentUser.photoURL,
  //       },
  //       role: selectedRole,
  //     }));
  //     setRoleDialog(false);
  //   }
  // };

  // ========================================
  // MOCK LOGOUT: Comment out when using Firebase
  // ========================================
  const handleLogout = () => {
    dispatch(logout());
  };

  // ========================================
  // FIREBASE LOGOUT: Uncomment when using Firebase
  // ========================================
  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     dispatch(logout());
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //   }
  // };

  const handleRoleChange = (newRole) => {
    dispatch(setRole(newRole));
  };

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 3,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            textAlign: 'center',
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Typography variant="h4" gutterBottom color="primary">
            Airline Management System
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Sign in to access check-in, in-flight services, and admin dashboard
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleLogin}
            disabled={loading}
            fullWidth
            sx={{ mb: 2 }}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Paper>

        {/* Role Selection Dialog */}
        <Dialog open={roleDialog} onClose={() => {}} disableEscapeKeyDown maxWidth="sm" fullWidth>
          <DialogTitle>Select User & Role</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Select a mock user and your role to continue:
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>User</InputLabel>
              <Select
                value={selectedMockUser}
                label="User"
                onChange={(e) => setSelectedMockUser(e.target.value)}
              >
                {MOCK_USERS.map((mockUser, index) => (
                  <MenuItem key={mockUser.uid} value={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        src={mockUser.photoURL} 
                        sx={{ width: 24, height: 24 }}
                      />
                      <Box>
                        <Typography variant="body2">{mockUser.displayName}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {mockUser.email}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedRole}
                label="Role"
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <MenuItem value="staff">Airline Staff</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              <strong>Staff:</strong> Access Check-In and In-Flight services
              <br />
              <strong>Admin:</strong> Full access including passenger management
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRoleSelection} variant="contained" size="large">
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 1,
      }}
    >
      <Avatar src={user?.photoURL} alt={user?.displayName}>
        <PersonIcon />
      </Avatar>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {user?.displayName}
        </Typography>
        <Chip
          label={role === 'admin' ? 'Administrator' : 'Staff'}
          size="small"
          color={role === 'admin' ? 'secondary' : 'primary'}
          sx={{ fontSize: '0.7rem' }}
        />
      </Box>
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <Select
          value={role || 'staff'}
          onChange={(e) => handleRoleChange(e.target.value)}
          displayEmpty
        >
          <MenuItem value="staff">Staff</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="outlined"
        size="small"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        aria-label="Logout"
      >
        Logout
      </Button>
    </Box>
  );
};

export default Auth;