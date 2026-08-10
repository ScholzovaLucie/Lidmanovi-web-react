import React from "react";
import {
  Box,
  Dialog,
  IconButton,
  ButtonBase,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

/**
 * Lightbox s miniaturami
 * Props:
 * - open, onClose
 * - images: string[]           // cesty z public (začni "/")
 * - alts?: string[]            // alt texty, paralelní pole k images
 * - startIndex?: number
 * - showThumbnails?: boolean   // default true
 * - thumbSize?: { w: number, h: number } // default {w: 96, h: 64}
 */
export default function GalleryLightbox({
  open,
  onClose,
  images = [],
  alts = [],
  startIndex = 0,
  showThumbnails = true,
  thumbSize = { w: 96, h: 64 },
}) {
  const [index, setIndex] = React.useState(startIndex);
  const count = images.length;

  React.useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  React.useEffect(() => {
    if (!open || count < 2) return;
    const preloadIndexes = [
      (index + 1) % count,
      (index - 1 + count) % count,
    ];
    preloadIndexes.forEach((i) => {
      const img = new Image();
      img.src = images[i];
    });
  }, [count, images, index, open]);

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  // klávesy
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // refs pro automatické centrování aktivní miniatury
  const stripRef = React.useRef(null);
  const thumbRefs = React.useRef([]);

  React.useEffect(() => {
    if (!showThumbnails || !open) return;
    const el = thumbRefs.current[index];
    if (el?.scrollIntoView) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [index, open, showThumbnails]);

  if (!count) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          background:
            "radial-gradient(circle at 50% 18%, rgba(70, 96, 119, 0.16), transparent 34%), linear-gradient(180deg, rgba(43, 38, 32, 0.98), rgba(28, 25, 21, 0.99))",
          backdropFilter: "blur(18px)",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Zavřít"
        sx={{
          position: "fixed",
          top: { xs: 12, md: 20 },
          right: { xs: 12, md: 20 },
          zIndex: 3,
          width: { xs: 46, md: 58 },
          height: { xs: 46, md: 58 },
          bgcolor: "rgba(248, 244, 236, 0.1)",
          color: "primary.contrastText",
          border: "1px solid rgba(226, 214, 194, 0.24)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
          "&:hover": {
            bgcolor: "rgba(248, 244, 236, 0.18)",
            borderColor: "rgba(226, 214, 194, 0.42)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1.5, md: 8, lg: 11 },
          pt: { xs: 8, md: 9 },
          pb: showThumbnails
            ? { xs: "118px", md: "138px" }
            : { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            key={images[index]}
            src={images[index]}
            alt={alts[index] || ""}
            loading="eager"
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              boxShadow: "0 34px 90px rgba(0,0,0,0.46)",
              borderRadius: { xs: 1, md: 1.5 },
              border: "1px solid rgba(226, 214, 194, 0.22)",
              bgcolor: "rgba(18, 16, 14, 0.48)",
              transition: "opacity 180ms ease, transform 180ms ease",
            }}
          />
        </Box>
      </Box>

      {count > 1 && (
        <>
          <IconButton
            onClick={prev}
            aria-label="Předchozí"
            sx={{
              position: "fixed",
              left: { xs: 12, md: 20 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              width: { xs: 48, md: 62 },
              height: { xs: 48, md: 62 },
              bgcolor: "rgba(248, 244, 236, 0.1)",
              color: "primary.contrastText",
              border: "1px solid rgba(226, 214, 194, 0.24)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
              "&:hover": {
                bgcolor: "rgba(248, 244, 236, 0.18)",
                borderColor: "rgba(226, 214, 194, 0.42)",
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={next}
            aria-label="Další"
            sx={{
              position: "fixed",
              right: { xs: 12, md: 20 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              width: { xs: 48, md: 62 },
              height: { xs: 48, md: 62 },
              bgcolor: "rgba(248, 244, 236, 0.1)",
              color: "primary.contrastText",
              border: "1px solid rgba(226, 214, 194, 0.24)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
              "&:hover": {
                bgcolor: "rgba(248, 244, 236, 0.18)",
                borderColor: "rgba(226, 214, 194, 0.42)",
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          <Box
            sx={{
              position: "fixed",
              top: { xs: 18, md: 28 },
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              px: 2,
              py: 0.8,
              borderRadius: 999,
              bgcolor: "rgba(28, 25, 21, 0.72)",
              border: "1px solid rgba(226, 214, 194, 0.2)",
              boxShadow: "0 12px 34px rgba(0,0,0,0.24)",
            }}
          >
            <Typography
              sx={{
                color: "rgba(248, 244, 236, 0.84)",
                fontSize: "0.76rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </Typography>
          </Box>
        </>
      )}

      {showThumbnails && count > 1 && (
        <Box
          ref={stripRef}
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            py: { xs: 1.2, md: 1.6 },
            px: { xs: 1.5, md: 2.5 },
            bgcolor: "rgba(34, 30, 26, 0.88)",
            borderTop: "1px solid rgba(226, 214, 194, 0.18)",
            display: "flex",
            gap: 1.1,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            zIndex: 2,
          }}
        >
          {images.map((src, i) => {
            const active = i === index;
            return (
              <ButtonBase
                key={src + i}
                onClick={() => setIndex(i)}
                ref={(el) => (thumbRefs.current[i] = el)}
                sx={{
                  width: { xs: Math.max(76, thumbSize.w - 12), md: thumbSize.w + 16 },
                  height: { xs: Math.max(54, thumbSize.h - 6), md: thumbSize.h + 12 },
                  borderRadius: 1,
                  overflow: "hidden",
                  flex: "0 0 auto",
                  position: "relative",
                  opacity: active ? 1 : 0.58,
                  transform: active ? "translateY(-3px)" : "none",
                  transition:
                    "opacity 160ms ease, transform 160ms ease, outline-color 160ms ease, box-shadow 160ms ease",
                  outline: active ? "2px solid" : "1px solid",
                  outlineColor: active
                    ? "#c8b28f"
                    : "rgba(226, 214, 194, 0.2)",
                  boxShadow: active
                    ? "0 0 0 1px rgba(248,244,236,0.1), 0 12px 28px rgba(0,0,0,0.34)"
                    : "none",
                  "&:hover": {
                    opacity: 1,
                    outlineColor: active
                      ? "#c8b28f"
                      : "rgba(226, 214, 194, 0.46)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={alts[i] || ""}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </ButtonBase>
            );
          })}
        </Box>
      )}
    </Dialog>
  );
}
