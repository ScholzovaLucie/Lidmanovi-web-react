import React from "react";
import { Box, Container, Divider, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import FullBleedTiles from "../components/FullBleedTiles.jsx";
import EditableTranslationText from "../components/EditableTranslationText";
import SubpageBanner from "../components/SubpageBanner.jsx";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";

export default function Restauration() {
  const { t } = useTranslation("restaurace");
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  return (
    <>
      <SubpageBanner
        eyebrow={t("pageTitle")}
        title={t("pageTitle")}
        image="/restaurace/restaurace2.webp"
        slides={[
          "/restaurace/restaurace2.webp",
          "/restaurace/restaurace3.webp",
          "/restaurace/restaurace4.webp",
          "/restaurace/restaurace5.webp",
        ]}
      />
      <Container
        maxWidth="md"
        sx={{ pt: { xs: 4, md: 5 }, pb: { xs: 5, md: 7 } }}
        id="oteviraciDoba"
      >
        <Paper
          sx={{
            position: "relative",
            p: { xs: 3, md: 4 },
            textAlign: "center",
            border: "1px solid",
            borderColor: isAuthenticated ? "secondary.main" : "rgba(85,116,143,0.12)",
            boxShadow: "none",
            background: "rgba(255,255,255,0.96)",
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
            ns="restaurace"
            i18nKey="openingHours.heading"
            variant="h5"
            sx={{ fontWeight: 400, mb: 2.5 }}
            align="center"
          />

          <Box sx={{ mb: 3 }}>
            <EditableTranslationText ns="restaurace" i18nKey="openingHours.summer.season" variant="h6" sx={{ fontWeight: 600 }} align="center" />
            <EditableTranslationText ns="restaurace" i18nKey="openingHours.summer.fri" align="center" />
            <EditableTranslationText ns="restaurace" i18nKey="openingHours.summer.sat" align="center" />
            <EditableTranslationText ns="restaurace" i18nKey="openingHours.summer.sun" align="center" />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <EditableTranslationText ns="restaurace" i18nKey="openingHours.winter.season" variant="h6" sx={{ fontWeight: 600 }} align="center" />
            <EditableTranslationText ns="restaurace" i18nKey="openingHours.winter.fri" align="center" />
            <EditableTranslationText ns="restaurace" i18nKey="openingHours.winter.sat" align="center" />
            <EditableTranslationText ns="restaurace" i18nKey="openingHours.winter.sun" align="center" />
          </Box>

          <EditableTranslationText
            ns="restaurace"
            i18nKey="openingHours.note"
            variant="body1"
            sx={{ mt: 2, fontStyle: "italic" }}
            align="center"
          />
        </Paper>
      </Container>

      <FullBleedTiles
        fullBleedHack
        translationNamespace="restaurace"
        items={[
          {
            image: asset("galerie/interier/100_HZ6_3979_Penzion_U_Lidmanu.webp"),
            textKey: "tiles.0.text",
            alt: t("tiles.0.alt"),
          },
          {
            image: asset("galerie/exterier/012_HZ6_3793_Penzion_U_Lidmanu.webp"),
            textKey: "tiles.1.text",
            alt: t("tiles.1.alt"),
          },
          {
            image: asset("galerie/interier/088_HZ6_3958_Penzion_U_Lidmanu.webp"),
            textKey: "tiles.2.text",
            alt: t("tiles.2.alt"),
          },
          {
            image: asset("galerie/sal/110_HZ6_3997_Penzion_U_Lidmanu.webp"),
            textKey: "tiles.3.text",
            alt: t("tiles.3.alt"),
          },
        ]}
      />
    </>
  );
}
