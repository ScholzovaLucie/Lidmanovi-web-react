import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Stripe({
  children,
  bg = "#9eb5c9",
  color = "#fff",
  py = { xs: 2.5, md: 3 },
}) {
  return (
    <Box sx={{ backgroundColor: bg, color, py }}>
      <Container maxWidth="lg">
        <Typography variant="body1" sx={{ m: 0 }}>
          {children}
        </Typography>
      </Container>
    </Box>
  );
}
