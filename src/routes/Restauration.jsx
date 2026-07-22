import React from "react";
import { Box, Container, Divider, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import FullBleedTiles from "../components/FullBleedTiles.jsx";
import EditableTranslationText from "../components/EditableTranslationText";
import SubpageBanner from "../components/SubpageBanner.jsx";
import PhotoEditBadge from "../components/PhotoEditBadge.jsx";
import { usePhotoSequence } from "../hooks/usePhotoSequence.js";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";

export default function Restauration() {
  const { t } = useTranslation("restaurace");
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
  const editableAreaSx = {
    "& > .MuiBox-root": {
      borderColor: "secondary.main",
      backgroundColor: "rgba(255,253,248,0.84)",
    },
  };
  const { urls: introSlides } = usePhotoSequence("restaurace-uvod", [
    "/restaurace/restaurace2.webp",
    "/restaurace/restaurace3.webp",
    "/restaurace/restaurace4.webp",
    "/restaurace/restaurace5.webp",
  ]);
  const { urls: tile1Urls } = usePhotoSequence("restaurace-tile-1", [
    asset("galerie/exterier/012_HZ6_3793_Penzion_U_Lidmanu.webp"),
  ]);
  const { urls: tile2Urls } = usePhotoSequence("restaurace-tile-2", [
    asset("galerie/interier/088_HZ6_3958_Penzion_U_Lidmanu.webp"),
  ]);
  const { urls: tile3Urls } = usePhotoSequence("restaurace-tile-3", [
    asset("galerie/sal/110_HZ6_3997_Penzion_U_Lidmanu.webp"),
  ]);

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <SubpageBanner
          eyebrow={t("pageTitle")}
          title={t("pageTitle")}
          slides={introSlides}
        />
        <PhotoEditBadge location="restaurace-uvod" singlePhoto={false} sx={{ top: 16, right: 16, zIndex: 10 }} />
      </Box>
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 5, md: 7 } }}
        id="oteviraciDoba"
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "start",
          }}
        >
          <Box sx={{ pt: { md: 0.5 }, ...editableAreaSx }}>
            <EditableTranslationText
              ns="restaurace"
              i18nKey="pageTitle"
              variant="h2"
              sx={{ mb: 2 }}
            />
            <EditableTranslationText
              ns="restaurace"
              i18nKey="tiles.0.text"
              variant="body1"
              sx={{ color: "text.secondary", maxWidth: 620 }}
              multilineRows={5}
            />
            <Box
              sx={{
                mt: 3,
                borderLeft: "4px solid",
                borderColor: "primary.main",
                bgcolor: "primary.50",
                px: 2.5,
                py: 2,
                ...editableAreaSx,
              }}
            >
              <EditableTranslationText
                ns="restaurace"
                i18nKey="openingHours.note"
                variant="body2"
                sx={{ color: "primary.dark", fontStyle: "italic" }}
              />
            </Box>
          </Box>

          <Paper
            sx={{
              position: "relative",
              p: { xs: 3, md: 4 },
              border: "1px solid",
              borderColor: isAuthenticated ? "secondary.main" : "#dfd4c4",
              boxShadow: "none",
              background: "background.paper",
              outline: isAuthenticated ? "1px dashed" : "none",
              outlineColor: isAuthenticated ? "secondary.main" : "transparent",
              ...editableAreaSx,
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
              ns="restaurace"
              i18nKey="openingHours.heading"
              variant="subtitle1"
              sx={{ fontWeight: 700, mb: 2.5, color: "text.secondary" }}
            />

            <Box sx={{ mb: 3 }}>
              <EditableTranslationText ns="restaurace" i18nKey="openingHours.summer.season" variant="h5" sx={{ fontWeight: 400, mb: 1 }} />
              <EditableTranslationText ns="restaurace" i18nKey="openingHours.summer.fri" />
              <EditableTranslationText ns="restaurace" i18nKey="openingHours.summer.sat" />
              <EditableTranslationText ns="restaurace" i18nKey="openingHours.summer.sun" />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <EditableTranslationText ns="restaurace" i18nKey="openingHours.winter.season" variant="h5" sx={{ fontWeight: 400, mb: 1 }} />
              <EditableTranslationText ns="restaurace" i18nKey="openingHours.winter.fri" />
              <EditableTranslationText ns="restaurace" i18nKey="openingHours.winter.sat" />
              <EditableTranslationText ns="restaurace" i18nKey="openingHours.winter.sun" />
            </Box>
          </Paper>
        </Box>
      </Container>

      <FullBleedTiles
        fullBleedHack
        variant="cards"
        translationNamespace="restaurace"
        imageAspect={{ xs: "16 / 10", md: "16 / 10" }}
        items={[
          {
            image: tile1Urls[0],
            photoLocation: "restaurace-tile-1",
            titleKey: "tiles.1.alt",
            textKey: "tiles.1.text",
            alt: t("tiles.1.alt"),
          },
          {
            image: tile2Urls[0],
            photoLocation: "restaurace-tile-2",
            titleKey: "tiles.2.alt",
            textKey: "tiles.2.text",
            alt: t("tiles.2.alt"),
          },
          {
            image: tile3Urls[0],
            photoLocation: "restaurace-tile-3",
            titleKey: "tiles.3.alt",
            textKey: "tiles.3.text",
            alt: t("tiles.3.alt"),
          },
        ]}
      />
    </>
  );
}
