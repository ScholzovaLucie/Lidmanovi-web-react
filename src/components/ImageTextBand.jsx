import {
  Box,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/app/appSlice";

/** Pomocný „pás“: obrázek jako background + text, střídání L/R, 90% šířky, centrované */
function ImageTextBand({
  image,
  title,
  titleNode,
  children,
  imageLeft = true,
  minHeight = { xs: 360, md: 440 },
}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const imgUrl = image?.startsWith("/") ? image : `/${image || ""}`;
  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: "100%", md: "100%" },
        mx: "auto",
        mb: { xs: 4, md: 5 },
        overflow: "hidden",
        display: "flex",
        flexDirection: { xs: "column", md: imageLeft ? "row" : "row-reverse" },
        minHeight,
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: isAuthenticated ? "secondary.main" : "rgba(85,116,143,0.12)",
        background: imageLeft ? "rgba(221,229,233,0.22)" : "rgba(255,255,255,0.98)",
        outline: isAuthenticated ? "1px dashed" : "none",
        outlineColor: isAuthenticated ? "secondary.main" : "transparent",
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
            background: "linear-gradient(180deg, rgba(18,20,24,0.08), rgba(18,20,24,0.16))",
          },
        }}
      />
      <Box
        sx={{
          flexBasis: { xs: "100%", md: "50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, md: 5 },
          py: { xs: 4, md: 5.5 },
          textAlign: "left",
        }}
      >
        <Box sx={{ maxWidth: 720, width: "100%" }}>
          {titleNode || (title && (
            <Typography
              variant="h5"
              sx={{
                mb: 1.75,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 400,
              }}
            >
              {title}
            </Typography>
          ))}
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default ImageTextBand;
