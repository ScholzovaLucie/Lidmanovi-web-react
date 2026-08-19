import { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Stack, Typography, Button, Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import RoomCard from "../../../Reservation/components/RoomCard";
import {
  useAdminRoomsQuery,
  useUpdateRoomMutation,
  useCreateRoomMutation,
  useDeleteRoomMutation,
} from "../../../../redux/api/roomsApi";
import RoomEditDialog from "./components/RoomEditDialog";
import RoomDeleteDialog from "./components/RoomDeleteDialog";
import AddRoomCard from "./components/AddRoomCard";
import { DEFAULT_ROOM_AMENITIES } from "../../../../utils/roomAmenityIcons";

export default function RoomsSection() {
  // Check auth token
  const authToken = useSelector((state) => state.app.auth.accessToken);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    name_i18n: {},
    max_adults: 0,
    max_children: 0,
    capacity: 0,
    description: "",
    description_i18n: {},
    price_for_adult: 0,
    price_for_children: 0,
    is_active: true,
    amenities: DEFAULT_ROOM_AMENITIES,
  });

  // Načítání pokojů z API
  const {
    data: roomsResponse,
    isLoading,
    error,
  } = useAdminRoomsQuery({ page: 1, page_size: 50 });

  // Update and create room mutations
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();

  const rooms = roomsResponse?.results || [];

  const handleClearSearch = () => {
    // Removed search functionality
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || "",
      name_i18n: room.name_i18n || {},
      max_adults: room.max_adults || 0,
      max_children: room.max_children || 0,
      capacity: room.capacity || 0,
      description: room.description || "",
      description_i18n: room.description_i18n || {},
      price_for_adult: room.price_for_adult?.toString() || "",
      price_for_children: room.price_for_children?.toString() || "",
      is_active: room.is_active !== undefined ? room.is_active : true,
      amenities:
        room.amenities && room.amenities.length > 0
          ? room.amenities
          : DEFAULT_ROOM_AMENITIES,
    });
    setEditDialogOpen(true);
  };

  const handleAddNewRoom = () => {
    setEditingRoom(null);
    setFormData({
      name: "",
      name_i18n: {},
      max_adults: 0,
      max_children: 0,
      capacity: 0,
      description: "",
      description_i18n: {},
      price_for_adult: 0,
      price_for_children: 0,
      is_active: true,
      amenities: DEFAULT_ROOM_AMENITIES,
    });
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditingRoom(null);
    setFormData({
      name: "",
      name_i18n: {},
      max_adults: 0,
      max_children: 0,
      capacity: 0,
      description: "",
      description_i18n: {},
      price_for_adult: 0,
      price_for_children: 0,
      is_active: true,
      amenities: DEFAULT_ROOM_AMENITIES,
    });
  };

  const handleSaveRoom = async () => {
    try {
      const maxAdults = parseInt(formData.max_adults) || 0;
      const maxChildren = parseInt(formData.max_children) || 0;
      const capacity = Math.max(maxAdults, maxChildren);

      const roomData = {
        name: formData.name,
        name_i18n: formData.name_i18n,
        max_adults: maxAdults,
        max_children: maxChildren,
        capacity: capacity,
        description: formData.description,
        description_i18n: formData.description_i18n,
        price_for_adult: parseInt(formData.price_for_adult) || 0,
        price_for_children: parseInt(formData.price_for_children) || 0,
        is_active: formData.is_active,
        amenities: formData.amenities || [],
      };

      if (editingRoom) {
        // Editing existing room - use PUT
        await updateRoom({ id: editingRoom.id, ...roomData }).unwrap();
      } else {
        // Creating new room - use POST
        await createRoom(roomData).unwrap();
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  const handleDeleteRoom = (roomId) => {
    setDeletingRoomId(roomId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRoom = async () => {
    try {
      await deleteRoom(deletingRoomId).unwrap();
      setDeleteDialogOpen(false);
      setDeletingRoomId(null);
    } catch (error) {
      console.error("Error deleting room:", error);
      // Můžete přidat toast notifikaci nebo jiné zobrazení chyby
    }
  };

  const cancelDeleteRoom = () => {
    setDeleteDialogOpen(false);
    setDeletingRoomId(null);
  };


  return (
    <Stack p={{ md: 3 }} spacing={2}>
      <Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" gutterBottom>
            Pokoje
          </Typography>
        </Stack>
        <Typography variant="body1">
          Zde můžete spravovat informace o pokojích, které nabízíte. Přidávejte
          nové pokoje, upravujte stávající nebo odstraňujte ty, které již
          nenabízíte. Můžete také nastavit ceny, popisy a fotografie pro každý
          pokoj.
        </Typography>
      </Stack>

      <Stack spacing={4}>
        {/* Add button */}
        <Stack direction="row" justifyContent="flex-end"></Stack>

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
              Zpráva:{" "}
              {error?.data?.message || error?.data?.detail || "Neznámá chyba"}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {rooms.map((room) => (
              <Grid key={room.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <RoomCard
                  room={room}
                  isAdminMode={true}
                  onEdit={handleEditRoom}
                  onDelete={handleDeleteRoom}
                />
              </Grid>
            ))}
            <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: "flex", flexGrow: 1, maxWidth: 370 }}>
              <AddRoomCard onClick={handleAddNewRoom} />
            </Grid>
          </Grid>
        )}
      </Stack>

      <RoomEditDialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        editingRoom={editingRoom}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveRoom}
        isUpdating={isUpdating || isCreating}
      />

      <RoomDeleteDialog
        open={deleteDialogOpen}
        onCancel={cancelDeleteRoom}
        onConfirm={confirmDeleteRoom}
      />
    </Stack>
  );
}
