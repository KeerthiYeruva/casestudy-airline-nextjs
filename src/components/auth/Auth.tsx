'use client';

import React, { useEffect, useState } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import { UserRole, normalizeUserRole, roleDescriptions, roleLabels, staffRoleOptions } from '@/types/auth';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from '@/lib/firebaseConfig';
import { isFirebaseConfigured } from '@/lib/firestoreService';
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
  const { user, role, loading, error, isAuthenticated, loginStart, loginSuccess, loginFailure, logout, setRole } = useAuthStore();
  const [roleDialog, setRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CHECKIN_AGENT);
  const [selectedMockUser, setSelectedMockUser] = useState(0);
  const firebaseEnabled = isFirebaseConfigured();
  const currentRole = normalizeUserRole(role);
  const currentRoleLabel = currentRole ? roleLabels[currentRole] : 'Role required';

  useEffect(() => {
    if (!firebaseEnabled) return;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && !isAuthenticated) {
        setRoleDialog(true);
      }
    });

    return () => unsubscribe();
  }, [firebaseEnabled, isAuthenticated]);

  const handleLogin = async () => {
    loginStart();

    if (!firebaseEnabled) {
      // Fallback for local/demo mode
      setTimeout(() => {
        setRoleDialog(true);
      }, 500);
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
      setRoleDialog(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      loginFailure(message);
      console.error('Login error:', err);
    }
  };

  const handleRoleSelection = () => {
    if (firebaseEnabled) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        loginSuccess({
          user: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
          },
          role: selectedRole,
        });
        setRoleDialog(false);
      }
      return;
    }

    const mockUser = MOCK_USERS[selectedMockUser];
    loginSuccess({
      user: mockUser,
      role: selectedRole,
    });
    setRoleDialog(false);
  };

  const handleLogout = async () => {
    try {
      if (firebaseEnabled) {
        await signOut(auth);
      }
      logout();
    } catch (err) {
      console.error('Logout error:', err);
      logout();
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
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
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
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
            <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
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
        <Dialog open={roleDialog} onClose={() => {}} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1, fontWeight: 'bold' }}>
            Complete Setup
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'normal', mt: 0.5 }}>
              Select your user profile and role
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {!firebaseEnabled && (
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
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
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
            )}

            {firebaseEnabled && (
              <Box sx={{ mb: 3, p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                <Typography variant="body2" color="text.secondary">
                  Signed in as: {auth.currentUser?.displayName || auth.currentUser?.email || 'Google user'}
                </Typography>
              </Box>
            )}

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={selectedRole}
                label="Select Role"
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              >
                {staffRoleOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{roleLabels[option]}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {roleDescriptions[option]}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
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
            label={currentRoleLabel}
            size="small"
            color={currentRole === UserRole.ADMIN || currentRole === UserRole.SUPER_ADMIN ? 'secondary' : 'primary'}
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
          value={currentRole || ''}
          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          displayEmpty
          aria-label="Change role"
          sx={{ 
            fontSize: { sm: '0.75rem', md: '0.8rem' },
            height: { sm: 36, md: 40 },
          }}
        >
          {staffRoleOptions.map((option) => (
            <MenuItem key={option} value={option} sx={{ fontSize: { sm: '0.8rem', md: '0.875rem' } }}>
              {roleLabels[option]}
            </MenuItem>
          ))}
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
