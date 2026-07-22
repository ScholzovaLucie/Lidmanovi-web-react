import FullBleedTiles from "../../components/FullBleedTiles.jsx";
import HeroCarousel from "../../components/HeroCarousel.jsx";
import { useTranslation } from "react-i18next";
import { useGetInfoBoxesPublicQuery } from "../../redux/api/announcementApi.js";
import { Alert, Box, Container, Typography } from "@mui/material";
import EditableTranslationText from "../../components/EditableTranslationText.jsx";
import { Link as RouterLink } from "react-router-dom";
import { useEditorialEditor } from "../../context/editorialEditorContext.js";
import { useGoogleRating } from "../../hooks/useGoogleRating.js";
import { GOOGLE_REVIEW_URL } from "../../utils/googleRating.js";
import { usePhotoSequence } from "../../hooks/usePhotoSequence.js";
import PhotoEditBadge from "../../components/PhotoEditBadge.jsx";
import EditablePhotoSpot from "../../components/EditablePhotoSpot.jsx";

function dateBoundary(value, boundary) {
  if (!value) return null;
  const datePart = String(value).slice(0, 10);
  const date = new Date(`${datePart}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  if (boundary === "end") {
    date.setHours(23, 59, 59, 999);
  }
  return date;
}

function isAnnouncementVisible(announcement, now = new Date()) {
  if (announcement?.is_active === false) return false;

  const startsAt = dateBoundary(announcement?.starts_at, "start");
  const endsAt = dateBoundary(announcement?.ends_at, "end");

  if (startsAt && startsAt > now) return false;
  if (endsAt && endsAt < now) return false;
  return true;
}

function getAnnouncementTitle(announcement, language) {
  const lang = String(language || "cs").split("-")[0];
  return (
    announcement?.title ||
    announcement?.title_i18n?.[lang] ||
    announcement?.title_i18n?.cs ||
    ""
  );
}

export default function HomePage() {
  const { t, i18n } = useTranslation(["home", "global"]);
  const googleRating = useGoogleRating();
  const activeLanguage = String(i18n.resolvedLanguage || i18n.language || "cs").split("-")[0];
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
  const { data: announcements } = useGetInfoBoxesPublicQuery({
    lang: activeLanguage,
  });
  const activeAnnouncements =
    announcements?.results?.filter((announcement) =>
      isAnnouncementVisible(announcement),
    ) ?? [];
  const { isAuthenticated, isInlineEditing } = useEditorialEditor();
  const disableCardLinks = isAuthenticated && isInlineEditing;
  const { urls: heroUrls } = usePhotoSequence("hero", [
    asset("/uvod/uvod1.webp"),
    asset("/uvod/uvod2.webp"),
    asset("/uvod/uvod3.webp"),
    asset("/uvod/uvod4.webp"),
    asset("/uvod/nove5.webp"),
  ]);
  const { urls: tile1Urls } = usePhotoSequence("home-tile-1", [
    asset("galerie/exterier/132_HZ6_4056_Penzion_U_Lidmanu.webp"),
  ]);
  const { urls: tile2Urls } = usePhotoSequence("home-tile-2", [
    asset("/galerie/exterier/022_HZ6_3836_Penzion_U_Lidmanu.webp"),
  ]);
  const { urls: tile3Urls } = usePhotoSequence("home-tile-3", [
    asset("/galerie/interier/opona.webp"),
  ]);

  return (
    <>
      <Box sx={{ position: "relative" }}>
        {activeAnnouncements.length > 0 && (
          <Alert
            severity="warning"
            sx={{
              position: "absolute",
              top: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              boxShadow: 3,
              width: { xs: "90%", sm: "80%", md: "60%" },
            }}
          >
            {activeAnnouncements.map((infoBox) => (
              <div key={infoBox.id}>
                {getAnnouncementTitle(infoBox, activeLanguage)}
              </div>
            ))}
          </Alert>
        )}
        <HeroCarousel
          variant="editorial"
          slides={heroUrls.map((src) => ({ src }))}
          eyebrow={t("global:footer.brand")}
          title={t("global:footer.tagline")}
          titleNode={
            <EditableTranslationText
              ns="global"
              i18nKey="footer.tagline"
              variant="h1"
              multilineRows={2}
            />
          }
          description={t("home:uvod")}
          descriptionNode={
            <EditableTranslationText
              ns="home"
              i18nKey="uvod"
              variant="body1"
              multilineRows={4}
            />
          }
          primaryAction={{
            to: "/rezervace",
            label: t("global:nav.reservation"),
          }}
          secondaryAction={{
            to: "/kontakt",
            label: t("global:nav.contact"),
          }}
          stats={[
            { value: "1884", label: "Založeno" },
            {
              value: `${googleRating.rating}★`,
              label: `${googleRating.reviewCount} recenzí`,
              href: GOOGLE_REVIEW_URL,
            },
            { value: "22 km", label: "Do Adršpachu" },
          ]}
          interval={2000} // změň třeba na 4000 pro rychlejší střídání
          transition={100} // délka fade
          gradientTop="secondary.main"
        />
        <PhotoEditBadge location="hero" singlePhoto={false} sx={{ top: 16, right: 16, zIndex: 10 }} />
      </Box>

      <Box component="section" sx={{ py: { xs: 5, md: 7 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
              gap: { xs: 2, md: 3 },
            }}
          >
            {[
              {
                location: "home-card-ubytovani",
                fallback: [asset("/uvod/uvod1.webp")],
                to: "/ubytovani",
                titleNs: "global",
                titleKey: "nav.accommodation",
                textNs: "home",
                textKey: "uvod",
              },
              {
                location: "home-card-restaurace",
                fallback: [asset("galerie/interier/100_HZ6_3979_Penzion_U_Lidmanu.webp")],
                to: "/restaurace",
                titleNs: "global",
                titleKey: "nav.restaurant",
                textNs: "home",
                textKey: "lokace",
              },
              {
                location: "home-card-svatby",
                fallback: [asset("/galerie/interier/opona.webp")],
                to: "/svatby",
                titleNs: "global",
                titleKey: "nav.weddings",
                textNs: "home",
                textKey: "pribeh.nadpis",
              },
            ].map((card) => (
              <Box
                key={`${card.titleNs}.${card.titleKey}`}
                component={disableCardLinks ? "div" : RouterLink}
                to={disableCardLinks ? undefined : card.to}
                sx={{
                  display: "block",
                  color: "inherit",
                  textDecoration: "none",
                  transition: "transform 160ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <EditablePhotoSpot
                  location={card.location}
                  fallback={card.fallback}
                  imgSx={{
                    display: "block",
                    width: "100%",
                    aspectRatio: "16 / 10",
                    objectFit: "cover",
                  }}
                  wrapperSx={{ mb: 2 }}
                />
                <Box sx={{ mb: 0.5 }}>
                  <EditableTranslationText
                    ns={card.titleNs}
                    i18nKey={card.titleKey}
                    variant="h3"
                    multilineRows={1}
                  />
                </Box>
                <Typography
                  component="div"
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  <EditableTranslationText
                    ns={card.textNs}
                    i18nKey={card.textKey}
                    variant="body2"
                    multilineRows={3}
                  />
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <FullBleedTiles
        fullBleedHack
        variant="cards"
        translationNamespace="home"
        imageAspect={{ xs: "16 / 11", md: "16 / 10" }}
        items={[
          {
            image: tile1Urls[0],
            photoLocation: "home-tile-1",
            titleKey: "footer.brand",
            ns: "global",
            textKey: "lokace",
          },
          {
            image: tile2Urls[0],
            photoLocation: "home-tile-2",
            titleKey: "jablon.nadpis",
            textKey: "jablon.text",
          },
          {
            image: tile3Urls[0],
            photoLocation: "home-tile-3",
            titleKey: "pribeh.nadpis",
            paragraphsKey: "pribeh.text",
          },
        ]}
      />
    </>
  );
}
