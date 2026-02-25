import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import { 
  CalendarMonth, 
  People, 
  BookOnline, 
  AdminPanelSettings,
  Notifications,
  AccountCircle,
  ExitToApp 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Import section components
import { CalendarSection, GuestsSection, ReservationsSection } from './sections';

const TAB_CONFIG = [
  {
    value: 'calendar',
    label: 'Kalendář',
    icon: CalendarMonth,
    component: CalendarSection,
  },
  {
    value: 'reservations',
    label: 'Rezervace',
    icon: BookOnline,
    component: ReservationsSection,
  },
  {
    value: 'guests',
    label: 'Hosté',
    icon: People,
    component: GuestsSection,
  },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState('calendar');
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Protect this route - redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Ověřování přístupu...</Typography>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    handleMenuClose();
    navigate('/', { replace: true });
  };

  const activeTabConfig = TAB_CONFIG.find(tab => tab.value === currentTab);
  const ActiveComponent = activeTabConfig?.component;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Admin Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 } }}>
            <AdminPanelSettings sx={{ mr: 2, color: 'primary.main' }} />
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                fontFamily: '"Manrope", "Poppins", sans-serif',
                color: 'text.primary'
              }}
            >
              Admin Dashboard - Penzion Lidmanovi
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Odhlásit se
                </MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Navigation Tabs */}
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box 
          sx={{ 
            mb: 4,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Stack 
            direction="row" 
            spacing={0}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 0.5,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {TAB_CONFIG.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = currentTab === tab.value;
              return (
                <Box
                  key={tab.value}
                  onClick={() => setCurrentTab(tab.value)}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : 'action.hover',
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <IconComponent sx={{ fontSize: 18 }} />
                    <Typography 
                      sx={{ 
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.9rem',
                        fontFamily: '"Manrope", "Poppins", sans-serif',
                      }}
                    >
                      {tab.label}
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Active Section Content */}
        <Box sx={{ pb: 4 }}>
          {ActiveComponent && <ActiveComponent />}
        </Box>
      </Container>
    </Box>
  );
}
