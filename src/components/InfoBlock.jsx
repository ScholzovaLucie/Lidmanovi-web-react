import React from "react";
import { Paper, Box, Typography, Button } from "@mui/material";

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
  return (
    <Paper
      variant="outlined"
      sx={{
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
        ...sx,
      }}
    >
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
