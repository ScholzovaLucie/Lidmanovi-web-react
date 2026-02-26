import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import HeroCarousel from "../components/HeroCarousel.jsx"; // používáme tvůj existující
import Paper from "@mui/material/Paper";
import { useTranslation } from "react-i18next";

export default function Weddings() {
  const { t } = useTranslation("svatby");
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  return (
    <>
      {/* HERO – můžeš dát 1+ fotek, auto-rotace jako jinde */}
      <HeroCarousel
        slides={[
          { src: asset("/svatba/svatba3.webp") },
          { src: asset("/svatba/svatba4.webp") },
          { src: asset("/svatba/svatba5.webp") },
          { src: asset("/svatba/svatba6.webp") },
          { src: asset("/svatba/svatba7.webp") },
          { src: asset("/svatba/svatba8.webp") },
          { src: asset("/svatba/svatba9.webp") },
          { src: asset("/svatba/svatba1.webp") },
        ]}
        interval={4000}
        transition={600}
        gradientTop="secondary.main"
      />

      {/* Sekce v boxu */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 4 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Úvodní text */}
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: 600,
              mb: { xs: 3, md: 4 },
            }}
          >
            {t("intro")}
          </Typography>

          {/* Seznam výhod */}
          <List
            sx={{
              width: "100%",
              maxWidth: 760,
              textAlign: "center",
              mx: "auto",
              "& .MuiListItem-root": { py: 1 },
            }}
          >
            <ListItem disableGutters>
              <ListItemText
                primary={`${t("ceremonyTitle")} - ${t("ceremonyText")}`}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary={`${t("cateringTitle")} - ${t("cateringText")}`}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary={`${t("accommodationTitle")} - ${t(
                  "accommodationText",
                )}`}
              />
            </ListItem>
          </List>

          {/* Dekorativní srdce uvnitř boxu */}
          <Box
            component="img"
            src={asset("/two-hearts_roh_hnedy.webp")}
            alt=""
            sx={{
              position: "absolute",
              right: { xs: 0, md: 0 },
              bottom: { xs: 0, md: 0 },
              width: { xs: "20vw", md: "16vw" },
              opacity: 0.85,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </Paper>
      </Container>
    </>
  );
}
