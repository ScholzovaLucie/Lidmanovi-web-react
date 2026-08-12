import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link as RouterLink } from "react-router-dom";
import { useEditorialEditor } from "../context/editorialEditorContext";
import EditableTranslationText from "./EditableTranslationText";

const asset = (path) => {
  if (/^https?:\/\//.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
};

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
  titleNode,
  description,
  descriptionNode,
  primaryAction,
  secondaryAction,
  stats = [],
}) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [descExpanded, setDescExpanded] = React.useState(false);
  const { isAuthenticated: isEditorAuth, isInlineEditing } = useEditorialEditor();
  const isEditingNow = isEditorAuth && isInlineEditing;
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
          minHeight: { xs: "auto", md: "calc(100vh - 64px)" },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1fr)" },
          backgroundColor: "background.default",
          borderBottom: "1px solid #dfd4c4",
        }}
      >
        <Stack
          justifyContent="center"
          sx={{
            px: { xs: 3, md: 6, lg: 8 },
            py: { xs: 5, md: 7 },
            minWidth: 0,
            width: "100%",
          }}
        >
          {eyebrow && (
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                color: "primary.dark",
                fontSize: "0.84rem",
                letterSpacing: 0,
                textTransform: "none",
              }}
            >
              {eyebrow}
            </Typography>
          )}

          {(titleNode || title) && (
            <Typography
              component="div"
              variant="h1"
              sx={{
                width: "100%",
                maxWidth: "none",
                mb: 2.2,
                color: "text.primary",
                fontSize: { xs: "2.55rem", md: "3.55rem", lg: "4.05rem" },
                "& .MuiTypography-root": {
                  font: "inherit",
                  color: "inherit",
                  lineHeight: "inherit",
                  width: "100%",
                  maxWidth: "none",
                },
                "& > .MuiBox-root": {
                  borderColor: "secondary.main",
                  backgroundColor: "rgba(255,253,248,0.76)",
                },
                "& > .MuiBox-root .MuiInputBase-root": {
                  font: "inherit",
                  color: "inherit",
                },
              }}
            >
              {titleNode || title}
            </Typography>
          )}

          {(descriptionNode || description) && (
            <>
              <Typography
                component="div"
                variant="body1"
                sx={{
                  width: "100%",
                  maxWidth: "none",
                  color: "text.secondary",
                  mb: isEditingNow ? 3 : 1,
                  ...(!isEditingNow &&
                    !descExpanded && {
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }),
                  "& .MuiTypography-root": {
                    font: "inherit",
                    color: "inherit",
                    lineHeight: "inherit",
                  },
                  "& > .MuiBox-root": {
                    borderColor: "secondary.main",
                    backgroundColor: "rgba(255,253,248,0.76)",
                  },
                }}
              >
                {descriptionNode || description}
              </Typography>
              {!isEditingNow && (
                <Box
                  component="button"
                  type="button"
                  onClick={() => setDescExpanded((value) => !value)}
                  sx={{
                    display: "inline-block",
                    mb: 3,
                    p: 0,
                    border: 0,
                    background: "none",
                    color: "primary.main",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                    "&:hover": { color: "primary.dark" },
                  }}
                >
                  {descExpanded ? "Zobrazit méně" : "Číst více"}
                </Box>
              )}
            </>
          )}

          {(primaryAction || secondaryAction) && (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4, flexWrap: "wrap" }}>
              {primaryAction && (
                <Button component={RouterLink} to={primaryAction.to} variant="contained" sx={{ px: 2.5, py: 1.15 }}>
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  component={RouterLink}
                  to={secondaryAction.to}
                  variant="outlined"
                  sx={{
                    px: 2.5,
                    py: 1.05,
                    color: "text.primary",
                    borderColor: "#d8cbb8",
                    "&:hover": { borderColor: "primary.main", bgcolor: "transparent" },
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
              spacing={{ xs: 2, md: 5 }}
              sx={{
                pt: 1,
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              {stats.map((stat, i) => (
                <Box
                  key={stat.labelKey || stat.label || i}
                  component={stat.href ? "a" : "div"}
                  href={stat.href}
                  target={stat.href ? "_blank" : undefined}
                  rel={stat.href ? "noopener noreferrer" : undefined}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    minWidth: { xs: 76, md: 128 },
                  }}
                >
                  {stat.ns && stat.valueKey ? (
                    <EditableTranslationText
                      ns={stat.ns}
                      i18nKey={stat.valueKey}
                      fallback={stat.value}
                      multilineRows={1}
                      sx={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: { xs: "1.8rem", md: "3.7rem" },
                        lineHeight: 1,
                        color: "primary.main",
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: { xs: "1.8rem", md: "3.7rem" },
                        lineHeight: 1,
                        color: "primary.main",
                      }}
                    >
                      {stat.value}
                    </Typography>
                  )}
                  {stat.ns && stat.labelKey ? (
                    <EditableTranslationText
                      ns={stat.ns}
                      i18nKey={stat.labelKey}
                      fallback={stat.label}
                      variant="body2"
                      multilineRows={1}
                      sx={{
                        mt: 0.4,
                        fontSize: { xs: "0.65rem", md: "0.875rem" },
                        letterSpacing: { xs: "0.08em", md: "0.16em" },
                        textTransform: "uppercase",
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.4,
                        fontSize: { xs: "0.65rem", md: "0.875rem" },
                        letterSpacing: { xs: "0.08em", md: "0.16em" },
                        textTransform: "uppercase",
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Stack>

        <Box
          sx={{
            position: "relative",
            minHeight: { xs: 360, md: "auto" },
            backgroundColor: "#e9dfd0",
            borderLeft: { xs: "none", md: "1px solid" },
            borderTop: { xs: "1px solid", md: "none" },
            borderColor: "#dfd4c4",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "background.paper",
            }}
          >
            {heroSlides.map((slide, i) => (
              <Box
                key={slide.src}
                sx={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  opacity: i === index % heroSlides.length ? 1 : 0,
                  transition: `opacity ${transition}ms ease`,
                }}
              >
                <Box
                  component="img"
                  src={slide.src}
                  alt={slide.alt || ""}
                  loading={i === 0 ? undefined : "lazy"}
                  decoding="async"
                  fetchpriority={i === 0 ? "high" : "low"}
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
