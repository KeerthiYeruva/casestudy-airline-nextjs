'use client';

import React, { useState } from 'react';
import useAuthStore from '@/stores/useAuthStore';
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
  Divider,
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

const Auth: React.FC = () => {
  const { user, role, loading, error, isAuthenticated, loginStart, loginSuccess, logout, setRole } = useAuthStore();
  const [roleDialog, setRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'staff' | 'admin'>('staff');
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
    loginStart();
    try {
      // Simulate async login
      setTimeout(() => {
        setRoleDialog(true);
      }, 500);
    } catch (error) {
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
    loginSuccess({
      user: mockUser,
      role: selectedRole,
    });
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
    logout();
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

  const handleRoleChange = (newRole: 'staff' | 'admin') => {
    setRole(newRole);
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
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          padding: { xs: 2, sm: 3 },
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: { xs: 3, sm: 5 },
            textAlign: 'center',
            maxWidth: 450,
            width: '100%',
            borderRadius: 3,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'primary.main',
                margin: '0 auto',
                mb: 2,
              }}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              Airline Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Streamline check-in, in-flight services, and passenger management
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleLogin}
            disabled={loading}
            fullWidth
            sx={{ 
              mb: 2, 
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: 2,
            }}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          
          {error && (
            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'error.50', borderRadius: 1 }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          )}
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Secure authentication powered by Google
          </Typography>
        </Paper>

        {/* Role Selection Dialog */}
        <Dialog open={roleDialog} onClose={() => {}} disableEscapeKeyDown maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1, fontWeight: 'bold' }}>
            Complete Setup
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'normal', mt: 0.5 }}>
              Select your user profile and role
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select User</InputLabel>
              <Select
                value={selectedMockUser}
                label="Select User"
                onChange={(e) => setSelectedMockUser(e.target.value as number)}
              >
                {MOCK_USERS.map((mockUser, index) => (
                  <MenuItem key={mockUser.uid} value={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                      <Avatar 
                        src={mockUser.photoURL} 
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {mockUser.displayName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {mockUser.email}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={selectedRole}
                label="Select Role"
                onChange={(e) => setSelectedRole(e.target.value as 'staff' | 'admin')}
              >
                <MenuItem value="staff">
                  <Box>
                    <Typography variant="body1" fontWeight="medium">Airline Staff</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Access Check-In and In-Flight services
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="admin">
                  <Box>
                    <Typography variant="body1" fontWeight="medium">Administrator</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Full access including passenger management
                    </Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={handleRoleSelection} 
              variant="contained" 
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Continue to Dashboard
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
        gap: { xs: 0.5, sm: 1, md: 1.5 },
        padding: { xs: 0.25, sm: 0.5, md: 1 },
      }}
    >
      {/* User Info - Hidden on mobile/tablet, shown on desktop */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
        <Avatar 
          src={user?.photoURL || undefined} 
          alt={user?.displayName || undefined}
          sx={{ width: 32, height: 32 }}
        >
          <PersonIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.85rem', lineHeight: 1.2 }}>
            {user?.displayName}
          </Typography>
          <Chip
            label={role === 'admin' ? 'Admin' : 'Staff'}
            size="small"
            color={role === 'admin' ? 'secondary' : 'primary'}
            sx={{ fontSize: '0.65rem', height: 18, mt: 0.25 }}
          />
        </Box>
      </Box>
      
      {/* Mobile/Tablet: Show compact avatar with role badge */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.5 }}>
        <Avatar 
          src={user?.photoURL || undefined} 
          alt={user?.displayName || undefined}
          sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}
        >
          <PersonIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
        </Avatar>
      </Box>
      
      {/* Role Selector - Visible on tablet/desktop, hidden on mobile */}
      <FormControl 
        size="small" 
        sx={{ 
          display: { xs: 'none', sm: 'block' },
          minWidth: { sm: 80, md: 90 },
          '& .MuiOutlinedInput-root': {
            fontSize: { sm: '0.75rem', md: '0.8rem' },
          }
        }}
      >
        <Select
          value={role || 'staff'}
          onChange={(e) => handleRoleChange(e.target.value as 'staff' | 'admin')}
          displayEmpty
          aria-label="Change role"
          sx={{ 
            fontSize: { sm: '0.75rem', md: '0.8rem' },
            height: { sm: 36, md: 40 },
          }}
        >
          <MenuItem value="staff" sx={{ fontSize: { sm: '0.8rem', md: '0.875rem' } }}>
            Staff
          </MenuItem>
          <MenuItem value="admin" sx={{ fontSize: { sm: '0.8rem', md: '0.875rem' } }}>
            Admin
          </MenuItem>
        </Select>
      </FormControl>
      
      <Button
        variant="text"
        size="small"
        startIcon={<LogoutIcon sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />}
        onClick={handleLogout}
        aria-label="Logout"
        color="inherit"
        sx={{ 
          fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' },
          px: { xs: 0.5, sm: 1, md: 1.5 },
          py: { xs: 0.5, sm: 0.75 },
          minWidth: { xs: 36, sm: 'auto' },
          minHeight: { xs: 36, sm: 36 }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Logout</Box>
        <LogoutIcon sx={{ display: { xs: 'inline-flex', sm: 'none' }, fontSize: 18 }} />
      </Button>
    </Box>
  );
};

export default Auth;
