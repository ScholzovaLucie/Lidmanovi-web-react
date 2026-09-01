import { Box, Button, Container, Typography } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import SubpageBanner from "../components/SubpageBanner.jsx";
import PhotoEditBadge from "../components/PhotoEditBadge.jsx";
import EditableTranslationText from "../components/EditableTranslationText.jsx";
import { usePhotoSequence } from "../hooks/usePhotoSequence.js";
import { useNearbyPlacesQuery } from "../redux/api/nearbyPlacesApi.js";

function NearbyPlaceCard({ place, language }) {
  const { urls, alts } = usePhotoSequence(`nearby-place-${place.id}`, [], {
    skip: place.media_type !== "image",
  });
  const title = place.name_i18n?.[language] || place.name;

  return (
    <Box
      sx={{
        border: "1px solid #dfd4c4",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {place.media_type === "iframe" && place.media_url ? (
        <Box
          component="iframe"
          src={place.media_url}
          title={title}
          loading="lazy"
          sx={{ width: "100%", aspectRatio: "16 / 10", border: 0, display: "block" }}
        />
      ) : (
        <Box
          component="img"
          src={urls[0]}
          alt={alts[0] || title}
          loading="lazy"
          decoding="async"
          sx={{
            width: "100%",
            aspectRatio: "16 / 10",
            objectFit: "cover",
            display: "block",
            bgcolor: "grey.100",
          }}
        />
      )}

      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", flexGrow: 1, gap: 1.5 }}>
        <Typography variant="h3" sx={{ fontSize: "1.4rem" }}>
          {title}
        </Typography>
        {place.link && (
          <Button
            component="a"
            href={place.link}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            endIcon={<OpenInNew fontSize="small" />}
            sx={{ alignSelf: "flex-start", mt: "auto" }}
          >
            Zobrazit více
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default function NearbyPlaces() {
  const { t, i18n } = useTranslation("okoli");
  const activeLanguage = String(i18n.resolvedLanguage || i18n.language || "cs").split("-")[0];
  const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  const { urls: introSlides } = usePhotoSequence("okoli-uvod", [
    asset("galerie/exterier/132_HZ6_4056_Penzion_U_Lidmanu.webp"),
  ]);

  const { data, isLoading } = useNearbyPlacesQuery();
  const places = data?.results || data || [];

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <SubpageBanner
          eyebrowNode={
            <EditableTranslationText
              ns="okoli"
              i18nKey="eyebrow"
              align="center"
              fallback={t("pageTitle")}
              sx={{
                mb: 1.2,
                color: "rgba(255,250,240,0.86)",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            />
          }
          title={t("pageTitle")}
          titleNode={
            <EditableTranslationText
              ns="okoli"
              i18nKey="pageTitle"
              variant="h1"
              align="center"
              fallback="Místa v okolí"
              sx={{
                maxWidth: "16ch",
                mx: "auto",
                color: "#fdfefe",
                textShadow: "0 10px 34px rgba(0,0,0,0.24)",
              }}
            />
          }
          slides={introSlides}
        />
        <PhotoEditBadge location="okoli-uvod" singlePhoto={false} sx={{ top: 16, right: 16, zIndex: 10 }} />
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <EditableTranslationText
          ns="okoli"
          i18nKey="intro"
          variant="body1"
          fallback="Tipy na výlety a zajímavá místa, která stojí za návštěvu v okolí penzionu."
          sx={{ color: "text.secondary", mb: 4, maxWidth: 720 }}
          multilineRows={3}
        />

        {isLoading ? (
          <Typography color="text.secondary">Načítání míst...</Typography>
        ) : places.length === 0 ? (
          <Typography color="text.secondary">Zatím zde nejsou žádná místa.</Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {places.map((place) => (
              <NearbyPlaceCard key={place.id} place={place} language={activeLanguage} />
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}
