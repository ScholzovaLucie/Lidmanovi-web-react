import React from "react";
import { Box, Container, Divider, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import FullBleedTiles from "../components/FullBleedTiles.jsx";
import EditableTranslationText from "../components/EditableTranslationText";
import SubpageBanner from "../components/SubpageBanner.jsx";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";

export default function Accommodations() {
  const { t } = useTranslation("ubytovani");
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
  const sharedSectionSx = {
    position: "relative",
    maxWidth: 920,
    mx: "auto",
    px: { xs: 3, md: 5 },
    py: { xs: 3.5, md: 4.5 },
    borderTop: "1px solid rgba(85,116,143,0.12)",
    borderBottom: "1px solid rgba(85,116,143,0.12)",
    background: "rgba(255,255,255,0.72)",
    boxShadow: "none",
    outline: isAuthenticated ? "1px dashed" : "none",
    outlineColor: isAuthenticated ? "secondary.main" : "transparent",
  };

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
        <Box sx={{ display: "grid", gap: { xs: 3, md: 4 } }}>
          <Paper sx={sharedSectionSx}>
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
              i18nKey="openingHours.pension"
              variant="h5"
              sx={{
                mb: 0.5,
                textAlign: "center",
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 400,
              }}
              align="center"
            />
            <EditableTranslationText
              ns="ubytovani"
              i18nKey="openingHours.restaurantTitle"
              variant="h5"
              sx={{
                mb: 2.5,
                textAlign: "center",
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 400,
              }}
              align="center"
            />

            <Box sx={{ maxWidth: 520, mx: "auto", textAlign: "center", mb: 3 }}>
              <EditableTranslationText
                ns="ubytovani"
                i18nKey="openingHours.monThu"
                variant="h6"
                sx={{ fontWeight: 600, mb: 0.6 }}
                align="center"
              />
              <EditableTranslationText ns="ubytovani" i18nKey="openingHours.fri" align="center" sx={{ color: "text.secondary" }} />
              <EditableTranslationText ns="ubytovani" i18nKey="openingHours.sat" align="center" sx={{ color: "text.secondary" }} />
              <EditableTranslationText ns="ubytovani" i18nKey="openingHours.sun" align="center" sx={{ color: "text.secondary" }} />
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <EditableTranslationText
              ns="ubytovani"
              i18nKey="openingHours.note"
              variant="body1"
              sx={{
                maxWidth: 760,
                mx: "auto",
                textAlign: "center",
                color: "text.secondary",
                fontStyle: "italic",
              }}
              align="center"
            />
          </Paper>

          <Paper sx={sharedSectionSx}>
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
              sx={{
                mb: 2.5,
                textAlign: "center",
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 400,
              }}
              align="center"
            />

            <Box sx={{ maxWidth: 760, mx: "auto" }}>
              <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item1" sx={{ mb: 1.2, textAlign: "center", color: "text.secondary" }} align="center" />
              <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item2" sx={{ mb: 1.2, textAlign: "center", color: "text.secondary" }} align="center" />
              <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item3" sx={{ mb: 1.2, textAlign: "center", color: "text.secondary" }} align="center" />
              <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item4" sx={{ mb: 1.2, textAlign: "center", color: "text.secondary" }} align="center" />
              <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item5" sx={{ textAlign: "center", color: "text.secondary" }} align="center" />
            </Box>

            <Divider sx={{ my: 2.5, maxWidth: 760, mx: "auto" }} />

            <EditableTranslationText
              ns="ubytovani"
              i18nKey="catering.title"
              variant="h5"
              sx={{
                mb: 1,
                textAlign: "center",
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 400,
              }}
              align="center"
            />
            <EditableTranslationText
              ns="ubytovani"
              i18nKey="catering.text"
              sx={{ maxWidth: 760, mx: "auto", textAlign: "center", color: "text.secondary" }}
              align="center"
            />
          </Paper>
        </Box>
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
