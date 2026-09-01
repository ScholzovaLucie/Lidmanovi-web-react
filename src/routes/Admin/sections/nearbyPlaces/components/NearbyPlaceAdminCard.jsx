import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Delete, Edit, Language, OpenInNew } from "@mui/icons-material";
import { usePhotoSequence } from "../../../../../hooks/usePhotoSequence.js";
import { AppCardCustomizable } from "../../../../../components/containers/AppCard";

export default function NearbyPlaceAdminCard({ place, onEdit, onDelete }) {
  const { urls } = usePhotoSequence(`nearby-place-${place.id}`, [], {
    skip: place.media_type !== "image",
  });
  const thumbnailUrl = urls[0];

  return (
    <AppCardCustomizable>
      <Box sx={{ position: "relative" }}>
        {!place.is_active && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              bgcolor: "rgba(180,180,180,0.55)",
              backdropFilter: "grayscale(1)",
              pointerEvents: "none",
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 4,
            display: "flex",
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={() => onEdit(place)}
            sx={{ bgcolor: "rgba(255,255,255,0.9)", color: "primary.main", "&:hover": { bgcolor: "rgba(255,255,255,1)" } }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(place.id)}
            sx={{ bgcolor: "rgba(255,255,255,0.9)", color: "error.main", "&:hover": { bgcolor: "rgba(255,255,255,1)" } }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: "100%",
            aspectRatio: "16 / 10",
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {place.media_type === "iframe" ? (
            <Stack alignItems="center" spacing={0.5} color="text.secondary">
              <Language fontSize="large" />
              <Typography variant="caption">Iframe</Typography>
            </Stack>
          ) : thumbnailUrl ? (
            <Box
              component="img"
              src={thumbnailUrl}
              alt=""
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              Bez fotky
            </Typography>
          )}
        </Box>

        <Stack spacing={0.5} sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 600 }}>{place.name}</Typography>
          {place.link && (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ color: "text.secondary", overflow: "hidden" }}
            >
              <OpenInNew fontSize="inherit" />
              <Typography variant="caption" noWrap>
                {place.link}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>
    </AppCardCustomizable>
  );
}
