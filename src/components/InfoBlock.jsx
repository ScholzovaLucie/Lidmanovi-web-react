import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";

export default function InfoBlock({
  icon,
  title,
  titleNode,
  children,
  button,
  onButtonClick,
  sx = {},
  minHeight = { xs: 220, sm: 240, md: 240 },
  minWidth = { xs: 220, sm: 240, md: 240 },
}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Box
      sx={{
        position: "relative",
        p: { xs: 2.25, md: 2.75 },
        width: "100%",
        height: "100%",
        minHeight,
        minWidth,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        textAlign: "left",
        background: "rgba(255,255,255,0.96)",
        border: "1px solid",
        borderColor: isAuthenticated ? "secondary.main" : "rgba(85,116,143,0.14)",
        boxShadow: "0 16px 36px rgba(21,25,31,0.04)",
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
          justifyContent: "flex-start",
          gap: 1.1,
          mb: 1.25,
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
        {titleNode ?? (title && (
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: { xs: "1.45rem", md: "1.65rem" },
              lineHeight: 1.1,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>
        ))}
      </Box>

      <Box sx={{ flex: 1, display: "flex", alignItems: "flex-start", width: "100%" }}>
        <Box sx={{ width: "100%" }}>{children}</Box>
      </Box>

      {button && (
        <Box sx={{ mt: 2 }}>
          <Button variant="text" size="small" onClick={onButtonClick} sx={{ px: 0 }}>
            {button}
          </Button>
        </Box>
      )}
    </Box>
  );
}
