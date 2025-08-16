import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Section({
  title,
  subtitle,
  children,
  id,
  maxWidth = "lg",
  py = { xs: 4, md: 6 },
}) {
  return (
    <Box component="section" id={id} sx={{ py }}>
      <Container maxWidth={maxWidth}>
        {title && (
          <Typography
            component="h2"
            sx={{ fontSize: 24, fontWeight: 700, mb: subtitle ? 1 : 3 }}
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography sx={{ mb: 3, color: "text.secondary" }}>
            {subtitle}
          </Typography>
        )}
        {children}
      </Container>
    </Box>
  );
}
