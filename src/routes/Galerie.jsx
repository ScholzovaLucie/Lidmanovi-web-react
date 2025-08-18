import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import GalleryCategoryCard from "../components/GalleryCategoryCard.jsx";
import GalleryLightbox from "../components/GalleryLightbox.jsx";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

/** DATA – cesty z public/… (původní HTML jste měla bez počátečního lomítka; v Reactu používej "/…") */
const GALLERIES = [
  {
    id: "kam-prijedete",
    title: "Kam přijedete",
    cover: asset("/galerie/exterier/132_HZ6_4056_Penzion_U_Lidmanu.webp"),
    images: [
      asset("/galerie/exterier/132_HZ6_4056_Penzion_U_Lidmanu.webp"),
      asset("/galerie/exterier/128_DJI_0426_Penzion_U_Lidmanu.webp"),
      asset("/galerie/exterier/DSC_0631.webp"),
      asset("/galerie/exterier/004_HZ6_3765_Penzion_U_Lidmanu.webp"),
      asset("/galerie/kamPrijedete/2021-10-9 - Renata a Karel-5.webp"),
      asset("/galerie/kamPrijedete/2724f156d32b9a429328.webp"),
      asset("/galerie/kamPrijedete/b4302.webp"),
      asset("/galerie/kamPrijedete/b4345.webp"),
      asset("/galerie/kamPrijedete/b4387.webp"),
      asset("/galerie/kamPrijedete/br2095.webp"),
      asset("/galerie/kamPrijedete/FotkaskoleniVodafone.webp"),
      asset("/galerie/exterier/nove1.webp"),
      asset("/galerie/exterier/nove3.webp"),
      asset("/galerie/exterier/nove4.webp"),
      asset("/galerie/exterier/nove5.webp"),
      asset("/galerie/exterier/nove8.webp"),
      asset("/galerie/exterier/nove9.webp"),
      asset("/galerie/exterier/nove11.webp"),
    ],
  },
  {
    id: "kde-se-vyspite",
    title: "Kde se vyspíte",
    cover: asset("/galerie/pokoje/039_HZ6_3852_Penzion_U_Lidmanu.webp"),
    images: [
      asset("/galerie/pokoje/039_HZ6_3852_Penzion_U_Lidmanu.webp"),
      asset("/galerie/pokoje/058_HZ6_3886_Penzion_U_Lidmanu.webp"),
      asset("/galerie/pokoje/064_HZ6_3901_Penzion_U_Lidmanu.webp"),
      asset("/galerie/pokoje/049_HZ6_3870_Penzion_U_Lidmanu.webp"),
      asset("/galerie/pokoje/078_HZ6_3927_Penzion_U_Lidmanu.webp"),
      asset("/galerie/pokoje/081_HZ6_3941_Penzion_U_Lidmanu.webp"),
      asset("/galerie/pokoje/036_HZ6_3846_Penzion_U_Lidmanu.webp"),
      asset("/galerie/pokoje/047_HZ6_3865_Penzion_U_Lidmanu.webp"),
      asset("/galerie/kdeSeVyspite/107da0d0325a4274ba02.webp"),
      asset("/galerie/kdeSeVyspite/373b8cbfb9d4174ea364.webp"),
      asset("/galerie/kdeSeVyspite/3410d5b3bfadc6fa3ea7.webp"),
    ],
  },
  {
    id: "kde-se-najite",
    title: "Kde se najíte",
    cover: asset("/galerie/interier/099_HZ6_3978_Penzion_U_Lidmanu.webp"),
    images: [
      asset("/galerie/interier/100_HZ6_3979_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/099_HZ6_3978_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/101_HZ6_3981_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/102_HZ6_3987_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/103_HZ6_3988_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/107_HZ6_3994_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/093_HZ6_3968_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/094_HZ6_3969_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/092_HZ6_3966_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/087_HZ6_3955_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/088_HZ6_3958_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/089_HZ6_3960_Penzion_U_Lidmanu.webp"),
      asset("/galerie/interier/091_HZ6_3962_Penzion_U_Lidmanu.webp"),
      asset("/galerie/KdeSeNajite/1fd98ab9ecf7488c17ba.webp"),
      asset("/galerie/KdeSeNajite/3c80f85861675816c542.webp"),
      asset("/galerie/KdeSeNajite/3d4507f0b89720a97987.webp"),
      asset("/galerie/KdeSeNajite/5cc84c285c46ec7500f3.webp"),
      asset("/galerie/KdeSeNajite/7cafef1f8324a1a8b84f.webp"),
      asset("/galerie/KdeSeNajite/2021-10-9 - Renata a Karel-3.webp"),
      asset("/galerie/KdeSeNajite/18601d7664f70a5994b4.webp"),
      asset("/galerie/KdeSeNajite/48702cee4ce12e0d8049.webp"),
      asset("/galerie/KdeSeNajite/057938a3e04122beb61a.webp"),
      asset("/galerie/KdeSeNajite/87912da29720bb906a81.webp"),
      asset("/galerie/KdeSeNajite/a19cc5ed12e42c0b67b1.webp"),
      asset("/galerie/KdeSeNajite/a42187cea42248b6eb86.webp"),
      asset("/galerie/KdeSeNajite/bb50846fd53d057ea30d.webp"),
      asset("/galerie/KdeSeNajite/br2058.webp"),
      asset("/galerie/KdeSeNajite/ce87af1c4f70c77a664c.webp"),
      asset("/galerie/KdeSeNajite/DSC_0506.webp"),
      asset("/galerie/KdeSeNajite/fa97b744f2e5a4b7f3ce.webp"),
      asset("/galerie/KdeSeNajite/fcc6f6f38fb88301e85a.webp"),
    ],
  },
  {
    id: "ano",
    title: 'Když si u nás řeknete "ANO"',
    cover: asset("/galerie/svadba/075A5198.webp"),
    images: [
      asset("/galerie/sal/111_HZ6_3999_Penzion_U_Lidmanu.webp"),
      asset("/galerie/svadba/075A5198.webp"),
      asset("/galerie/svadba/075A5239.webp"),
      asset("/galerie/svadba/IMG_0192.webp"),
      asset("/galerie/svadba/IMG_0191.webp"),
      asset("/galerie/svadba/075A5224.webp"),
      asset("/galerie/svadba/IMG_0193.webp"),
      asset("/galerie/svadba/SVATBA2.webp"),
      asset("/galerie/svadba/svatba.webp"),
      asset("/galerie/sal/113_HZ6_4001_Penzion_U_Lidmanu.webp"),
      asset("/galerie/sal/114_HZ6_4003_Penzion_U_Lidmanu.webp"),
      asset("/galerie/svadba/IMG_0211.webp"),
      asset("/galerie/kdyzANO/075A5198.webp"),
      asset("/galerie/kdyzANO/075A5237.webp"),
      asset("/galerie/kdyzANO/075A5252.webp"),
      asset("/galerie/kdyzANO/075A5344.webp"),
      asset("/galerie/kdyzANO/2021-10-9 - Renata a Karel-110.webp"),
      asset("/galerie/kdyzANO/2021-10-9 - Renata a Karel-394.webp"),
      asset("/galerie/kdyzANO/2021-10-9 - Renata a Karel-572.webp"),
    ],
  },
];

export default function Galerie() {
  const [open, setOpen] = React.useState(false);
  const [activeImgs, setActiveImgs] = React.useState([]);
  const [startIndex, setStartIndex] = React.useState(0);

  const openGallery = (images, idx = 0) => {
    setActiveImgs(images);
    setStartIndex(idx);
    setOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Dlaždice kategorií */}
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {GALLERIES.map((g) => (
          <Grid key={g.id} item xs={12} sm={6} md={6} lg={3}>
            <GalleryCategoryCard
              title={g.title}
              cover={g.cover}
              onClick={() => openGallery(g.images, 0)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Lightbox */}
      <GalleryLightbox
        open={open}
        onClose={() => setOpen(false)}
        images={activeImgs}
        startIndex={startIndex}
        showThumbnails
        thumbSize={{ w: 110, h: 72 }} // volitelné
      />
    </Container>
  );
}
