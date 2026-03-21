import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";
import EditableTranslationText from "./EditableTranslationText";

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
  fluidHeight = true,
  imageAspect = { xs: "16 / 10", md: "16 / 9" },
  minHeight = null,
  bandWidth = { xs: "100%", md: "70%" },
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

  const toPublic = (p) => (p?.startsWith("/") ? p : `/${p || ""}`);

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
        const paras =
          Array.isArray(item.paragraphs) && item.paragraphs.length
            ? item.paragraphs
            : toParagraphs(item.text);

        return (
          <Box
            key={`${idx}-${item.image || "tile"}`}
            sx={{
              position: "relative",
              width: bandWidth,
              mx: "auto",
              mb: { xs: 4, md: 6 },
              overflow: "hidden",
              borderTop: "1px solid",
              borderBottom: "1px solid",
              borderColor: isAuthenticated ? "secondary.main" : "rgba(85,116,143,0.12)",
              outline: isAuthenticated ? "1px dashed" : "none",
              outlineColor: isAuthenticated ? "secondary.main" : "transparent",
              display: "flex",
                flexDirection: {
                  xs: "column",
                  md: imageOnLeft ? "row" : "row-reverse",
                },
              alignItems: "stretch",
              background: idx % 2 === 1 ? "rgba(221,229,233,0.35)" : "background.paper",
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
            {/* Obrázek jako background */}
            <Box
              role="img"
              aria-label={item.imageAlt || item.title || ""}
              sx={{
                position: "relative",
                flexBasis: { xs: "100%", md: "50%" },
                flexGrow: 1,
                ...(fluidHeight
                  ? { aspectRatio: imageAspect } // výška z poměru stran
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
              <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 }, px: { xs: 3, md: 5 } }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1.5,
                    color: "primary.main",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </Typography>

                {item.titleKey ? (
                  <EditableTranslationText
                    ns={item.ns || translationNamespace}
                    i18nKey={item.titleKey}
                    variant="h2"
                    sx={{ mb: 2.2, textAlign: "left" }}
                    align="left"
                  />
                ) : (
                  item.title && (
                    <Typography
                      component="h2"
                      sx={{
                        ...((theme) => theme.typography.h2),
                        mb: 2.2,
                      }}
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
                    sx={{ color: "text.secondary", textAlign: "left" }}
                    paragraphs
                    align="left"
                    multilineRows={5}
                  />
                ) : item.textKey ? (
                  <EditableTranslationText
                    ns={item.ns || translationNamespace}
                    i18nKey={item.textKey}
                    variant="body1"
                    sx={{ color: "text.secondary", textAlign: "left" }}
                    paragraph
                    align="left"
                    multilineRows={4}
                  />
                ) : (
                  (paras.length ? paras : [item.text].filter(Boolean)).map((p, i) => (
                    <Typography
                      key={i}
                      sx={{ color: "text.secondary", textAlign: "left" }}
                      paragraph
                    >
                      {p}
                    </Typography>
                  ))
                )}
              </Container>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
