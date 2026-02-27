import React from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";

export default function InfoBlock({
  icon,
  title,
  children,
  button,
  onButtonClick,
  sx = {},
  minHeight = { xs: 220, sm: 240, md: 240 },
  minWidth = { xs: 220, sm: 240, md: 240 },
}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Paper
      variant="outlined"
      sx={{
        position: "relative",
        borderRadius: 2,
        p: 2,
        width: "100%", // <<< sjednocená šířka
        height: "100%",
        minHeight,
        minWidth,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // <<< rozdělí nahoře/dole
        alignItems: "center", // <<< horizontální střed
        textAlign: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        borderColor: isAuthenticated ? "secondary.main" : undefined,
        outline: isAuthenticated ? "1px dashed" : "none",
        outlineColor: isAuthenticated ? "secondary.main" : "transparent",
        ...sx,
      }}
    >
      {isAuthenticated && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          mb: 1,
        }}
      >
        {icon && (
          <Box
            component="img"
            src={icon}
            alt=""
            sx={{ width: 28, height: 28, flexShrink: 0 }}
          />
        )}
        {title && (
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700 }}>
            {title}
          </Typography>
        )}
      </Box>

      {/* Content – zarovnáno doprostřed */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%" }}>{children}</Box>
      </Box>

      {/* Footer (button) */}
      {button && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" size="small" onClick={onButtonClick}>
            {button}
          </Button>
        </Box>
      )}
    </Paper>
  );
}
