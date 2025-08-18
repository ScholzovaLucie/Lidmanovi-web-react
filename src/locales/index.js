// src/locales/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// místo `import GLOBAL from "./translations_global"`
import * as GLOBAL from "./translations_global";
import * as HOME from "./translations_index";
import * as KONTAKT from "./translations_kontakt";
import * as RESTAURACE from "./translations_restaurace";
import * as GALERIE from "./translations_galerie";
import * as SVATBY from "./translations_svatby";
import * as UBYTOVANI from "./translations_ubytovani";
import * as BALICKY from "./translations_balicky";
import * as CENIK from "./translation_cenik";

const resources = {
  cs: {
    global: GLOBAL.cs,
    home: HOME.cs,
    kontakt: KONTAKT.cs,
    restaurace: RESTAURACE.cs,
    galerie: GALERIE.cs,
    svatby: SVATBY.cs,
    ubytovani: UBYTOVANI.cs,
    balicky: BALICKY.cs,
    cenik: CENIK.cs,
  },
  en: {
    global: GLOBAL.en,
    home: HOME.en,
    kontakt: KONTAKT.en,
    restaurace: RESTAURACE.en,
    galerie: GALERIE.en,
    svatby: SVATBY.en,
    ubytovani: UBYTOVANI.en,
    balicky: BALICKY.en,
    cenik: CENIK.en,
  },
  de: {
    global: GLOBAL.de,
    home: HOME.de,
    kontakt: KONTAKT.de,
    restaurace: RESTAURACE.de,
    galerie: GALERIE.de,
    svatby: SVATBY.de,
    ubytovani: UBYTOVANI.de,
    balicky: BALICKY.de,
    cenik: CENIK.de,
  },
  pl: {
    global: GLOBAL.pl,
    home: HOME.pl,
    kontakt: KONTAKT.pl,
    restaurace: RESTAURACE.pl,
    galerie: GALERIE.pl,
    svatby: SVATBY.pl,
    ubytovani: UBYTOVANI.pl,
    balicky: BALICKY.pl,
    cenik: CENIK.pl,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "cs",
  fallbackLng: "cs",
  interpolation: { escapeValue: false },
  defaultNS: "global",
  ns: [
    "global",
    "home",
    "kontakt",
    "restaurace",
    "galerie",
    "svatby",
    "ubytovani",
    "balicky",
    "cenik",
  ],
});

export default i18n;
