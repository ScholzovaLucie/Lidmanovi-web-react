import SalPage from "./SalPage.jsx";

const content = {
  heroEyebrow: "Prostor pro vaše nejkrásnější chvíle",
  heroTitle: "Sál U Lidmanů",
  sectionTitle: "Jeden sál, tisíce možností",
  sectionText:
    "Náš společenský sál v srdci Broumovska je domovem svatbám, oslavám i firemním akcím. Ať plánujete obřad na zahradě, narozeninovou párty nebo firemní školení, nabídneme vám prostor, zázemí i ubytování na jednom místě — a rádi vám pomůžeme vybrat variantu přesně na míru vaší akci.",
  stats: [
    { icon: "number", value: "70", text: "Velký společenský sál — kapacita až pro 70 osob" },
    { icon: "number", value: "90", text: "Celková kapacita akce až 90 osob" },
    { icon: "number", value: "20", text: "Salónek pro komornější akce s kapacitou 20 osob" },
  ],
  contactCta: "Kontaktujte nás pro nezávaznou nabídku",
};

export default function Sal() {
  return (
    <SalPage
      ns="sal"
      photoLocation="sal-uvod"
      fallbackImage="/svatba/svatba3.webp"
      content={content}
    />
  );
}
