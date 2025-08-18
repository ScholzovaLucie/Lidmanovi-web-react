import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@mui/material";

/** Pomocný „pás“: obrázek jako background + text, střídání L/R, 90% šířky, centrované */
function ImageTextBand({
  image,
  title,
  children,
  imageLeft = true,
  minHeight = { xs: 360, md: 440 },
}) {
  const imgUrl = image?.startsWith("/") ? image : `/${image || ""}`;
  return (
    <Paper
      variant="outlined"
      sx={{
        width: { xs: "100%", md: "90%" },
        mx: "auto",
        mb: 3,
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: { xs: "column", md: imageLeft ? "row" : "row-reverse" },
        minHeight,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Obrázek jako background */}
      <Box
        sx={{
          flexBasis: { xs: "100%", md: "50%" },
          minHeight,
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,.18)", // lehké ztmavení jako jinde
          },
        }}
      />
      {/* Text */}
      <Box
        sx={{
          flexBasis: { xs: "100%", md: "50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
          textAlign: "center",
        }}
      >
        <Box sx={{ maxWidth: 720, width: "100%" }}>
          {title && (
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
              {title}
            </Typography>
          )}
          {children}
        </Box>
      </Box>
    </Paper>
  );
}

export default ImageTextBand;
