import { useGetPhotoPlacementsQuery } from "../redux/api/galleryApi";
import { resolveMediaUrl } from "../utils/resolveMediaUrl";

const DEFAULT_PAGE_SIZE = 100;

export function usePhotoSequence(location, fallbackUrls = []) {
  const { data, isLoading } = useGetPhotoPlacementsQuery({
    location,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const placements = data?.results || [];
  const sorted = [...placements].sort((a, b) => a.order - b.order);
  const apiUrls = sorted
    .map((p) => resolveMediaUrl(p.photo?.url))
    .filter(Boolean);

  return {
    urls: apiUrls.length ? apiUrls : fallbackUrls,
    isLoading,
  };
}
