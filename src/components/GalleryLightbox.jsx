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
 * - startIndex?: number
 * - showThumbnails?: boolean   // default true
 * - thumbSize?: { w: number, h: number } // default {w: 96, h: 64}
 */
export default function GalleryLightbox({
  open,
  onClose,
  images = [],
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
            "linear-gradient(180deg, rgba(14,17,21,0.96), rgba(12,14,17,0.98))",
          backdropFilter: "blur(14px)",
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
          width: 52,
          height: 52,
          bgcolor: "rgba(255,255,255,0.08)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.1)",
          "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
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
          p: { xs: 2, md: 4.5 },
        }}
      >
        <Box
          component="img"
          key={images[index]}
          src={images[index]}
          alt=""
          loading="eager"
          sx={{
            maxWidth: "100%",
            maxHeight: showThumbnails ? "calc(100% - 168px)" : "calc(100% - 56px)",
            objectFit: "contain",
            boxShadow: "0 30px 80px rgba(0,0,0,0.42)",
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.08)",
            transition: "opacity 180ms ease, transform 180ms ease",
          }}
        />
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
              width: { xs: 52, md: 58 },
              height: { xs: 52, md: 58 },
              bgcolor: "rgba(255,255,255,0.08)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
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
              width: { xs: 52, md: 58 },
              height: { xs: 52, md: 58 },
              bgcolor: "rgba(255,255,255,0.08)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
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
              px: 1.6,
              py: 0.7,
              borderRadius: 999,
              bgcolor: "rgba(12,14,17,0.45)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography
              sx={{
                color: "rgba(255,255,255,0.82)",
                fontSize: "0.72rem",
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
            py: 1.6,
            px: { xs: 1.5, md: 2.5 },
            bgcolor: "rgba(12,14,17,0.74)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
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
                  width: thumbSize.w,
                  height: thumbSize.h,
                  borderRadius: 1.5,
                  overflow: "hidden",
                  flex: "0 0 auto",
                  position: "relative",
                  opacity: active ? 1 : 0.62,
                  transform: active ? "translateY(-2px)" : "none",
                  transition:
                    "opacity 160ms ease, transform 160ms ease, outline-color 160ms ease, box-shadow 160ms ease",
                  outline: active ? "2px solid" : "1px solid",
                  outlineColor: active
                    ? "#9a8060"
                    : "rgba(255,255,255,0.16)",
                  boxShadow: active
                    ? "0 0 0 1px rgba(255,255,255,0.08), 0 10px 24px rgba(0,0,0,0.28)"
                    : "none",
                }}
              >
                <Box
                  component="img"
                  src={src}
                  alt=""
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
