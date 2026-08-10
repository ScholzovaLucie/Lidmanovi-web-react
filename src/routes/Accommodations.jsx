import React from "react";
import { Box, Container, Divider, Grid, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import FullBleedTiles from "../components/FullBleedTiles.jsx";
import EditableTranslationText from "../components/EditableTranslationText";
import SubpageBanner from "../components/SubpageBanner.jsx";
import PhotoEditBadge from "../components/PhotoEditBadge.jsx";
import RoomCard from "./Reservation/components/RoomCard.jsx";
import { usePhotoSequence } from "../hooks/usePhotoSequence.js";
import { useRoomsQuery } from "../redux/api/roomsApi.js";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";

export default function Accommodations() {
  const { t } = useTranslation("ubytovani");
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
  const {
    data: roomsData,
    isLoading: roomsLoading,
    error: roomsError,
  } = useRoomsQuery();
  const rooms = (roomsData?.results ?? (Array.isArray(roomsData) ? roomsData : [])).filter(
    (r) => r.is_active,
  );
  const { urls: introSlides } = usePhotoSequence("ubytovani-uvod", [
    "/ubytovani/ubytovani2.webp",
    "/ubytovani/ubytovani3.webp",
    "/ubytovani/ubytovani5.webp",
    "/ubytovani/ubytovani7.webp",
  ]);
  const { urls: tile1Urls, alts: tile1Alts } = usePhotoSequence("ubytovani-tile-1", [
    asset("/ubytovani/ubytovani1.webp"),
  ]);
  const { urls: tile2Urls, alts: tile2Alts } = usePhotoSequence("ubytovani-tile-2", [
    asset("/ubytovani/ubytovani3.webp"),
  ]);
  const { urls: tile3Urls, alts: tile3Alts } = usePhotoSequence("ubytovani-tile-3", [
    asset("/ubytovani/ubytovani5.webp"),
  ]);
  const { urls: tile4Urls, alts: tile4Alts } = usePhotoSequence("ubytovani-tile-4", [
    asset("/ubytovani/ubytovani7.webp"),
  ]);
  const sharedSectionSx = {
    position: "relative",
    px: { xs: 3, md: 4 },
    py: { xs: 3.5, md: 4 },
    border: "1px solid",
    borderColor: isAuthenticated ? "secondary.main" : "#dfd4c4",
    background: "background.paper",
    boxShadow: "none",
    outline: isAuthenticated ? "1px dashed" : "none",
    outlineColor: isAuthenticated ? "secondary.main" : "transparent",
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <SubpageBanner
          eyebrow={t("pageTitle")}
          title={t("heading")}
          titleNode={
            <EditableTranslationText
              ns="ubytovani"
              i18nKey="heading"
              variant="h1"
              align="center"
              sx={{
                maxWidth: "16ch",
                mx: "auto",
                color: "#fdfefe",
                textShadow: "0 10px 34px rgba(0,0,0,0.24)",
              }}
            />
          }
          subtitle={t("intro")}
          subtitleNode={
            <EditableTranslationText
              ns="ubytovani"
              i18nKey="intro"
              variant="body1"
              align="center"
              sx={{
                mt: 1.5,
                maxWidth: "48ch",
                mx: "auto",
                color: "rgba(238,243,247,0.72)",
              }}
              multilineRows={3}
            />
          }
          slides={introSlides}
        />
        <PhotoEditBadge location="ubytovani-uvod" singlePhoto={false} sx={{ top: 16, right: 16, zIndex: 10 }} />
      </Box>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "start",
            mb: { xs: 4, md: 5 },
          }}
        >
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
              i18nKey="roomsTitle"
              variant="h2"
              sx={{ mb: 2 }}
            />
            <EditableTranslationText
              ns="ubytovani"
              i18nKey="roomsText"
              variant="body1"
              sx={{ color: "text.secondary", mb: 2.5 }}
              multilineRows={4}
            />
            <EditableTranslationText
              ns="ubytovani"
              i18nKey="intro"
              variant="body1"
              sx={{ color: "text.secondary" }}
              multilineRows={4}
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
              i18nKey="openingHours.pension"
              variant="subtitle1"
              sx={{
                mb: 0.5,
                fontWeight: 700,
                color: "text.secondary",
              }}
            />
            <EditableTranslationText
              ns="ubytovani"
              i18nKey="openingHours.restaurantTitle"
              variant="subtitle1"
              sx={{
                mb: 2.5,
                fontWeight: 700,
                color: "text.secondary",
              }}
            />

            <Box sx={{ mb: 3 }}>
              <EditableTranslationText
                ns="ubytovani"
                i18nKey="openingHours.monThu"
                variant="h5"
                sx={{ fontWeight: 600, mb: 0.6 }}
              />
              <EditableTranslationText ns="ubytovani" i18nKey="openingHours.fri" sx={{ color: "text.secondary" }} />
              <EditableTranslationText ns="ubytovani" i18nKey="openingHours.sat" sx={{ color: "text.secondary" }} />
              <EditableTranslationText ns="ubytovani" i18nKey="openingHours.sun" sx={{ color: "text.secondary" }} />
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <EditableTranslationText
              ns="ubytovani"
              i18nKey="openingHours.note"
              variant="body1"
              sx={{
                maxWidth: 760,
                color: "text.secondary",
                fontStyle: "italic",
              }}
            />
          </Paper>
        </Box>

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
              i18nKey="additionalInfo.title"
              variant="h5"
              sx={{
                mb: 2.5,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 400,
              }}
            />

            <Box sx={{ maxWidth: 760, mx: "auto" }}>
              <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item1" sx={{ mb: 1.2, color: "text.secondary" }} />
              <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item2" sx={{ mb: 1.2, color: "text.secondary" }} />
              <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item3" sx={{ mb: 1.2, color: "text.secondary" }} />
              <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item4" sx={{ mb: 1.2, color: "text.secondary" }} />
              <EditableTranslationText ns="ubytovani" i18nKey="additionalInfo.item5" sx={{ color: "text.secondary" }} />
            </Box>

            <Divider sx={{ my: 2.5, maxWidth: 760, mx: "auto" }} />

            <EditableTranslationText
              ns="ubytovani"
              i18nKey="catering.title"
              variant="h5"
              sx={{
                mb: 1,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 400,
              }}
            />
            <EditableTranslationText
              ns="ubytovani"
              i18nKey="catering.text"
              sx={{ maxWidth: 760, mx: "auto", color: "text.secondary" }}
            />
          </Paper>
        </Box>
      </Container>

      <Box
        component="section"
        sx={{
          position: "relative",
          bgcolor: "background.paper",
          py: { xs: 5, md: 7 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              position: "relative",
              textAlign: "center",
              maxWidth: 720,
              mx: "auto",
              mb: { xs: 4, md: 5 },
              ...(isAuthenticated && {
                px: { xs: 3, md: 4 },
                py: { xs: 2.5, md: 3 },
                outline: "1px dashed",
                outlineColor: "secondary.main",
              }),
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
              i18nKey="roomsListTitle"
              variant="h2"
              align="center"
              sx={{ mb: 1.5 }}
            />
            <EditableTranslationText
              ns="ubytovani"
              i18nKey="roomsListText"
              variant="body1"
              align="center"
              sx={{ color: "text.secondary" }}
              multilineRows={3}
            />
          </Box>

          {roomsLoading ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography color="text.secondary">{t("roomsLoading")}</Typography>
            </Box>
          ) : roomsError ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography color="error">{t("roomsError")}</Typography>
            </Box>
          ) : rooms.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography color="text.secondary">{t("roomsEmpty")}</Typography>
            </Box>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {rooms.map((room) => (
                <Grid key={room.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <RoomCard room={room} isReadOnly />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <FullBleedTiles
        fullBleedHack
        variant="cards"
        translationNamespace="ubytovani"
        imageAspect={{ xs: "16 / 10", md: "16 / 10" }}
        sectionBgcolor="background.default"
        sectionBorderTop="none"
        items={[
          {
            image: tile1Urls[0],
            imageAlt: tile1Alts[0] || t("tiles.0.alt"),
            photoLocation: "ubytovani-tile-1",
            titleKey: "tiles.0.alt",
            textKey: "tiles.0.text",
          },
          {
            image: tile2Urls[0],
            imageAlt: tile2Alts[0] || t("tiles.1.alt"),
            photoLocation: "ubytovani-tile-2",
            titleKey: "tiles.1.alt",
            textKey: "tiles.1.text",
          },
          {
            image: tile3Urls[0],
            imageAlt: tile3Alts[0] || t("tiles.2.alt"),
            photoLocation: "ubytovani-tile-3",
            titleKey: "tiles.2.alt",
            textKey: "tiles.2.text",
          },
          {
            image: tile4Urls[0],
            imageAlt: tile4Alts[0] || t("tiles.3.alt"),
            photoLocation: "ubytovani-tile-4",
            titleKey: "tiles.3.alt",
            textKey: "tiles.3.text",
          },
        ]}
      />
    </>
  );
}
