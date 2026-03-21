import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function SectionIntro({
  number,
  title,
  description,
  align = "left",
  sx = {},
}) {
  return (
    <Box sx={sx}>
      {number && (
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "3.5rem", md: "4.8rem" },
            fontWeight: 300,
            lineHeight: 0.9,
            color: "rgba(85,116,143,0.14)",
            userSelect: "none",
            textAlign: align,
            mb: -0.5,
          }}
        >
          {number}
        </Typography>
      )}

      <Typography variant="h2" sx={{ textAlign: align, maxWidth: "16ch" }}>
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body1"
          sx={{
            mt: 1.25,
            maxWidth: "58ch",
            color: "text.secondary",
            textAlign: align,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
