export const navConfig = [
  {
    to: "/ubytovani",
    key: "accommodation",
    children: [{ to: "/cenik", key: "priceList" }],
  },
  { to: "/pobytove_balicky", key: "packages" },
  { to: "/svatby", key: "weddings" },
  { to: "/restaurace", key: "restaurant" },
  { to: "/galerie", key: "gallery" },
  { to: "/kontakt", key: "contact" },
  { to: "/rezervace", key: "reservation" },
];

export const langOptions = [
  { code: "cs", label: "Čeština" },
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "de", label: "Deutsch" },
];
