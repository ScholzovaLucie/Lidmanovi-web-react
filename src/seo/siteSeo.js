const SITE_NAME = "Penzion U Lidmanu";
const DEFAULT_TITLE = "Penzion U Lidmanu | Ubytovani, restaurace a svatby v Machovske Lhote";
const DEFAULT_DESCRIPTION =
  "Penzion U Lidmanu v Machovske Lhote nabizi ubytovani, restauraci, svatebni prostory, pobytove balicky i online rezervaci v srdci Broumovska.";
const DEFAULT_IMAGE = "/logo_colour_pantone.webp";

export const SEO_DEFAULTS = {
  siteName: SITE_NAME,
  defaultTitle: DEFAULT_TITLE,
  titleTemplate: `%s | ${SITE_NAME}`,
  defaultDescription: DEFAULT_DESCRIPTION,
  defaultImage: DEFAULT_IMAGE,
};

export const SEO_ROUTES = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    keywords:
      "penzion U Lidmanu, Machovska Lhota, ubytovani Broumovsko, restaurace Machov, svatby Broumovsko, pobytove balicky",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      name: "Penzion U Lidmanu",
      url: "/",
      image: DEFAULT_IMAGE,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Machovska Lhota",
        addressCountry: "CZ",
      },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Ubytovani", value: true },
        { "@type": "LocationFeatureSpecification", name: "Restaurace", value: true },
        { "@type": "LocationFeatureSpecification", name: "Svatebni prostory", value: true },
      ],
    },
  },
  "/restaurace": {
    title: "Restaurace",
    description:
      "Domaci restaurace Penzionu U Lidmanu pro hosty, rodinne oslavy, svatby i firemni akce v Machovske Lhote.",
  },
  "/svatby": {
    title: "Svatby",
    description:
      "Svatebni misto v penzionu U Lidmanu. Prostory, zazemi, ubytovani i atmosfera pro svatbu v prirode Broumovska.",
  },
  "/ubytovani": {
    title: "Ubytovani",
    description:
      "Komfortni ubytovani v Penzionu U Lidmanu v Machovske Lhote. Pokoje, zazemi a vyborna vychozi pozice pro vylety po Broumovsku.",
  },
  "/pobytove_balicky": {
    title: "Pobytove balicky",
    description:
      "Vyhodne pobytove balicky v Penzionu U Lidmanu pro romanticke pobyty, relax i aktivni dovolenou.",
  },
  "/galerie": {
    title: "Galerie",
    description:
      "Fotogalerie penzionu U Lidmanu, ubytovani, restaurace, svateb i okoli Machovske Lhoty a Broumovska.",
  },
  "/kontakt": {
    title: "Kontakt",
    description:
      "Kontaktujte Penzion U Lidmanu. Najdete zde adresu, kontaktni udaje i mapu pro snadnou cestu do Machovske Lhoty.",
  },
  "/cenik": {
    title: "Cenik",
    description:
      "Aktualni cenik ubytovani a sluzeb Penzionu U Lidmanu v Machovske Lhote.",
  },
  "/rezervace": {
    title: "Rezervace",
    description:
      "Online rezervace pobytu v Penzionu U Lidmanu. Vyberte termin a zajistete si ubytovani snadno online.",
  },
  "/pokoje": {
    title: "Pokoje",
    description:
      "Prohlédněte si pokoje Penzionu U Lidmanu v Machovské Lhotě. Útulné ubytování s vybavením pro pohodlný pobyt v srdci Broumovska.",
    keywords: "pokoje penzion U Lidmanu, ubytování Machovská Lhota, pokoje Broumovsko",
  },
  "/admin": {
    title: "Administrace",
    description: "Administracni cast webu.",
    robots: "noindex, nofollow",
  },
};

