import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import InfoBlock from "../components/InfoBlock";
import ContactForm from "../components/ContactForm";

export default function Kontakt() {
  // lokální stav – můžeš ho případně použít pro napojení na backend
  const [form, setForm] = React.useState({
    userName: "",
    userEmail: "",
    subject: "",
    zprava: "",
  });
  const [errors, setErrors] = React.useState({});

  const images = [
    "/kontakt/DSCN0464.webp",
    "/kontakt/002_HZ6_3762_Penzion_U_Lidmanu.webp",
    "/kontakt/9c8f78d411bc1f0228e6.webp",
    "/kontakt/95f5c4089c2e069cf161.webp",
  ];

  const blocks = [
    {
      icon: "/position.webp",
      title: "Adresa",
      content: (
        <>
          <Typography>
            Machovská Lhota 40
            <br />
            Machov 549 31
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body2" color="text.secondary">
            50.4975831 N, 16.2934947 E
          </Typography>
        </>
      ),
    },
    {
      icon: "/phone-call.webp",
      title: "Telefon",
      content: (
        <Link href="tel:+420604341863" underline="hover" color="inherit">
          +420&nbsp;604&nbsp;341&nbsp;863
        </Link>
      ),
    },
    {
      icon: "/mail.webp",
      title: "E-mail",
      content: (
        <Link href="mailto:info@ulidmanu.cz" underline="hover" color="inherit">
          info@ulidmanu.cz
        </Link>
      ),
    },
    {
      icon: "/facebook2.webp",
      title: "Facebook",
      content: (
        <Link
          href="https://www.facebook.com/Pension-a-restaurace-U-Lidman%C5%AF-945259918825167"
          underline="hover"
          color="inherit"
        >
          Facebook
        </Link>
      ),
    },
    {
      title: "Majitel a provozovatel",
      content: (
        <Typography>
          Petr Šturm
          <br />
          IČ: 71143416
        </Typography>
      ),
    },
  ];

  return (
    <Box>
      {/* HORNÍ PÁS FOTEK (4 obrázky) */}
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {images.map((src, i) => (
          <Box
            key={i}
            sx={{
              flex: "1 1 25%",
              maxWidth: "25%",
              position: "relative",
              borderRadius: 0,
            }}
          >
            <Box
              component="img"
              src={src}
              alt={`Úvodní obrázek ${i + 1}`}
              sx={{
                width: "100%",
                height: 250,
                objectFit: "cover",
                display: "block",
                borderRadius: 0,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            />
          </Box>
        ))}
      </Box>

      {/* INFO BLOKY */}
      <Box sx={{ width: "100%", py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Grid
          container
          columns={{ xs: 12, sm: 12, md: 12, lg: 15 }} // <<< 5 sloupců na LG
          justifyContent="center"
          alignItems="stretch"
          rowSpacing={3}
          columnSpacing={3}
          sx={{ "& > .MuiGrid-item": { display: "flex" } }}
        >
          {blocks.map((block, i) => (
            <Grid
              key={i}
              item
              xs={12} // 1 na řádek
              sm={6} // 2 na řádek
              md={4} // 3 na řádek
              lg={3} // 5 na řádek (protože columns lg=15)
              sx={{ display: "flex" }}
            >
              <InfoBlock
                icon={block.icon}
                title={block.title}
                button={block.button}
                onButtonClick={block.onClick}
                sx={{ flex: 1, height: "100%" }}
              >
                {block.content}
              </InfoBlock>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* MAPA (Google Maps iframe) */}
      <Box
        component="section"
        sx={{
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          width: "100vw",
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
        }}
      >
        <Box
          component="iframe"
          title="Mapa"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2537.9674639711725!2d16.2889786!3d50.4975633!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470e686d9f1caccd%3A0x5443aff885131f52!2sPension%20-%20Restaurace%20U%20Lidman%C5%AF!5e0!3m2!1scs!2scz!4v1662476744005!5m2!1scs!2scz"
          sx={{
            display: "block",
            width: "100%",
            height: { xs: 420, md: 560 },
            border: 0,
          }}
          allowFullScreen=""
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>

      {/* Formulář – široký na mobilu, max 720 px a centrovaný */}
      <ContactForm title="Kontaktujte nás" mailto="info@ulidmanu.cz" />

      {/* KRAJ – kredit */}
      <Box
        sx={{
          py: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Box
          component="img"
          src="/logo_colour_pantone.webp"
          alt="Královéhradecký kraj"
          sx={{ height: 38 }}
        />
        <Typography
          id="kraj_text"
          sx={{ color: "text.secondary", textAlign: "center" }}
        >
          Realizováno za finanční podpory Královéhradeckého kraje
        </Typography>
      </Box>
    </Box>
  );
}
