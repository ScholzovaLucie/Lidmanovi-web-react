import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";
import EditableTranslationText from "./EditableTranslationText";
import PhotoEditBadge from "./PhotoEditBadge";

/**
 * Střídající pásy (obrázek ↔ text) bez nutnosti 50% výšky.
 *
 * Props:
 * - items: Array<{ image, imageAlt?, title?, text?, paragraphs? }>
 * - fluidHeight: boolean (default true) – „jako v ceníku“, výška dle obsahu + aspect-ratio pro obrázek
 * - imageAspect: { xs, md } (default { xs: "16 / 10", md: "16 / 9" })
 * - minHeight: { xs, md } | number | null (default null) – použije se jen když fluidHeight=false
 * - bandWidth: { xs, md } | string (default { xs: "100%", md: "90%" })
 * - overlay: rgba nebo null (default "rgba(0,0,0,.25)")
 * - startWithImageLeft: boolean (default true)
 * - fullBleedHack: boolean (default false)
 * - bgPosition: string (default "center")
 * - bgSize: "cover" | "contain" (default "cover")
 */
export default function FullBleedTiles({
  items = [],
  translationNamespace,
  variant = "bands",
  fluidHeight = true,
  imageAspect = { xs: "16 / 10", md: "16 / 9" },
  minHeight = null,
  bandWidth = { xs: "100%", md: "100%" },
  overlay = "rgba(0,0,0,.25)",
  startWithImageLeft = true,
  fullBleedHack = false,
  bgPosition = "center",
  bgSize = "cover",
}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const toParagraphs = (txt) => {
    if (!txt) return [];
    const normalized = txt
      .replace(/<br\s*\/?>/gi, "\n\n")
      .replace(/\r\n/g, "\n");
    return normalized
      .split(/\n{2,}/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const toPublic = (p) => {
    if (!p) return "";
    if (/^https?:\/\//.test(p) || p.startsWith("data:")) return p;
    return p.startsWith("/") ? p : `/${p}`;
  };

  const renderText = (item, idx) => {
    const textAlign = variant === "cards" ? "center" : "left";
    const paras =
      Array.isArray(item.paragraphs) && item.paragraphs.length
        ? item.paragraphs
        : toParagraphs(item.text);

    return (
      <>
        {item.titleKey ? (
          <EditableTranslationText
            ns={item.ns || translationNamespace}
            i18nKey={item.titleKey}
            variant={variant === "cards" ? "h3" : "h2"}
            sx={{ mb: 1.5, textAlign }}
            align={textAlign}
          />
        ) : (
          item.title && (
            <Typography
              component="h2"
              sx={(theme) => ({
                ...(variant === "cards" ? theme.typography.h3 : theme.typography.h2),
                mb: 1.5,
                textAlign,
              })}
            >
              {item.title}
            </Typography>
          )
        )}

        {item.paragraphsKey ? (
          <EditableTranslationText
            ns={item.ns || translationNamespace}
            i18nKey={item.paragraphsKey}
            variant="body1"
            sx={{ color: "text.secondary", textAlign }}
            paragraphs
            align={textAlign}
            multilineRows={5}
          />
        ) : item.textKey ? (
          <EditableTranslationText
            ns={item.ns || translationNamespace}
            i18nKey={item.textKey}
            variant="body1"
            sx={{ color: "text.secondary", textAlign }}
            paragraph
            align={textAlign}
            multilineRows={4}
          />
        ) : (
          (paras.length ? paras : [item.text].filter(Boolean)).map((p, i) => (
            <Typography
              key={i}
              sx={{ color: "text.secondary", textAlign }}
              paragraph
            >
              {p}
            </Typography>
          ))
        )}
      </>
    );
  };

  if (variant === "cards") {
    return (
      <Box
        component="section"
        sx={{
          position: "relative",
          ...(fullBleedHack && {
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",
            width: "100vw",
            mt: 3,
          }),
          py: { xs: 5, md: 7 },
          bgcolor: "background.paper",
          borderTop: "1px solid #dfd4c4",
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1640 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 3, md: 3.5 },
            }}
          >
            {items.map((item, idx) => (
              <Box
                key={`${idx}-${item.image || "tile"}`}
                sx={{
                  position: "relative",
                  flex: {
                    xs: "1 1 100%",
                    sm: "1 1 calc(50% - 28px)",
                    lg: "1 1 calc(33.333% - 28px)",
                    xl: "1 1 calc(25% - 28px)",
                  },
                  maxWidth: { xs: "100%", sm: 520 },
                  minWidth: { xs: 0, sm: 300 },
                  border: "1px solid",
                  borderColor: isAuthenticated ? "secondary.main" : "#dfd4c4",
                  bgcolor: "background.paper",
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
                      zIndex: 2,
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
                {item.photoLocation && (
                  <PhotoEditBadge location={item.photoLocation} sx={{ top: 8, left: 8 }} />
                )}
                <Box
                  component="img"
                  src={toPublic(item.image)}
                  alt={item.imageAlt || item.title || ""}
                  sx={{
                    display: "block",
                    width: "100%",
                    aspectRatio: imageAspect,
                    objectFit: "cover",
                    objectPosition: bgPosition,
                    filter: overlay ? "brightness(0.86)" : "none",
                  }}
                />
                <Box sx={{ p: { xs: 2.5, md: 3 }, minHeight: { md: 260 }, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1.25,
                      color: "primary.main",
                      fontSize: "0.76rem",
                      textAlign: "center",
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </Typography>
                  {renderText(item, idx)}
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        ...(fullBleedHack && {
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          width: "100vw",
          mt: 3,
        }),
      }}
    >
      {items.map((item, idx) => {
        const imageOnLeft = startWithImageLeft ? idx % 2 === 0 : idx % 2 === 1;
        return (
          <Box
            key={`${idx}-${item.image || "tile"}`}
            sx={{
              position: "relative",
              width: bandWidth,
              mx: "auto",
              mb: 0,
              overflow: "hidden",
              borderTop: "1px solid",
              borderBottom: idx === items.length - 1 ? "1px solid" : "none",
              borderColor: isAuthenticated ? "secondary.main" : "#dfd4c4",
              outline: isAuthenticated ? "1px dashed" : "none",
              outlineColor: isAuthenticated ? "secondary.main" : "transparent",
              display: "flex",
                flexDirection: {
                  xs: "column",
                  md: imageOnLeft ? "row" : "row-reverse",
                },
              alignItems: "stretch",
              background: "background.default",
            }}
          >
            {isAuthenticated && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
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
            {item.photoLocation && (
              <PhotoEditBadge location={item.photoLocation} sx={{ top: 8, left: 8 }} />
            )}
            {/* Obrázek jako background */}
            <Box
              role="img"
              aria-label={item.imageAlt || item.title || ""}
              sx={{
                position: "relative",
                flexBasis: { xs: "100%", md: "50%" },
                flexGrow: 1,
                ...(fluidHeight
                  ? { aspectRatio: { xs: imageAspect.xs, md: "16 / 10" } } // výška z poměru stran
                  : minHeight
                  ? { minHeight } // pevná minimální výška
                  : { minHeight: { xs: 300, md: 360 } }), // fallback, když nic nezadáš
                backgroundImage: `url(${toPublic(item.image)})`,
                backgroundSize: bgSize,
                backgroundPosition: bgPosition,
                backgroundRepeat: "no-repeat",
                "&::after": overlay
                  ? {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: overlay,
                    }
                  : undefined,
              }}
            />

            {/* Textový sloupec */}
            <Box
              sx={{
                flexBasis: { xs: "100%", md: "50%" },
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 }, px: { xs: 3, md: 6 } }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1.5,
                    color: "primary.main",
                    letterSpacing: 0,
                    textTransform: "uppercase",
                    fontSize: "0.76rem",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </Typography>

                {renderText(item, idx)}
              </Container>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
