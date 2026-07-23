import SalPage from "./SalPage.jsx";

const content = {
  heroEyebrow: "Když si u nás řeknete „ano“",
  heroTitle: "Sál v horách",
  sectionTitle: "Váš den v romantické krajině",
  sectionText:
    "Svatbu u nás si zamilujete stejně jako naše krajina — romantické zázemí, prostorný sál i osobní přístup vytvoří den, na který budete s hosty vzpomínat. Obřad na zahradě, slavnostní hostina i večerní zábava pod jednou střechou, menu a raut připravíme přesně podle vašich představ.",
  stats: [
    { icon: "park", value: "Obřad na zahradě", text: "Romantické místo obklopené přírodou Broumovska" },
    { icon: "restaurant", value: "Slavnostní hostina", text: "Menu a raut připravíme přesně podle vašich představ" },
    { icon: "music", value: "Večerní zábava", text: "Živá hudba, tanec i posezení dlouho do noci" },
  ],
  contactCta: "Kontaktujte nás pro nezávaznou nabídku",
};

export default function Weddings() {
  return (
    <SalPage
      ns="svatby"
      photoLocation="svatby-uvod"
      fallbackImage="/svatba/svatba3.webp"
      content={content}
    />
  );
}
