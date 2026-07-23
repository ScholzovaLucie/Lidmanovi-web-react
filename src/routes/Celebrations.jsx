import SalPage from "./SalPage.jsx";

const content = {
  heroEyebrow: "Oslavte s námi výjimečný den",
  heroTitle: "Sál pro vaše oslavy",
  sectionTitle: "Nezapomenutelný večer pro vaše hosty",
  sectionText:
    "Narozeniny, výročí, rodinné sešlosti nebo oslava životního jubilea — náš sál i přilehlá zahrada nabídnou dostatek prostoru pro vás i všechny vaše hosty. O hudbu, výzdobu i harmonogram večera se postaráme společně, menu a raut sestavíme přesně podle vaší chuti a rozpočtu.",
  stats: [
    { icon: "cake", value: "Narozeniny a výročí", text: "Oslavte kulaté narozeniny nebo výročí ve velkém stylu" },
    { icon: "groups", value: "Rodinná setkání", text: "Dostatek místa pro širší rodinu i přátele" },
    { icon: "restaurant", value: "Raut na míru", text: "Menu a nápoje připravíme podle vaší chuti a rozpočtu" },
  ],
  contactCta: "Kontaktujte nás pro nezávaznou nabídku",
};

export default function Celebrations() {
  return (
    <SalPage
      ns="oslavy"
      photoLocation="oslavy-uvod"
      fallbackImage="/svatba/svatba3.webp"
      content={content}
    />
  );
}
