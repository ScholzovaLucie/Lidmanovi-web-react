import React from "react";
import {
  Box,
  Button,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import EditableTranslationText from "../components/EditableTranslationText";
import PhotoEditBadge from "../components/PhotoEditBadge.jsx";
import { usePhotoSequence } from "../hooks/usePhotoSequence.js";
import { useEditorialEditor } from "../context/editorialEditorContext";

export default function PriceList() {
  const { t } = useTranslation("cenik");
  const {
    isAuthenticated,
    isInlineEditing,
    getInlineValue,
    setInlineValue,
  } = useEditorialEditor();
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
  const { urls: bannerUrls } = usePhotoSequence("cenik-banner", [
    asset("/galerie/pokoje/039_HZ6_3852_Penzion_U_Lidmanu.webp"),
  ]);

  const roomsItems = getInlineValue(
    "cenik.rooms.items",
    t("rooms.items", { returnObjects: true }),
  ) || [];
  const resolvedRoomsItems = Array.isArray(roomsItems) ? roomsItems : [];

  const surchargeItems = getInlineValue(
    "cenik.surcharges.rows",
    t("surcharges.rows", { returnObjects: true }),
  ) || [];
  const resolvedSurchargeItems = Array.isArray(surchargeItems)
    ? surchargeItems
    : [];

  const addRoomVariant = () => {
    const next = [
      ...resolvedRoomsItems,
      { name: "Nová varianta pokoje", price: "Doplňte cenu" },
    ];
    setInlineValue("cenik.rooms.items", next);
  };

  const addSurchargeVariant = () => {
    const next = [
      ...resolvedSurchargeItems,
      { label: "Nový příplatek", price: "Doplňte cenu" },
    ];
    setInlineValue("cenik.surcharges.rows", next);
  };

  const cardSx = {
    border: "1px solid #dfd4c4",
    bgcolor: "background.paper",
    borderRadius: 1,
    p: { xs: 3, md: 4 },
    minHeight: "100%",
    boxShadow: "0 18px 40px rgba(45, 38, 30, 0.04)",
  };

  const rowSx = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 2,
    alignItems: "baseline",
    py: 1.45,
    borderBottom: "1px solid #e9dfcf",
    "&:last-of-type": { borderBottom: 0 },
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 320, md: 370 },
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          color: "primary.contrastText",
          backgroundImage:
            `linear-gradient(90deg, rgba(39, 35, 30, 0.76), rgba(39, 35, 30, 0.42)), ` +
            `url(${bannerUrls[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center 42%",
          px: { xs: 0, md: 0 },
          py: { xs: 5, md: 6.5 },
        }}
      >
        <PhotoEditBadge location="cenik-banner" sx={{ top: 12, right: 12 }} />
        <Container maxWidth="xl">
          <Box
            sx={{
              mb: 1.8,
              "& .MuiTypography-root": {
                fontSize: "0.82rem",
                fontWeight: 700,
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.74)",
              },
            }}
          >
            <EditableTranslationText ns="cenik" i18nKey="eyebrow" />
          </Box>
          <EditableTranslationText
            ns="cenik"
            i18nKey="pageTitle"
            variant="h1"
            sx={{
              color: "primary.contrastText",
              fontSize: { xs: "3rem", md: "4.7rem" },
              lineHeight: 0.95,
            }}
          />
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: { xs: 2.5, md: 3.5 },
            alignItems: "stretch",
          }}
        >
          <Box sx={cardSx}>
            <EditableTranslationText
              ns="cenik"
              i18nKey="rooms.title"
              variant="h2"
              sx={{ mb: 0.6 }}
            />
            <EditableTranslationText
              ns="cenik"
              i18nKey="rooms.lead"
              variant="body1"
              multilineRows={3}
              sx={{ color: "text.secondary", mb: 2.8, fontWeight: 600 }}
            />
            {resolvedRoomsItems.map((_, index) => (
              <Box
                key={`room-item-${index}`}
                sx={rowSx}
              >
                <EditableTranslationText
                  ns="cenik"
                  i18nKey={`rooms.items.${index}.name`}
                  variant="h5"
                  sx={{ fontWeight: 400 }}
                />
                <EditableTranslationText
                  ns="cenik"
                  i18nKey={`rooms.items.${index}.price`}
                  variant="body1"
                  sx={{
                    color: "primary.dark",
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                  }}
                />
              </Box>
            ))}

            {isAuthenticated && isInlineEditing && (
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                  data-inline-edit-allow-action="true"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addRoomVariant}
                  sx={{ textTransform: "none" }}
                >
                  Přidat variantu pokoje
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={cardSx}>
            <EditableTranslationText
              ns="cenik"
              i18nKey="surcharges.title"
              variant="h2"
              multilineRows={2}
              sx={{ mb: 2.8 }}
            />
            {resolvedSurchargeItems.map((_, index) => (
              <Box key={`surcharge-${index}`} sx={rowSx}>
                <EditableTranslationText
                  ns="cenik"
                  i18nKey={`surcharges.rows.${index}.label`}
                  multilineRows={2}
                  sx={{ fontWeight: 600 }}
                />
                <EditableTranslationText
                  ns="cenik"
                  i18nKey={`surcharges.rows.${index}.price`}
                  sx={{
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    textAlign: "right",
                  }}
                />
              </Box>
            ))}

            {isAuthenticated && isInlineEditing && (
              <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
                <Button
                  data-inline-edit-allow-action="true"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addSurchargeVariant}
                  sx={{ textTransform: "none" }}
                >
                  Přidat variantu příplatku
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={cardSx}>
            <EditableTranslationText
              ns="cenik"
              i18nKey="moreInfo.title"
              variant="h2"
              sx={{ mb: 2.8 }}
            />
            <Box>
              <EditableTranslationText
                ns="cenik"
                i18nKey="children.title"
                variant="h5"
                multilineRows={2}
                sx={{ fontWeight: 800, mb: 1 }}
              />
              <EditableTranslationText
                ns="cenik"
                i18nKey="children.text"
                sx={{ mb: 1.6, color: "text.secondary", lineHeight: 1.7 }}
                multilineRows={3}
              />
              <EditableTranslationText
                ns="cenik"
                i18nKey="children.labelAge"
                variant="subtitle1"
                sx={{ fontWeight: 800 }}
              />
              <EditableTranslationText
                ns="cenik"
                i18nKey="children.price"
                variant="body1"
                sx={{ mb: 2.8 }}
              />
            </Box>

            <Box sx={{ display: "grid", gap: 2 }}>
              <EditableTranslationText
                ns="cenik"
                i18nKey="moreInfo.items.0"
                sx={{ color: "text.secondary", fontWeight: 600 }}
              />
              <EditableTranslationText
                ns="cenik"
                i18nKey="moreInfo.items.1"
                sx={{ color: "text.secondary", fontWeight: 600 }}
              />
              <EditableTranslationText
                ns="cenik"
                i18nKey="moreInfo.items.2"
                sx={{ color: "text.secondary", fontWeight: 600 }}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto" },
            gap: { xs: 3, md: 5 },
            alignItems: "center",
            mt: { xs: 4, md: 5.5 },
          }}
        >
          <Box sx={{ display: "grid", gap: 0.6 }}>
            <EditableTranslationText
              ns="cenik"
              i18nKey="rooms.notes.0"
              variant="body1"
              sx={{ color: "text.secondary", fontWeight: 600 }}
              multilineRows={3}
            />
            <EditableTranslationText
              ns="cenik"
              i18nKey="rooms.notes.1"
              variant="body1"
              sx={{ color: "text.secondary", fontWeight: 600 }}
              multilineRows={3}
            />
          </Box>

          <Button
            variant="contained"
            href="/rezervace"
            sx={{
              px: { xs: 4, md: 5.5 },
              py: 1.8,
              borderRadius: 0,
              fontSize: "1rem",
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            <EditableTranslationText ns="cenik" i18nKey="reserveCta" />
          </Button>
        </Box>
      </Container>
    </>
  );
}
