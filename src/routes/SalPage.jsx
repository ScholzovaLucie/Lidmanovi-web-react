import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import EditableTranslationText from "../components/EditableTranslationText";
import EditableIconPicker from "../components/EditableIconPicker.jsx";
import PhotoEditBadge from "../components/PhotoEditBadge.jsx";
import { usePhotoSequence } from "../hooks/usePhotoSequence.js";
import { useStatIconValue } from "../hooks/useStatIconValue.js";
import { useEditorialEditor } from "../context/editorialEditorContext";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";
import { NUMBER_MODE } from "../utils/iconOptions";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export default function SalPage({ ns, photoLocation, fallbackImage, content }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { isAuthenticated: isEditorAuth, isInlineEditing } = useEditorialEditor();
  const isEditingNow = isEditorAuth && isInlineEditing;
  const statIndexes = [0, 1, 2];
  const statIconFallbacks = statIndexes.map(
    (index) => content.stats[index]?.icon || NUMBER_MODE,
  );
  const statIconValues = [
    useStatIconValue(ns, "stats.0.icon", statIconFallbacks[0]),
    useStatIconValue(ns, "stats.1.icon", statIconFallbacks[1]),
    useStatIconValue(ns, "stats.2.icon", statIconFallbacks[2]),
  ];
  const { urls: introSlides } = usePhotoSequence(photoLocation, [
    asset(fallbackImage),
  ]);
  const [activeSlide, setActiveSlide] = React.useState(0);

  React.useEffect(() => {
    if (introSlides.length <= 1) return;
    const id = setInterval(() => {
      setActiveSlide((current) => (current + 1) % introSlides.length);
    }, 3500);
    return () => clearInterval(id);
  }, [introSlides.length]);

  return (
    <>
      <Box
        component="section"
        sx={{
          position: "relative",
          minHeight: { xs: 360, md: 560 },
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "hidden",
          color: "#fffaf0",
          textAlign: "center",
        }}
      >
        {introSlides.map((src, index) => (
          <Box
            key={`${src}-${index}`}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(180deg, rgba(45,40,35,0.4), rgba(45,40,35,0.56)), url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: index === activeSlide ? 1 : 0,
              transition: "opacity 900ms ease",
            }}
          />
        ))}
        <Container maxWidth="lg" sx={{ pb: { xs: 5, md: 7 }, position: "relative", zIndex: 1 }}>
          <EditableTranslationText
            ns={ns}
            i18nKey="heroEyebrow"
            variant="subtitle1"
            align="center"
            fallback={content.heroEyebrow}
            sx={{
              mb: 1.5,
              color: "rgba(255,250,240,0.88)",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
            }}
          />
          <EditableTranslationText
            ns={ns}
            i18nKey="heroTitle"
            variant="h1"
            align="center"
            fallback={content.heroTitle}
            sx={{
              color: "#fffaf0",
              textShadow: "0 10px 34px rgba(0,0,0,0.24)",
            }}
          />
        </Container>
        <PhotoEditBadge location={photoLocation} singlePhoto={false} sx={{ top: 16, right: 16, zIndex: 10 }} />
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Box
          sx={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            gap: { xs: 4, md: 8 },
            alignItems: "center",
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

          <Box>
            <EditableTranslationText
              ns={ns}
              i18nKey="sectionTitle"
              variant="h2"
              fallback={content.sectionTitle}
              sx={{
                mb: { xs: 2, md: 3 },
              }}
              multilineRows={2}
            />
            <EditableTranslationText
              ns={ns}
              i18nKey="sectionText"
              variant="body1"
              fallback={content.sectionText}
              sx={{
                maxWidth: 660,
                color: "text.secondary",
                fontSize: { md: "1.08rem" },
                lineHeight: 1.9,
              }}
              multilineRows={5}
            />
          </Box>

          <Box sx={{ display: "grid", gap: 2.5 }}>
            {statIndexes.map((index) => {
              const iconFallback = statIconFallbacks[index];
              const isNumber = statIconValues[index] === NUMBER_MODE;

              const showValue = isNumber || isEditingNow;

              return (
                <Box
                  key={index}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "72px 1fr", md: "96px 1fr" },
                    alignItems: "center",
                    gap: { xs: 2, md: 3 },
                    px: { xs: 2.5, md: 4 },
                    py: { xs: 2, md: 2.5 },
                    border: "1px solid",
                    borderColor: isAuthenticated ? "secondary.main" : "#dfd4c4",
                    bgcolor: "background.paper",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <EditableIconPicker
                      ns={ns}
                      i18nKey={`stats.${index}.icon`}
                      fallback={iconFallback}
                      sx={{ color: "primary.main", fontSize: 36 }}
                    />
                    {showValue && (
                      <EditableTranslationText
                        ns={ns}
                        i18nKey={`stats.${index}.value`}
                        variant="h2"
                        align="center"
                        fallback={content.stats[index]?.value}
                        sx={{
                          mb: 0,
                          color: "primary.main",
                          fontSize: { xs: "2rem", md: "2.4rem" },
                          lineHeight: 1,
                        }}
                        multilineRows={1}
                      />
                    )}
                  </Box>
                  <EditableTranslationText
                    ns={ns}
                    i18nKey={`stats.${index}.text`}
                    variant="body1"
                    fallback={content.stats[index]?.text}
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                    multilineRows={2}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 5, md: 7 } }}>
          <Button
            component={RouterLink}
            to="/kontakt"
            variant="contained"
            sx={{
              minWidth: { xs: "100%", sm: 420 },
              py: 1.5,
              px: 4,
            }}
          >
            <EditableTranslationText
              ns={ns}
              i18nKey="contactCta"
              fallback={content.contactCta}
            />
          </Button>
        </Box>
      </Container>
    </>
  );
}
