import { Box } from "@mui/material";
import { usePhotoSequence } from "../hooks/usePhotoSequence";
import PhotoEditBadge from "./PhotoEditBadge";

export default function EditablePhotoSpot({
  location,
  fallback,
  alt,
  imgSx,
  wrapperSx,
}) {
  const { urls, alts } = usePhotoSequence(location, fallback);

  return (
    <Box sx={{ position: "relative", ...wrapperSx }}>
      <Box component="img" src={urls[0]} alt={alt ?? alts[0] ?? ""} sx={imgSx} />
      <PhotoEditBadge location={location} sx={{ top: 6, right: 6 }} />
    </Box>
  );
}
