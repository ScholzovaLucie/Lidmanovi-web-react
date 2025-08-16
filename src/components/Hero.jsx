import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Hero({
  title,
  subtitle,
  image,
  gradientTop = "#9eb5c9",
}) {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 6, md: 10 },
        backgroundImage: image
          ? `linear-gradient(${gradientTop} 0 0), url(${image})`
          : `linear-gradient(${gradientTop} 0 0)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: image ? "auto, cover" : "auto",
        backgroundPosition: "center",
      }}
    >
      <Container maxWidth="lg">
        {title && (
          <Typography
            variant="h1"
            sx={{ color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.25)" }}
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant="body1"
            sx={{ mt: 2, color: "#fff", maxWidth: 700 }}
          >
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
