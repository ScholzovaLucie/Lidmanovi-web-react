import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";

/**
 * Karta kategorie galerie.
 * Props:
 * - title: string
 * - titleNode?: React.ReactNode
 * - cover: string  // náhledový obrázek (z public)
 * - onClick: () => void
 */
export default function GalleryCategoryCard({ title, titleNode, cover, onClick, index }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: "100%",
        height: "100%",
        border: 0,
        background: "transparent",
        p: 0,
        textAlign: "left",
        cursor: "pointer",
        overflow: "hidden",
        transition: "transform 180ms ease",
        boxShadow: "none",
        "&:hover": {
          transform: "translateY(-2px)",
        },
        "&:focus-visible": {
          outline: "1px solid rgba(154,128,96,0.55)",
          outlineOffset: 2,
        },
      }}
    >
      <Box
        component="img"
        src={cover}
        alt={title}
        loading="lazy"
        sx={{
          display: "block",
          width: "100%",
          aspectRatio: { xs: "4 / 3", sm: "4 / 3", lg: "4 / 2.55" },
          objectFit: "cover",
        }}
      />
      <Box sx={{ pt: 1.25, pb: 1 }}>
        {index != null && (
          <Typography
            sx={{
              display: "none",
              mb: 0.35,
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "primary.main",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </Typography>
        )}
        <Box
          sx={{
            "& .MuiTypography-root": {
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: { xs: "1.35rem", md: "1.45rem" },
              fontWeight: 400,
              lineHeight: 1.1,
              color: "text.primary",
            },
          }}
        >
          {titleNode || <Typography>{title}</Typography>}
        </Box>
      </Box>
    </Box>
  );
}
