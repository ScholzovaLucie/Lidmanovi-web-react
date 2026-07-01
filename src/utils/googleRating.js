export const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=Pension+-+Restaurace+U+Lidman%C5%AF+Recenze";

export const GOOGLE_RATING_FALLBACK = {
  rating: "4,8",
  reviewCount: "758",
};

export function formatGoogleRating({ rating, reviewCount } = GOOGLE_RATING_FALLBACK) {
  return `★ ${rating} · ${reviewCount} recenzí`;
}
