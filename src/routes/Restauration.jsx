import React from "react";
import FullBleedTiles from "../components/FullBleedTiles.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";
import { Container, Paper, Typography, Box, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Restauration() {
  const { t } = useTranslation("restaurace");
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  return (
    <>
      <HeroCarousel
        slides={[
          {
            src: asset("/restaurace/restaurace2.webp"),
          },
          {
            src: asset("/restaurace/restaurace3.webp"),
          },
          {
            src: asset("/restaurace/restaurace4.webp"),
          },
          {
            src: asset("/restaurace/restaurace5.webp"),
          },
          {
            src: asset("/restaurace/restaurace1.webp"),
          },
          {
            src: asset("/restaurace/br1733.webp"),
          },
          {
            src: asset(
              "/restaurace/007_HZ6_4294_Setkani_U_Lidmanu_MASJABLON_podzim22.webp"
            ),
          },
          {
            src: asset(
              "/restaurace/010_HZ6_4311_Setkani_U_Lidmanu_MASJABLON_podzim22.webp"
            ),
          },
        ]}
        interval={2000} // změň třeba na 4000 pro rychlejší střídání
        transition={100} // délka fade
        gradientTop="secondary.main"
      />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }} id="oteviraciDoba">
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            boxShadow: (theme) => `0 1px 4px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.2)'}`,
            textAlign: "center",
          }}
        >
          {/* Nadpis */}
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {t("openingHours.heading")}
          </Typography>

          {/* Letní období */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t("openingHours.summer.season")}
            </Typography>
            <Typography>{t("openingHours.summer.fri")}</Typography>
            <Typography>{t("openingHours.summer.sat")}</Typography>
            <Typography>{t("openingHours.summer.sun")}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Zimní období */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t("openingHours.winter.season")}
            </Typography>
            <Typography>{t("openingHours.winter.fri")}</Typography>
            <Typography>{t("openingHours.winter.sat")}</Typography>
            <Typography>{t("openingHours.winter.sun")}</Typography>
          </Box>

          {/* Nabídka speciálních akcí */}
          <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic" }}>
            {t("openingHours.note")}
          </Typography>
        </Paper>
      </Container>

      <FullBleedTiles
        fullBleedHack
        items={[
          {
            image: asset(
              "galerie/interier/100_HZ6_3979_Penzion_U_Lidmanu.webp"
            ),
            text: t("tiles.0.text"),
            alt: t("tiles.0.alt"),
          },
          {
            image: asset(
              "galerie/exterier/012_HZ6_3793_Penzion_U_Lidmanu.webp"
            ),
            text: t("tiles.1.text"),
            alt: t("tiles.1.alt"),
          },
          {
            image: asset(
              "galerie/interier/088_HZ6_3958_Penzion_U_Lidmanu.webp"
            ),
            text: t("tiles.2.text"),
            alt: t("tiles.2.alt"),
          },
          {
            image: asset("galerie/sal/110_HZ6_3997_Penzion_U_Lidmanu.webp"),
            text: t("tiles.3.text"),
            alt: t("tiles.3.alt"),
          },
        ]}
      />
    </>
  );
}
