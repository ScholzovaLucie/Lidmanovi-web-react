import {
  Box,
  Stack,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { useEditorialEditor } from "../context/editorialEditorContext";
import { useGetPhotoPlacementsQuery } from "../redux/api/galleryApi";
import { resolveMediaUrl } from "../utils/resolveMediaUrl";
import PhotoEditBadge from "./PhotoEditBadge";

const LOCATION_PAGE_SIZE = 100;

export default function PhotoLocationEditor({ location, label, compact = false }) {
  const { isAuthenticated, isInlineEditing } = useEditorialEditor();

  const { data } = useGetPhotoPlacementsQuery(
    { location, page: 1, pageSize: LOCATION_PAGE_SIZE },
    { skip: !isAuthenticated || !isInlineEditing },
  );

  if (!isAuthenticated || !isInlineEditing) return null;

  const placements = data?.results || [];
  const sortedPlacements = [...placements].sort((a, b) => a.order - b.order);

  const panel = (
      <Paper
        variant="outlined"
        data-inline-edit-allow-action="true"
        sx={{
          position: "relative",
          p: 2,
          borderStyle: "dashed",
          borderColor: "secondary.main",
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Fotky: {label || location}
        </Typography>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {sortedPlacements.map((placement) => (
            <Box
              key={placement.id}
              sx={{
                width: 100,
                height: 75,
                borderRadius: 1,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                component="img"
                src={resolveMediaUrl(placement.photo?.variants?.card || placement.photo?.url)}
                alt={placement.photo?.alt_text || ""}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          ))}
        </Stack>

        <PhotoEditBadge
          location={location}
          singlePhoto={false}
          sx={{ top: 8, right: 8 }}
        />
      </Paper>
  );

  return compact ? panel : (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {panel}
    </Container>
  );
}
