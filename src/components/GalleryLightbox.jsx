import React from "react";
import {
  Box,
  Dialog,
  IconButton,
  MobileStepper,
  ButtonBase,
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
      PaperProps={{ sx: { backgroundColor: "rgba(0,0,0,0.92)" } }}
    >
      {/* Zavřít */}
      <IconButton
        onClick={onClose}
        aria-label="Zavřít"
        sx={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 3,
          bgcolor: "rgba(255,255,255,.12)",
          color: "#fff",
          "&:hover": { bgcolor: "rgba(255,255,255,.2)" },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Obrázek */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, md: 4 },
        }}
      >
        <Box
          component="img"
          src={images[index]}
          alt=""
          loading="eager"
          sx={{
            maxWidth: "100%",
            maxHeight: showThumbnails ? "calc(100% - 110px)" : "100%",
            objectFit: "contain",
            boxShadow: "0 8px 30px rgba(0,0,0,.6)",
            borderRadius: 1,
          }}
        />
      </Box>

      {/* Ovládání vlevo/vpravo */}
      {count > 1 && (
        <>
          <IconButton
            onClick={prev}
            aria-label="Předchozí"
            sx={{
              position: "fixed",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              bgcolor: "rgba(255,255,255,.12)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(255,255,255,.2)" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={next}
            aria-label="Další"
            sx={{
              position: "fixed",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              bgcolor: "rgba(255,255,255,.12)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(255,255,255,.2)" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          {/* Tečky (ponechávám, klidně smaž, když stačí miniatury) */}
          <MobileStepper
            variant="dots"
            steps={count}
            position="static"
            activeStep={index}
            nextButton={null}
            backButton={null}
            sx={{
              position: "fixed",
              bottom: showThumbnails ? 92 : 12,
              left: 0,
              right: 0,
              mx: "auto",
              bgcolor: "transparent",
              ".MuiMobileStepper-dot": { bgcolor: "rgba(255,255,255,.4)" },
              ".MuiMobileStepper-dotActive": { bgcolor: "#fff" },
              zIndex: 2,
            }}
          />
        </>
      )}

      {/* Miniatury */}
      {showThumbnails && count > 1 && (
        <Box
          ref={stripRef}
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            py: 1.5,
            px: 2,
            bgcolor: "rgba(0,0,0,0.7)",
            borderTop: "1px solid rgba(255,255,255,.12)",
            display: "flex",
            gap: 1,
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
                  borderRadius: 1,
                  overflow: "hidden",
                  flex: "0 0 auto",
                  position: "relative",
                  opacity: active ? 1 : 0.75,
                  outline: active ? "2px solid" : "1px solid",
                  outlineColor: active
                    ? "primary.main"
                    : "rgba(255,255,255,.25)",
                  boxShadow: active
                    ? "0 0 0 2px rgba(0,0,0,0.6) inset"
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
