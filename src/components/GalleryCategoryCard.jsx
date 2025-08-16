import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

/**
 * Karta kategorie galerie.
 * Props:
 * - title: string
 * - cover: string  // náhledový obrázek (z public)
 * - onClick: () => void
 */
export default function GalleryCategoryCard({ title, cover, onClick }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        <CardMedia
          component="img"
          image={cover}
          alt={title}
          sx={{ height: 220, objectFit: "cover" }}
          loading="lazy"
        />
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
