import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import {
  BathtubOutlined,
  SpaOutlined,
  Wifi,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  addRoom,
  removeRoom,
} from "../../../redux/slices/reservation/reservationSlice";
import IconWithText from "../../../components/IconWithText";
import CollapsableText from "./CollapsableText";
import Price from "./Price";
import { useTranslation } from "react-i18next";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import { usePhotoSequence } from "../../../hooks/usePhotoSequence";

export default function RoomCard({
  room,
  selected,
  onEdit,
  onDelete,
  isAdminMode = false,
  isReadOnly = false,
  fillHeight = false,
}) {
  const { t } = useTranslation("rezervace");
  const dispatch = useDispatch();
  const photoLocation = `pokoj-${room.id}`;
  const { urls: roomPhotoUrls, alts: roomPhotoAlts } = usePhotoSequence(photoLocation, [
    `${import.meta.env.BASE_URL}ubytovani/ubytovani1.webp`,
  ]);

  return (
    <AppCardCustomizable props={fillHeight ? { height: "100%" } : undefined}>
      <Box
        maxWidth={370}
        sx={{
          position: "relative",
          ...(fillHeight && { height: "100%", display: "flex", flexDirection: "column" }),
        }}
      >
        {/* Inactive overlay */}
        {!room.is_active && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              borderRadius: 1,
              bgcolor: "rgba(180,180,180,0.55)",
              backdropFilter: "grayscale(1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          />
        )}
        {/* Admin akce */}
        {isAdminMode && (onEdit || onDelete) && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 4,
              display: "flex",
              gap: 1,
            }}
          >
            {onEdit && (
              <IconButton
                size="large"
                onClick={() => onEdit(room)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  color: "primary.main",
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="large"
                onClick={() => onDelete(room.id)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  color: "error.main",
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}

        <img
          src={roomPhotoUrls[0]}
          alt={roomPhotoAlts[0] || room.name || "Room"}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            objectFit: "cover",
            display: "block",
          }}
        />
        <Stack
          alignItems={"start"}
          justifyContent="space-between"
          spacing={3}
          flex={1}
          padding={3}
        >
          {/* top */}
          <Stack alignItems={"start"} spacing={1.5} width={"100%"}>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 30,
                fontWeight: 400,
              }}
              textAlign={"start"}
            >
              {room.name}
            </Typography>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <IconWithText
                Icon={HotelOutlinedIcon}
                iconProps={{ fontSize: "16" }}
                text={`${room.capacity} ${t("roomCard.beds")}`}
              />

              <IconWithText
                Icon={BathtubOutlined}
                iconProps={{ fontSize: "16" }}
                text={t("roomCard.bathroom")}
              />

              <IconWithText
                Icon={Wifi}
                iconProps={{ fontSize: "16" }}
                text="Wi-Fi"
              />
            </Stack>

            <CollapsableText text={room.description} />
          </Stack>
          {/* top */}

          {/* price */}
          <Stack
            width={"100%"}
            direction={"row"}
            alignItems={"end"}
            justifyContent={isAdminMode || isReadOnly ? "flex-start" : "space-between"}
          >
            <Price room={room} />
            {!isAdminMode && !isReadOnly && (
              <Button
                variant="contained"
                size="large"
                color={selected ? "error" : "primary"}
                onClick={() => {
                  selected
                    ? dispatch(removeRoom(room.id))
                    : dispatch(addRoom(room));
                }}
              >
                {selected ? t("roomCard.remove") : t("roomCard.select")}
              </Button>
            )}
          </Stack>
        </Stack>
        {/* price */}
      </Box>
    </AppCardCustomizable>
  );
}
