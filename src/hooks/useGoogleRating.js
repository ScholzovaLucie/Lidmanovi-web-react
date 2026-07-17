import { useMemo } from "react";
import { usePlaceRatingQuery } from "../redux/api/roomsApi";
import { GOOGLE_RATING_FALLBACK } from "../utils/googleRating";

export function useGoogleRating() {
  const { data } = usePlaceRatingQuery();

  return useMemo(() => {
    const rating = data?.rating ?? GOOGLE_RATING_FALLBACK.rating;
    const reviewCount = data?.review_count ?? GOOGLE_RATING_FALLBACK.reviewCount;

    return {
      rating: String(rating).replace(".", ","),
      reviewCount: String(reviewCount),
    };
  }, [data]);
}
