import { useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Add,
  Save,
  Cancel,
} from "@mui/icons-material";
import RoomCard from "../../../Reservation/components/RoomCard";
import { useAdminRoomsQuery, useUpdateRoomMutation } from "../../../../redux/api/roomsApi";

export default function RoomsSection() {
  // Check auth token
  const authToken = useSelector((state) => state.app.auth.accessToken);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    name_i18n: "",
    max_adults: "",
    max_children: "",
    capacity: "",
    description: "",
    description_i18n: "",
    price_for_adult: "",
    price_for_children: "",
    is_active: true,
  });

  // Načítání pokojů z API
  const {
    data: roomsResponse,
    isLoading,
    error,
  } = useAdminRoomsQuery({ page: 1, page_size: 50 });

  // Update room mutation
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();

  const rooms = roomsResponse?.results || [];

  const handleClearSearch = () => {
    // Removed search functionality
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || "",
      name_i18n: room.name_i18n || "",
      max_adults: room.max_adults?.toString() || "",
      max_children: room.max_children?.toString() || "",
      capacity: room.capacity?.toString() || "",
      description: room.description || "",
      description_i18n: room.description_i18n || "",
      price_for_adult: room.price_for_adult?.toString() || "",
      price_for_children: room.price_for_children?.toString() || "",
      is_active: room.is_active !== undefined ? room.is_active : true,
    });
    setEditDialogOpen(true);
  };

  const handleAddNewRoom = () => {
    setEditingRoom(null);
    setFormData({
      name: "",
      name_i18n: "",
      max_adults: "",
      max_children: "",
      capacity: "",
      description: "",
      description_i18n: "",
      price_for_adult: "",
      price_for_children: "",
      is_active: true,
    });
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditingRoom(null);
    setFormData({
      name: "",
      name_i18n: "",
      max_adults: "",
      max_children: "",
      capacity: "",
      description: "",
      description_i18n: "",
      price_for_adult: "",
      price_for_children: "",
      is_active: true,
    });
  };

  const handleSaveRoom = async () => {
    if (!editingRoom) {
      console.log('Create room functionality not implemented yet');
      return;
    }

    try {
      const roomData = {
        name: formData.name,
        name_i18n: formData.name_i18n,
        max_adults: parseInt(formData.max_adults),
        max_children: parseInt(formData.max_children),
        capacity: parseInt(formData.capacity),
        description: formData.description,
        description_i18n: formData.description_i18n,
        price_for_adult: parseInt(formData.price_for_adult),
        price_for_children: parseInt(formData.price_for_children),
        is_active: formData.is_active,
      };

      await updateRoom({ id: editingRoom.id, ...roomData }).unwrap();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleDeleteRoom = (roomId) => {
    setDeletingRoomId(roomId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRoom = () => {
    // TODO: Implementovat API call pro smazání
    console.log('Delete room:', deletingRoomId);
    setDeleteDialogOpen(false);
    setDeletingRoomId(null);
  };

  const cancelDeleteRoom = () => {
    setDeleteDialogOpen(false);
    setDeletingRoomId(null);
  };

  const filteredRooms = useMemo(() => {
    return rooms; // No filtering since search was removed
  }, [rooms]);

  return (
    <Stack p={{ xs: 1, md: 3 }} spacing={4}>
      <Stack>
        <Typography variant="h4" gutterBottom>
          Pokoje
        </Typography>
        <Typography variant="body1">
          Zde můžete spravovat informace o pokojích, které nabízíte. Přidávejte
          nové pokoje, upravujte stávající nebo odstraňujte ty, které již
          nenabízíte. Můžete také nastavit ceny, popisy a fotografie pro každý
          pokoj.
        </Typography>
      </Stack>

      <Stack spacing={4}>
        {/* Add button */}
        <Stack
          direction="row"
          justifyContent="flex-end"
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNewRoom}
          >
            Přidat pokoj
          </Button>
        </Stack>

        {/* Grid pokojů */}
          {isLoading ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography>Načítání pokojů...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 8, color: "error.main" }}>
              <Typography>Chyba při načítání pokojů</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Status: {error?.status} 
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Zpráva: {error?.data?.message || error?.data?.detail || 'Neznámá chyba'}
              </Typography>
            </Box>
          ) : filteredRooms.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(auto-fit, minmax(300px, 1fr))",
                },
                gap: 3,
                justifyItems: "center",
              }}
            >
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  isAdminMode={true}
                  onEdit={handleEditRoom}
                  onDelete={handleDeleteRoom}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "text.secondary",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {"Zatím nemáte žádné pokoje"}
              </Typography>
              <Typography variant="body2">
                {"Klikněte na \"Přidat pokoj\" pro vytvoření prvního pokoje"}
              </Typography>
            </Box>
          )}
        </Stack>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingRoom ? "Upravit pokoj" : "Přidat nový pokoj"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Základní informace */}
            <Typography variant="h6" sx={{ mb: -1 }}>Základní informace</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Název pokoje (čeština)"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Název pokoje (i18n)"
                  value={formData.name_i18n}
                  onChange={(e) => setFormData({...formData, name_i18n: e.target.value})}
                  fullWidth
                  helperText="Překlady názvu pro jiné jazyky"
                />
              </Grid>
            </Grid>

            <TextField
              label="Popis pokoje (čeština)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              fullWidth
              multiline
              rows={3}
              required
            />

            <TextField
              label="Popis pokoje (i18n)"
              value={formData.description_i18n}
              onChange={(e) => setFormData({...formData, description_i18n: e.target.value})}
              fullWidth
              multiline
              rows={2}
              helperText="Překlady popisu pro jiné jazyky"
            />

            {/* Kapacita */}
            <Typography variant="h6" sx={{ mb: -1, mt: 2 }}>Kapacita</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Max dospělých"
                  value={formData.max_adults}
                  onChange={(e) => setFormData({...formData, max_adults: e.target.value})}
                  fullWidth
                  type="number"
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Max dětí"
                  value={formData.max_children}
                  onChange={(e) => setFormData({...formData, max_children: e.target.value})}
                  fullWidth
                  type="number"
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Celková kapacita"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  fullWidth
                  type="number"
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>

            {/* Ceny */}
            <Typography variant="h6" sx={{ mb: -1, mt: 2 }}>Ceny</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cena za dospělého"
                  value={formData.price_for_adult}
                  onChange={(e) => setFormData({...formData, price_for_adult: e.target.value})}
                  fullWidth
                  type="number"
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Kč</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cena za dítě"
                  value={formData.price_for_children}
                  onChange={(e) => setFormData({...formData, price_for_children: e.target.value})}
                  fullWidth
                  type="number"
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Kč</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>

            {/* Status */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body1">Aktivní pokoj:</Typography>
              <Button
                variant={formData.is_active ? "contained" : "outlined"}
                onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                color={formData.is_active ? "success" : "default"}
              >
                {formData.is_active ? "Aktivní" : "Neaktivní"}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<Cancel />} disabled={isUpdating}>
            Zrušit
          </Button>
          <Button 
            onClick={handleSaveRoom} 
            variant="contained" 
            startIcon={<Save />}
            disabled={
              isUpdating ||
              !formData.name || 
              !formData.description || 
              !formData.max_adults || 
              !formData.max_children || 
              !formData.capacity ||
              !formData.price_for_adult || 
              !formData.price_for_children
            }
          >
            {isUpdating 
              ? "Ukládání..." 
              : (editingRoom ? "Uložit změny" : "Přidat pokoj")
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteRoom}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Smazat pokoj</DialogTitle>
        <DialogContent>
          <Typography>
            Opravdu chcete smazat tento pokoj? Tato akce nelze vrátit zpět.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteRoom}>
            Zrušit
          </Button>
          <Button 
            onClick={confirmDeleteRoom} 
            color="error" 
            variant="contained"
          >
            Smazat
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
