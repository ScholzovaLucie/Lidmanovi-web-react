import SalPage from "./SalPage.jsx";

const content = {
  heroEyebrow: "Prostor, který se přizpůsobí vaší akci",
  heroTitle: "Sál pro firemní i soukromé akce",
  sectionTitle: "Univerzální zázemí v klidném prostředí hor",
  sectionText:
    "Firemní školení, teambuilding, seminář nebo soukromá párty mimo město — náš sál nabídne klid, dostatek prostoru i zázemí pro techniku a catering. Program, rozesazení i menu přizpůsobíme charakteru vaší akce, a pokud potřebujete přespat, ubytujeme přímo v penzionu i celý váš tým.",
  stats: [
    { icon: "groups", value: "Firemní školení", text: "Klidné prostředí mimo kancelář, ideální pro soustředěnou práci" },
    { icon: "event", value: "Semináře a workshopy", text: "Zázemí pro techniku, prezentace i skupinovou práci" },
    { icon: "music", value: "Soukromé večírky", text: "Prostor pro menší i větší společnost mimo domov" },
  ],
  contactCta: "Kontaktujte nás pro nezávaznou nabídku",
};

export default function OtherEvents() {
  return (
    <SalPage
      ns="ostatni"
      photoLocation="ostatni-uvod"
      fallbackImage="/svatba/svatba3.webp"
      content={content}
    />
  );
}
