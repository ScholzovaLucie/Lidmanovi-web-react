import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import HeroCarousel from "../components/HeroCarousel.jsx"; // používáme tvůj existující
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";
import EditableTranslationText from "../components/EditableTranslationText";

export default function Weddings() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
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
            position: "relative",
            p: { xs: 2, md: 4 },
            overflow: "hidden",
            borderColor: isAuthenticated ? "secondary.main" : undefined,
            outline: isAuthenticated ? "1px dashed" : "none",
            outlineColor: isAuthenticated ? "secondary.main" : "transparent",
          }}
        >
          {isAuthenticated && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: "secondary.main",
                color: "secondary.contrastText",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              Editovatelný blok
            </Box>
          )}
          {/* Úvodní text */}
          <EditableTranslationText
            ns="svatby"
            i18nKey="intro"
            variant="h5"
            sx={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              fontWeight: 600,
              mb: { xs: 3, md: 4 },
            }}
            align="center"
            multilineRows={4}
          />

          {/* Seznam výhod */}
          <List
            sx={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 760,
              textAlign: "center",
              mx: "auto",
              "& .MuiListItem-root": { py: 1 },
            }}
          >
            <ListItem disableGutters>
              <ListItemText
                primary={
                  <>
                    <EditableTranslationText ns="svatby" i18nKey="ceremonyTitle" align="center" />
                    <EditableTranslationText ns="svatby" i18nKey="ceremonyText" align="center" />
                  </>
                }
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary={
                  <>
                    <EditableTranslationText ns="svatby" i18nKey="cateringTitle" align="center" />
                    <EditableTranslationText ns="svatby" i18nKey="cateringText" align="center" />
                  </>
                }
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText
                primary={
                  <>
                    <EditableTranslationText ns="svatby" i18nKey="accommodationTitle" align="center" />
                    <EditableTranslationText ns="svatby" i18nKey="accommodationText" align="center" />
                  </>
                }
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
              maxWidth: 220,
              opacity: 0.35,
              zIndex: 0,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </Paper>
      </Container>
    </>
  );
}
