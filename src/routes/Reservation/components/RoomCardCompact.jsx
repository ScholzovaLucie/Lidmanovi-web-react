import { IconButton, Stack, Typography } from "@mui/material";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import { useDispatch } from "react-redux";
import { removeRoom } from "../../../redux/slices/reservation/reservationSlice";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";

export function RoomCartCompactCard({ room }) {
  const dispatch = useDispatch();

  return (
    <AppCardCustomizable>
      <img
        src="https://www.thespruce.com/thmb/Afg3IVBq0tV-7DHBME5woSNCZxQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/put-together-a-perfect-guest-room-1976987-hero-223e3e8f697e4b13b62ad4fe898d492d.jpg"
        alt="Room"
        style={{
          width: "100%",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        p={1.5}
      >
        <Stack spacing={0.5} minWidth={0} alignItems={"start"}>
          <Typography fontWeight="bold" lineHeight="20px">
            {room.name}
          </Typography>
          <Typography fontSize={13} color="text.secondary" lineHeight="16px">
            {room.price_for_adult} Kč / dospělý
          </Typography>
          <Typography fontSize={13} color="text.secondary" lineHeight="16px">
            {room.price_for_children} Kč / dítě
          </Typography>
        </Stack>

        <IconButton
          variant="filled"
          size="small"
          onClick={() => dispatch(removeRoom(room.id))}
          color="error"
        >
          <DeleteIconOutline />
        </IconButton>
      </Stack>
    </AppCardCustomizable>
  );
}
