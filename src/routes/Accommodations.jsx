import React from "react";
import FullBleedTiles from "../components/FullBleedTiles.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";
import { Container, Paper, Box, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";
import EditableTranslationText from "../components/EditableTranslationText";

export default function Accommodations() {
  const { t } = useTranslation("ubytovani");
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  return (
    <>
      <HeroCarousel
        slides={[
          {
            src: asset("/ubytovani/ubytovani2.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani3.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani4.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani5.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani6.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani7.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani1.webp"),
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
            position: "relative",
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            boxShadow: (theme) => `0 1px 4px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.2)'}`,
            textAlign: "center",
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
          {/* Nadpis */}
          <EditableTranslationText
            ns="ubytovani"
            i18nKey="openingHours.pension"
            variant="h5"
            sx={{ fontWeight: 700, mb: 1 }}
            align="center"
          />
          <EditableTranslationText
            ns="ubytovani"
            i18nKey="openingHours.restaurantTitle"
            variant="h5"
            sx={{ fontWeight: 700, mb: 2 }}
            align="center"
          />

          <Box sx={{ mb: 3 }}>
            <EditableTranslationText ns="ubytovani" i18nKey="openingHours.monThu" variant="h6" sx={{ fontWeight: 600 }} align="center" />
            <EditableTranslationText ns="ubytovani" i18nKey="openingHours.fri" align="center" />
            <EditableTranslationText ns="ubytovani" i18nKey="openingHours.sat" align="center" />
            <EditableTranslationText ns="ubytovani" i18nKey="openingHours.sun" align="center" />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Nabídka speciálních akcí */}
          <EditableTranslationText
            ns="ubytovani"
            i18nKey="openingHours.note"
            variant="body1"
            sx={{ mt: 2, fontStyle: "italic" }}
            align="center"
          />
        </Paper>
      </Container>

      <Container maxWidth="md" sx={{ pb: { xs: 4, md: 6 } }}>
        <Paper
          variant="outlined"
          sx={{
            position: "relative",
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            boxShadow: (theme) =>
              `0 1px 4px ${
                theme.palette.mode === "light"
                  ? "rgba(0,0,0,0.04)"
                  : "rgba(0,0,0,0.2)"
              }`,
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
          <EditableTranslationText
            ns="ubytovani"
            i18nKey="additionalInfo.title"
            variant="h5"
            sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
            align="center"
          />
          <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item1" sx={{ mb: 1 }} />
          <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item2" sx={{ mb: 1 }} />
          <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item3" sx={{ mb: 1 }} />
          <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item4" sx={{ mb: 1 }} />
          <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item5" />

          <Divider sx={{ my: 2 }} />

          <EditableTranslationText
            ns="ubytovani"
            i18nKey="catering.title"
            variant="h5"
            sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}
            align="center"
          />
          <EditableTranslationText ns="ubytovani" i18nKey="catering.text" />
        </Paper>
      </Container>

      <FullBleedTiles
        fullBleedHack
        translationNamespace="ubytovani"
        items={[
          {
            image: asset("/ubytovani/ubytovani1.webp"),
            textKey: "tiles.0.text",
            alt: t("tiles.0.alt"),
          },
          {
            image: asset("/ubytovani/ubytovani3.webp"),
            textKey: "tiles.1.text",
            alt: t("tiles.1.alt"),
          },
          {
            image: asset("/ubytovani/ubytovani5.webp"),
            textKey: "tiles.2.text",
            alt: t("tiles.2.alt"),
          },
          {
            image: asset("/ubytovani/ubytovani7.webp"),
            textKey: "tiles.3.text",
            alt: t("tiles.3.alt"),
          },
        ]}
      />
    </>
  );
}
