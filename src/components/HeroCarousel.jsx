import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link as RouterLink } from "react-router-dom";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

/**
 * Props:
 * - slides: [{ src, alt? }]
 * - interval: ms (auto-rotace), default 5000
 * - transition: ms (fade), default 800
 * - gradientTop: barva horního overlaye, default "secondary.main"
 * - logoSrc: cesta k logu (default "/images/logo.png")
 * - logoHeight: { xs, md } výška loga v px (default { xs: 40, md: 60 })
 * - fullBleedHack: pokud je Hero uvnitř Containeru a chceš přes okraj (default false)
 */
export default function HeroCarousel({
  slides = [],
  variant = "classic",
  interval = 5000,
  transition = 800,
  gradientTop = "secondary.main",
  logoSrc = asset("/logolidman.webp"),
  logoHeight = { xs: 150, md: 150 },
  fullBleedHack = false,
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  stats = [],
}) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = slides.length;

  const goto = React.useCallback(
    (i) => setIndex(((i % count) + count) % count),
    [count]
  );
  const prev = React.useCallback(() => goto(index - 1), [goto, index]);
  const next = React.useCallback(() => goto(index + 1), [goto, index]);

  // Auto-rotace s pauzou
  React.useEffect(() => {
    if (count <= 1 || paused) return;
    if (typeof document !== "undefined" && document.hidden) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(id);
  }, [count, interval, paused]);

  // Pauza při skryté kartě
  React.useEffect(() => {
    const onVis = () => setPaused((p) => (document.hidden ? true : p));
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Swipe na mobilech
  const touchRef = React.useRef({ x: 0, y: 0 });
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
      dx > 0 ? prev() : next();
    }
  };

  if (variant === "editorial") {
    const heroSlides = slides.slice(0, 3);

    return (
      <Box
        component="section"
        sx={{
          position: "relative",
          ...(fullBleedHack
            ? {
                left: "50%",
                right: "50%",
                marginLeft: "-50vw",
                marginRight: "-50vw",
                width: "100vw",
              }
            : {
                width: "100%",
              }),
          minHeight: { xs: "auto", md: "100vh" },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.92fr) minmax(0, 1.08fr)" },
          pt: { xs: "82px", md: "88px" },
          backgroundColor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "rgba(85,116,143,0.12)",
        }}
      >
        <Stack
          justifyContent="center"
          sx={{
            px: { xs: 3, md: 5 },
            py: { xs: 5, md: 7 },
            minWidth: 0,
          }}
        >
          {eyebrow && (
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2.5,
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&::before": {
                  content: '""',
                  width: 28,
                  height: 1,
                  backgroundColor: "primary.main",
                },
              }}
            >
              {eyebrow}
            </Typography>
          )}

          {title && (
            <Typography variant="h1" sx={{ maxWidth: "11ch", mb: 2, color: "text.primary" }}>
              {title}
            </Typography>
          )}

          {description && (
            <Typography variant="body1" sx={{ maxWidth: "40ch", color: "text.secondary", mb: 3.5 }}>
              {description}
            </Typography>
          )}

          {(primaryAction || secondaryAction) && (
            <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4, flexWrap: "wrap" }}>
              {primaryAction && (
                <Button component={RouterLink} to={primaryAction.to} variant="contained" sx={{ px: 2.5, py: 1.15 }}>
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  component={RouterLink}
                  to={secondaryAction.to}
                  variant="text"
                  sx={{
                    px: 0,
                    color: "text.secondary",
                    "&:hover": { bgcolor: "transparent", color: "text.primary" },
                  }}
                >
                  {secondaryAction.label}
                </Button>
              )}
            </Stack>
          )}

          {!!stats.length && (
            <Stack
              direction="row"
              spacing={{ xs: 2.5, md: 4 }}
              sx={{
                pt: 3,
                borderTop: "1px solid",
                borderColor: "rgba(85,116,143,0.12)",
                flexWrap: "wrap",
              }}
            >
              {stats.map((stat) => (
                <Box key={stat.label}>
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: { xs: "2rem", md: "2.4rem" },
                      lineHeight: 1,
                      color: "text.primary",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.4,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "text.secondary",
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>

        <Box
          sx={{
            position: "relative",
            minHeight: { xs: 460, md: "auto" },
            backgroundColor: "primary.50",
            borderLeft: { xs: "none", md: "1px solid" },
            borderTop: { xs: "1px solid", md: "none" },
            borderColor: "rgba(85,116,143,0.12)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: { xs: 0, md: "0 0 0 -1.5rem" },
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gridTemplateRows: "1.16fr 0.84fr",
              gap: "3px",
              bgcolor: "background.paper",
            }}
          >
            {heroSlides.map((slide, i) => (
              <Box
                key={slide.src}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  gridRow: i === 0 ? "1 / 3" : "auto",
                }}
              >
                <Box
                  component="img"
                  src={slide.src}
                  alt={slide.alt || ""}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      sx={{
        position: "relative",
        zIndex: 0,
        // full-bleed varianty:
        ...(fullBleedHack
          ? {
              // použij, pokud je rodič zúžený (např. Container kolem <Outlet/>)
              left: "50%",
              right: "50%",
              marginLeft: "-50vw",
              marginRight: "-50vw",
              width: "100vw",
            }
          : {
              width: "100%", // když není obal v Containeru
            }),
        height: { xs: "100dvh", md: "100vh" },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${gradientTop} 0 0, rgba(0,0,0,0) 220px)`,
          mixBlendMode: "multiply",
          zIndex: 1,
          pointerEvents: "none",
        },
      }}
    >
      {/* Pozadí (crossfade) */}
      <Box sx={{ position: "absolute", inset: 0 }}>
        {slides.map((s, i) => (
          <Box
            key={i}
            role="img"
            aria-label={s.alt || ""}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${s.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === index ? 1 : 0,
              transition: `opacity ${transition}ms ease`,
              willChange: "opacity",
              pointerEvents: "none",
            }}
          />
        ))}
      </Box>

      {/* Logo vlevo nahoře */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 20, md: 32 }, // větší odsazení shora
          left: { xs: 20, md: 32 }, // větší odsazení zleva
          zIndex: 3,
        }}
      >
        <Box
          component="img"
          src={logoSrc}
          alt="Logo"
          sx={{
            height: logoHeight,
            width: "auto",
            display: "block",
            filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))", // jemný bílý stín
          }}
        />
      </Box>

      {/* Ovládání */}
      {count > 1 && (
        <>
          <IconButton
            onClick={prev}
            aria-label="Předchozí snímek"
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              color: "white",
              backgroundColor: "rgba(0,0,0,.25)",
              "&:hover": { backgroundColor: "rgba(0,0,0,.4)" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={next}
            aria-label="Další snímek"
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              color: "white",
              backgroundColor: "rgba(0,0,0,.25)",
              "&:hover": { backgroundColor: "rgba(0,0,0,.4)" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}

      {/* Tečky */}
      {count > 1 && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 12,
            display: "flex",
            gap: 1,
            justifyContent: "center",
            zIndex: 3,
          }}
        >
          {slides.map((_, i) => (
            <Box
              key={i}
              onClick={() => goto(i)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: i === index ? "common.white" : "rgba(255,255,255,.5)",
                outline: "1px solid rgba(0,0,0,.2)",
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
