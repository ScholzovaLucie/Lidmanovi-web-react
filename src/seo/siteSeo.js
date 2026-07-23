const SITE_NAME = "Penzion U Lidmanů";
const SITE_URL = "https://www.ulidmanu.cz";
const DEFAULT_TITLE = "Penzion U Lidmanů | Ubytování, restaurace a svatby v Machovské Lhotě";
const DEFAULT_DESCRIPTION =
  "Penzion U Lidmanů v Machovské Lhotě nabízí ubytování, restauraci, svatební prostory, pobytové balíčky i online rezervaci v srdci Broumovska.";
const DEFAULT_IMAGE = "/logolidman.webp";

export const SEO_DEFAULTS = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
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
      "penzion U Lidmanů, Machovská Lhota, ubytování Broumovsko, restaurace Machov, svatby Broumovsko, pobytové balíčky",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      name: "Penzion U Lidmanů",
      url: SITE_URL,
      image: DEFAULT_IMAGE,
      telephone: "+420604341863",
      email: "info@ulidmanu.cz",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Machovská Lhota 40",
        addressLocality: "Machov",
        postalCode: "549 31",
        addressCountry: "CZ",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 50.4975831,
        longitude: 16.2934947,
      },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Ubytování", value: true },
        { "@type": "LocationFeatureSpecification", name: "Restaurace", value: true },
        { "@type": "LocationFeatureSpecification", name: "Svatební prostory", value: true },
      ],
    },
  },
  "/restaurace": {
    title: "Restaurace",
    description:
      "Domácí restaurace Penzionu U Lidmanů pro hosty, rodinné oslavy, svatby i firemní akce v Machovské Lhotě.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "Restaurace U Lidmanů",
      url: `${SITE_URL}/restaurace`,
      image: DEFAULT_IMAGE,
      telephone: "+420604341863",
      servesCuisine: "Czech",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Machovská Lhota 40",
        addressLocality: "Machov",
        postalCode: "549 31",
        addressCountry: "CZ",
      },
    },
  },
  "/svatby": {
    title: "Svatby",
    description:
      "Svatební místo v penzionu U Lidmanů. Prostory, zázemí, ubytování i atmosféra pro svatbu v přírodě Broumovska.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EventVenue",
      name: "Svatební prostory U Lidmanů",
      url: `${SITE_URL}/svatby`,
      image: DEFAULT_IMAGE,
      telephone: "+420604341863",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Machovská Lhota 40",
        addressLocality: "Machov",
        postalCode: "549 31",
        addressCountry: "CZ",
      },
    },
  },
  "/ubytovani": {
    title: "Ubytování",
    description:
      "Komfortní ubytování v Penzionu U Lidmanů v Machovské Lhotě. Pokoje, zázemí a vynikající výchozí pozice pro výlety po Broumovsku.",
  },
  "/pobytove_balicky": {
    title: "Pobytové balíčky",
    description:
      "Výhodné pobytové balíčky v Penzionu U Lidmanů pro romantické pobyty, relax i aktivní dovolenou.",
  },
  "/galerie": {
    title: "Galerie",
    description:
      "Fotogalerie penzionu U Lidmanů – ubytování, restaurace, svatby i okolí Machovské Lhoty a Broumovska.",
  },
  "/kontakt": {
    title: "Kontakt",
    description:
      "Kontaktujte Penzion U Lidmanů. Najdete zde adresu, kontaktní údaje i mapu pro snadnou cestu do Machovské Lhoty.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Penzion U Lidmanů",
      url: SITE_URL,
      logo: DEFAULT_IMAGE,
      telephone: "+420604341863",
      email: "info@ulidmanu.cz",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Machovská Lhota 40",
        addressLocality: "Machov",
        postalCode: "549 31",
        addressCountry: "CZ",
      },
    },
  },
  "/cenik": {
    title: "Ceník",
    description:
      "Aktuální ceník ubytování a služeb Penzionu U Lidmanů v Machovské Lhotě.",
  },
  "/rezervace": {
    title: "Rezervace",
    description:
      "Online rezervace pobytu v Penzionu U Lidmanů. Vyberte termín a zajistěte si ubytování snadno online.",
  },
  "/gdpr": {
    title: "Ochrana osobních údajů",
    description: "Informace o zpracování osobních údajů v Penzionu U Lidmanů dle nařízení GDPR.",
    robots: "noindex, follow",
  },
  "/admin": {
    title: "Administrace",
    description: "Administrační část webu.",
    robots: "noindex, nofollow",
  },
};
