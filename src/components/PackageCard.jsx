import React from "react";
import {
  ButtonBase,
  Typography,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";

export default function PackageCard({ title, titleNode, image, onClick, index }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 390,
        display: "block",
        textAlign: "left",
        border: "1px solid",
        borderColor: isAuthenticated ? "secondary.main" : "#dfd4c4",
        backgroundColor: "background.paper",
        overflow: "hidden",
        transition:
          "transform 140ms ease, box-shadow 180ms ease, border-color 180ms ease",
        boxShadow: "none",
        outline: isAuthenticated ? "1px dashed" : "none",
        outlineColor: isAuthenticated ? "secondary.main" : "transparent",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 10px 28px rgba(45,40,35,0.08)",
          borderColor: "primary.main",
        },
        "&:focus-visible": {
          outline: "1px solid rgba(154,128,96,0.55)",
          outlineOffset: 2,
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16 / 10",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        />

        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            minHeight: 160,
          }}
        >
          {index != null && (
            <Typography
              sx={{ display: "none" }}
            >
              {String(index + 1).padStart(2, "0")}
            </Typography>
          )}
          {titleNode || (
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: { xs: "1.5rem", md: "1.7rem" },
                fontWeight: 400,
                lineHeight: 1.12,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {title}
            </Typography>
          )}
        </Box>
      </Box>
    </ButtonBase>
  );
}
