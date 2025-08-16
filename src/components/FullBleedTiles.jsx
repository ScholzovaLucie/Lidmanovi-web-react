import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

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
          <Paper
            variant="outlined"
            key={`${idx}-${item.image || "tile"}`}
            sx={{
              width: bandWidth,
              mx: "auto",
              mb: 3, // gap 3 mezi pásy
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: {
                xs: "column",
                md: imageOnLeft ? "row" : "row-reverse",
              },
              alignItems: "stretch",
            }}
          >
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
              }}
            >
              <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
                {item.title && (
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: 24,
                      fontWeight: 700,
                      textAlign: "center",
                      mb: 2,
                    }}
                  >
                    {item.title}
                  </Typography>
                )}
                {(paras.length ? paras : [item.text].filter(Boolean)).map(
                  (p, i) => (
                    <Typography
                      key={i}
                      sx={{ color: "text.secondary", textAlign: "center" }}
                      paragraph
                    >
                      {p}
                    </Typography>
                  )
                )}
              </Container>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
}
