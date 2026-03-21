import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";

/**
 * Karta kategorie galerie.
 * Props:
 * - title: string
 * - cover: string  // náhledový obrázek (z public)
 * - onClick: () => void
 */
export default function GalleryCategoryCard({ title, cover, onClick, index }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: "100%",
        height: "100%",
        border: "1px solid rgba(85,116,143,0.14)",
        background: "rgba(255,255,255,0.96)",
        p: 0,
        textAlign: "left",
        cursor: "pointer",
        overflow: "hidden",
        transition:
          "border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
        boxShadow: "0 16px 36px rgba(21,25,31,0.04)",
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: "rgba(154,128,96,0.45)",
          boxShadow: "0 20px 44px rgba(21,25,31,0.08)",
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
          aspectRatio: { xs: "4 / 5", sm: "4 / 4.2", lg: "4 / 3.35" },
          objectFit: "cover",
        }}
      />
      <Box sx={{ p: { xs: 1.75, md: 2 } }}>
        {index != null && (
          <Typography
            sx={{
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
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "1.4rem", md: "1.55rem", lg: "1.45rem" },
            fontWeight: 400,
            lineHeight: 1.1,
            color: "text.primary",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
}
