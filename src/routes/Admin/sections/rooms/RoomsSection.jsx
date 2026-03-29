import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Box, Stack, Typography, Button, Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import RoomCard from "../../../Reservation/components/RoomCard";
import {
  useAdminRoomsQuery,
  useUpdateRoomMutation,
} from "../../../../redux/api/roomsApi";
import RoomEditDialog from "./components/RoomEditDialog";
import RoomDeleteDialog from "./components/RoomDeleteDialog";
import AddRoomCard from "./components/AddRoomCard";

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
      console.log("Create room functionality not implemented yet");
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
      console.error("Error updating room:", error);
    }
  };

  const handleDeleteRoom = (roomId) => {
    setDeletingRoomId(roomId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRoom = () => {
    // TODO: Implementovat API call pro smazání
    console.log("Delete room:", deletingRoomId);
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
    <Stack p={{ xs: 1, md: 3 }} spacing={2}>
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
            {filteredRooms.map((room) => (
              <Grid item key={room.id} xs={12} sm={6} md={4}>
                <RoomCard
                  room={room}
                  isAdminMode={true}
                  onEdit={handleEditRoom}
                  onDelete={handleDeleteRoom}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
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
        isUpdating={isUpdating}
      />

      <RoomDeleteDialog
        open={deleteDialogOpen}
        onCancel={cancelDeleteRoom}
        onConfirm={confirmDeleteRoom}
      />
    </Stack>
  );
}
