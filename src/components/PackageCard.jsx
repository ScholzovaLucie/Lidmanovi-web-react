import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

export default function PackageCard({ title, image, onClick }) {
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        maxWidth: 320, // všechny karty max 320px
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {/* Obrázek s konstantním poměrem stran */}
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16 / 10", // stejné pro všechny karty
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        />

        <CardContent
          sx={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: "auto", // text dosedne dolů, karty jsou vyrovnané
            minHeight: 72, // rezerva pro 2 řádky textu
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              display: "-webkit-box",
              WebkitLineClamp: 2, // ořeže na 2 řádky
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
