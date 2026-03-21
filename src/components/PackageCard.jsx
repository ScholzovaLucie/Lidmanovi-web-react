import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";

export default function PackageCard({ title, titleNode, image, onClick }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Card
      variant="outlined"
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 320, // všechny karty max 320px
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        borderColor: isAuthenticated ? "secondary.main" : undefined,
        outline: isAuthenticated ? "1px dashed" : "none",
        outlineColor: isAuthenticated ? "secondary.main" : "transparent",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        },
      }}
    >
      {isAuthenticated && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          Editovatelný blok
        </Box>
      )}
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
          {titleNode || (
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
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
