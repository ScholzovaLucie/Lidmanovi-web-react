import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import GalleryCategoryCard from "../components/GalleryCategoryCard.jsx";
import GalleryLightbox from "../components/GalleryLightbox.jsx";

/** DATA – cesty z public/… (původní HTML jste měla bez počátečního lomítka; v Reactu používej "/…") */
const GALLERIES = [
  {
    id: "kam-prijedete",
    title: "Kam přijedete",
    cover: "/galerie/exterier/132_HZ6_4056_Penzion_U_Lidmanu.webp",
    images: [
      "/galerie/exterier/132_HZ6_4056_Penzion_U_Lidmanu.webp",
      "/galerie/exterier/128_DJI_0426_Penzion_U_Lidmanu.webp",
      "/galerie/exterier/DSC_0631.webp",
      "/galerie/exterier/004_HZ6_3765_Penzion_U_Lidmanu.webp",
      "/galerie/kamPrijedete/2021-10-9 - Renata a Karel-5.webp",
      "/galerie/kamPrijedete/2724f156d32b9a429328.webp",
      "/galerie/kamPrijedete/b4302.webp",
      "/galerie/kamPrijedete/b4345.webp",
      "/galerie/kamPrijedete/b4387.webp",
      "/galerie/kamPrijedete/br2095.webp",
      "/galerie/kamPrijedete/FotkaskoleniVodafone.webp",
      "/galerie/exterier/nove1.webp",
      "/galerie/exterier/nove3.webp",
      "/galerie/exterier/nove4.webp",
      "/galerie/exterier/nove5.webp",
      "/galerie/exterier/nove8.webp",
      "/galerie/exterier/nove9.webp",
      "/galerie/exterier/nove11.webp",
    ],
  },
  {
    id: "kde-se-vyspite",
    title: "Kde se vyspíte",
    cover: "/galerie/pokoje/039_HZ6_3852_Penzion_U_Lidmanu.webp",
    images: [
      "/galerie/pokoje/039_HZ6_3852_Penzion_U_Lidmanu.webp",
      "/galerie/pokoje/058_HZ6_3886_Penzion_U_Lidmanu.webp",
      "/galerie/pokoje/064_HZ6_3901_Penzion_U_Lidmanu.webp",
      "/galerie/pokoje/049_HZ6_3870_Penzion_U_Lidmanu.webp",
      "/galerie/pokoje/078_HZ6_3927_Penzion_U_Lidmanu.webp",
      "/galerie/pokoje/081_HZ6_3941_Penzion_U_Lidmanu.webp",
      "/galerie/pokoje/036_HZ6_3846_Penzion_U_Lidmanu.webp",
      "/galerie/pokoje/047_HZ6_3865_Penzion_U_Lidmanu.webp",
      "/galerie/kdeSeVyspite/107da0d0325a4274ba02.webp",
      "/galerie/kdeSeVyspite/373b8cbfb9d4174ea364.webp",
      "/galerie/kdeSeVyspite/3410d5b3bfadc6fa3ea7.webp",
    ],
  },
  {
    id: "kde-se-najite",
    title: "Kde se najíte",
    cover: "/galerie/interier/099_HZ6_3978_Penzion_U_Lidmanu.webp",
    images: [
      "/galerie/interier/100_HZ6_3979_Penzion_U_Lidmanu.webp",
      "/galerie/interier/099_HZ6_3978_Penzion_U_Lidmanu.webp",
      "/galerie/interier/101_HZ6_3981_Penzion_U_Lidmanu.webp",
      "/galerie/interier/102_HZ6_3987_Penzion_U_Lidmanu.webp",
      "/galerie/interier/103_HZ6_3988_Penzion_U_Lidmanu.webp",
      "/galerie/interier/107_HZ6_3994_Penzion_U_Lidmanu.webp",
      "/galerie/interier/093_HZ6_3968_Penzion_U_Lidmanu.webp",
      "/galerie/interier/094_HZ6_3969_Penzion_U_Lidmanu.webp",
      "/galerie/interier/092_HZ6_3966_Penzion_U_Lidmanu.webp",
      "/galerie/interier/087_HZ6_3955_Penzion_U_Lidmanu.webp",
      "/galerie/interier/088_HZ6_3958_Penzion_U_Lidmanu.webp",
      "/galerie/interier/089_HZ6_3960_Penzion_U_Lidmanu.webp",
      "/galerie/interier/091_HZ6_3962_Penzion_U_Lidmanu.webp",
      "/galerie/KdeSeNajite/1fd98ab9ecf7488c17ba.webp",
      "/galerie/KdeSeNajite/3c80f85861675816c542.webp",
      "/galerie/KdeSeNajite/3d4507f0b89720a97987.webp",
      "/galerie/KdeSeNajite/5cc84c285c46ec7500f3.webp",
      "/galerie/KdeSeNajite/7cafef1f8324a1a8b84f.webp",
      "/galerie/KdeSeNajite/2021-10-9 - Renata a Karel-3.webp",
      "/galerie/KdeSeNajite/18601d7664f70a5994b4.webp",
      "/galerie/KdeSeNajite/48702cee4ce12e0d8049.webp",
      "/galerie/KdeSeNajite/057938a3e04122beb61a.webp",
      "/galerie/KdeSeNajite/87912da29720bb906a81.webp",
      "/galerie/KdeSeNajite/a19cc5ed12e42c0b67b1.webp",
      "/galerie/KdeSeNajite/a42187cea42248b6eb86.webp",
      "/galerie/KdeSeNajite/bb50846fd53d057ea30d.webp",
      "/galerie/KdeSeNajite/br2058.webp",
      "/galerie/KdeSeNajite/ce87af1c4f70c77a664c.webp",
      "/galerie/KdeSeNajite/DSC_0506.webp",
      "/galerie/KdeSeNajite/fa97b744f2e5a4b7f3ce.webp",
      "/galerie/KdeSeNajite/fcc6f6f38fb88301e85a.webp",
    ],
  },
  {
    id: "ano",
    title: 'Když si u nás řeknete "ANO"',
    cover: "/galerie/svadba/075A5198.webp",
    images: [
      "/galerie/sal/111_HZ6_3999_Penzion_U_Lidmanu.webp",
      "/galerie/svadba/075A5198.webp",
      "/galerie/svadba/075A5239.webp",
      "/galerie/svadba/IMG_0192.webp",
      "/galerie/svadba/IMG_0191.webp",
      "/galerie/svadba/075A5224.webp",
      "/galerie/svadba/IMG_0193.webp",
      "/galerie/svadba/SVATBA2.webp",
      "/galerie/svadba/svatba.webp",
      "/galerie/sal/113_HZ6_4001_Penzion_U_Lidmanu.webp",
      "/galerie/sal/114_HZ6_4003_Penzion_U_Lidmanu.webp",
      "/galerie/svadba/IMG_0211.webp",
      "/galerie/kdyzANO/075A5198.webp",
      "/galerie/kdyzANO/075A5237.webp",
      "/galerie/kdyzANO/075A5252.webp",
      "/galerie/kdyzANO/075A5344.webp",
      "/galerie/kdyzANO/2021-10-9 - Renata a Karel-110.webp",
      "/galerie/kdyzANO/2021-10-9 - Renata a Karel-394.webp",
      "/galerie/kdyzANO/2021-10-9 - Renata a Karel-572.webp",
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
      <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: 700, mb: { xs: 3, md: 4 } }}
      >
        Galerie
      </Typography>

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
