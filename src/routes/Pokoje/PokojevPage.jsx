import { Box, Container, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import SubpageBanner from "../../components/SubpageBanner.jsx";
import RoomCard from "../Reservation/components/RoomCard.jsx";
import { useRoomsQuery } from "../../redux/api/roomsApi.js";

export default function PokojevPage() {
  const { t } = useTranslation("pokoje");
  const { data, isLoading, error } = useRoomsQuery();

  const rooms = (data?.results ?? (Array.isArray(data) ? data : [])).filter(
    (r) => r.is_active,
  );

  return (
    <>
      <SubpageBanner
        eyebrow={t("pageTitle")}
        title={t("heading")}
        subtitle={t("intro")}
        image="/ubytovani/ubytovani2.webp"
        slides={[
          "/ubytovani/ubytovani2.webp",
          "/ubytovani/ubytovani3.webp",
          "/ubytovani/ubytovani5.webp",
          "/ubytovani/ubytovani7.webp",
        ]}
      />
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary">{t("loading")}</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="error">{t("error")}</Typography>
          </Box>
        ) : rooms.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary">{t("empty")}</Typography>
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {rooms.map((room) => (
              <Grid item key={room.id} xs={12} sm={6} md={4}>
                <RoomCard room={room} isReadOnly />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
