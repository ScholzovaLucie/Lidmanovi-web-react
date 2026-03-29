import { Stack, Typography } from "@mui/material";
import { RoomCartCompactCard } from "./RoomCardCompact";
import { useSelector } from "react-redux";
import { t } from "i18next";
import {useTranslation} from 'react-i18next';

export default function Cart() {
  const values = useSelector((state) => state.reservation.values);
  const { t } = useTranslation("rezervace");

  return (
    <Stack p={3} spacing={2} width={300} alignItems={"center"}>
      <Typography variant="h6" fontWeight={"bold"}>
        {t("layout.selectedRooms")}
      </Typography>
      {values.rooms.length === 0 ? (
        <Typography variant="body1">{t("layout.noRoomSelected")}</Typography>
      ) : (
        <Stack spacing={1.5}>
          {values.rooms.map((room) => (
            <RoomCartCompactCard key={room.id} room={room} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
