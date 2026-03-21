import FullBleedTiles from "../../components/FullBleedTiles.jsx";
import HeroCarousel from "../../components/HeroCarousel.jsx";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation(["home", "global"]);
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  return (
    <>
      <HeroCarousel
        variant="editorial"
        slides={[
          {
            src: asset("/uvod/uvod1.webp"),
          },
          {
            src: asset("/uvod/uvod2.webp"),
          },
          {
            src: asset("/uvod/uvod3.webp"),
          },
          {
            src: asset("/uvod/uvod4.webp"),
          },
          {
            src: asset("/uvod/nove5.webp"),
          },
        ]}
        eyebrow={t("global:footer.brand")}
        title={t("global:footer.tagline")}
        description={t("home:uvod")}
        primaryAction={{
          to: "/rezervace",
          label: t("global:nav.reservation"),
        }}
        secondaryAction={{
          to: "/kontakt",
          label: t("global:nav.contact"),
        }}
        interval={2000} // změň třeba na 4000 pro rychlejší střídání
        transition={100} // délka fade
        gradientTop="secondary.main"
      />

      <FullBleedTiles
        fullBleedHack
        translationNamespace="home"
        items={[
          {
            image: asset("/uvod/uvod1.webp"),
            textKey: "uvod",
          },
          {
            image: asset(
              "galerie/exterier/132_HZ6_4056_Penzion_U_Lidmanu.webp"
            ),
            textKey: "lokace",
          },
          {
            image: asset(
              "/galerie/exterier/022_HZ6_3836_Penzion_U_Lidmanu.webp"
            ),
            titleKey: "jablon.nadpis",
            textKey: "jablon.text",
          },
          {
            image: asset("/galerie/interier/opona.webp"),
            titleKey: "pribeh.nadpis",
            paragraphsKey: "pribeh.text",
          },
        ]}
      />
    </>
  );
}
