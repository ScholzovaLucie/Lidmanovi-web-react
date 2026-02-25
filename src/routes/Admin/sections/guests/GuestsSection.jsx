import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Stack,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import { People, Search, Email, Phone } from '@mui/icons-material';
import CustomTable from '../../components/CustomMuiTable';
import { useGuestsQuery } from '../../../../redux/api/guestApi';

const ENHANCED_GUEST_COLUMNS = [
  {
    key: 'first_name',
    label: 'Jméno',
    render: (row) => (
      <Typography fontWeight="600">{row.first_name}</Typography>
    )
  },
  {
    key: 'last_name',
    label: 'Příjmení',
    render: (row) => (
      <Typography fontWeight="600">{row.last_name}</Typography>
    )
  },
  {
    key: 'email',
    label: 'Email',
    render: (row) => (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="body2">{row.email}</Typography>
      </Stack>
    )
  },
  {
    key: 'phone',
    label: 'Telefon',
    render: (row) => row.phone ? (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="body2">{row.phone}</Typography>
      </Stack>
    ) : (
      <Typography variant="body2" color="text.secondary">—</Typography>
    )
  },
  {
    key: 'reservations',
    label: 'Rezervace',
    align: 'center',
    render: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.reservations?.length || 0}
      </Typography>
    )
  }
];

export default function GuestsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: guestsData, isLoading, error } = useGuestsQuery();

  const filteredGuests = useMemo(() => {
    if (!guestsData || !searchTerm) return guestsData || [];
    
    const term = searchTerm.toLowerCase();
    return guestsData.filter(guest =>
      guest.first_name?.toLowerCase().includes(term) ||
      guest.last_name?.toLowerCase().includes(term) ||
      guest.email?.toLowerCase().includes(term) ||
      guest.phone?.includes(term)
    );
  }, [guestsData, searchTerm]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="body1">Načítání hostů...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="body1" color="error">
          Chyba při načítání hostů
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <People color="primary" />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontFamily: '"Manrope", "Poppins", sans-serif'
            }}
          >
            Správa hostů
          </Typography>
        </Stack>
      </Box>

      {/* Seznam hostů */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontFamily: '"Manrope", "Poppins", sans-serif'
                }}
              >
                Seznam hostů
              </Typography>
              
              <TextField
                placeholder="Hledat hosta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Box sx={{ bgcolor: 'background.default', borderRadius: 2, overflow: 'hidden' }}>
              <CustomTable
                columns={ENHANCED_GUEST_COLUMNS}
                data={filteredGuests}
                getRowId={(row) => row.id}
                sx={{ bgcolor: 'background.paper' }}
              />
            </Box>

            {filteredGuests.length === 0 && searchTerm && (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  Žádný host nenalezen pro hledání "{searchTerm}"
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
}