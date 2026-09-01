export const navConfig = [
  {
    to: "/ubytovani",
    key: "accommodation",
    fallback: "Ubytování",
    children: [{ to: "/cenik", key: "priceList", fallback: "Ceník" }],
  },
  { to: "/pobytove_balicky", key: "packages", fallback: "Pobyty" },
  {
    to: "/sal",
    key: "weddings",
    fallback: "Sál",
    children: [
      { to: "/svatby", key: "weddingsSvatby", fallback: "Svatby" },
      { to: "/oslavy", key: "weddingsOslavy", fallback: "Oslavy" },
      { to: "/ostatni", key: "weddingsOstatni", fallback: "Ostatní" },
    ],
  },
  { to: "/restaurace", key: "restaurant", fallback: "Restaurace" },
  { to: "/okoli", key: "nearbyPlaces", fallback: "Místa v okolí" },
  { to: "/galerie", key: "gallery", fallback: "Galerie" },
  { to: "/poukazy", key: "vouchers", fallback: "Poukazy" },
  { to: "/kontakt", key: "contact", fallback: "Kontakt" },
  { to: "/rezervace", key: "reservation", fallback: "Rezervace" },
];

export const langOptions = [
  { code: "cs", label: "Čeština" },
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "de", label: "Deutsch" },
];
