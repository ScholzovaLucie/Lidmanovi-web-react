import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

/**
 * Props:
 * - slides: [{ src, alt? }]
 * - interval: ms (auto-rotace), default 5000
 * - transition: ms (fade), default 800
 * - gradientTop: barva horního overlaye, default "#9eb5c9"
 * - logoSrc: cesta k logu (default "/images/logo.png")
 * - logoHeight: { xs, md } výška loga v px (default { xs: 40, md: 60 })
 * - fullBleedHack: pokud je Hero uvnitř Containeru a chceš přes okraj (default false)
 */
export default function HeroCarousel({
  slides = [],
  interval = 5000,
  transition = 800,
  gradientTop = "#9eb5c9",
  logoSrc = asset("/logolidman.webp"),
  logoHeight = { xs: 150, md: 150 },
  fullBleedHack = false,
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

  return (
    <Box
      component="section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      sx={{
        position: "relative",
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
              color: "#fff",
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
              color: "#fff",
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
