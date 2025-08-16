import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function TwoCol({
  imageLeft = true,
  image,
  title,
  text,
  ctaLabel,
  onCta,
}) {
  const Image = (
    <Box
      sx={{
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #eaeaea",
        backgroundImage: image ? `url(${image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        aspectRatio: "16/10",
      }}
    />
  );

  const Text = (
    <Box>
      {title && (
        <Typography
          component="h3"
          sx={{ fontSize: 24, fontWeight: 700, mb: 2 }}
        >
          {title}
        </Typography>
      )}
      {text && (
        <Typography sx={{ color: "text.secondary", mb: 2 }}>{text}</Typography>
      )}
      {ctaLabel && (
        <Button variant="contained" color="primary" onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </Box>
  );

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12} md={6} order={{ xs: 2, md: imageLeft ? 1 : 2 }}>
        {Text}
      </Grid>
      <Grid item xs={12} md={6} order={{ xs: 1, md: imageLeft ? 2 : 1 }}>
        {Image}
      </Grid>
    </Grid>
  );
}
