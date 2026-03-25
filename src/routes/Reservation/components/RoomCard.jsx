import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import { BathtubOutlined, SpaOutlined, Wifi, Edit, Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  addRoom,
  removeRoom,
} from "../../../redux/slices/reservation/reservationSlice";
import IconWithText from "../../../components/IconWithText";
import CollapsableText from "./CollapsableText";
import Price from "./Price";
import { useTranslation } from "react-i18next";

export default function RoomCard({ room, selected, onEdit, onDelete, isAdminMode = false }) {
  const { t } = useTranslation("rezervace");
  const dispatch = useDispatch();

  return (
    <AppCardCustomizable>
      <Box maxWidth={370} sx={{ position: "relative" }}>
        {/* Admin akce */}
        {isAdminMode && (onEdit || onDelete) && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              display: "flex",
              gap: 1,
            }}
          >
            {onEdit && (
              <IconButton
                size="small"
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
                size="small"
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
          src="https://www.thespruce.com/thmb/Afg3IVBq0tV-7DHBME5woSNCZxQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/put-together-a-perfect-guest-room-1976987-hero-223e3e8f697e4b13b62ad4fe898d492d.jpg"
          alt="Room"
          style={{
            width: "100%",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
        <Stack alignItems={"start"} spacing={3} flex={1} padding={3}>
          {/* top */}
          <Stack alignItems={"start"} spacing={1.5} width={"100%"}>
            <Typography fontSize={24} fontWeight={"bold"}>
              {room.name}
            </Typography>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <IconWithText
                Icon={Wifi}
                iconProps={{ fontSize: "16" }}
                text="Wi-Fi"
              />
              <IconWithText
                Icon={SpaOutlined}
                iconProps={{ fontSize: "16" }}
                text={t("roomCard.towels")}
              />
              <IconWithText
                Icon={BathtubOutlined}
                iconProps={{ fontSize: "16" }}
                text={t("roomCard.bathroom")}
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
            justifyContent={isAdminMode ? "flex-start" : "space-between"}
          >
            <Price room={room} />
            {!isAdminMode && (
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
