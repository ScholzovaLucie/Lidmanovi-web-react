import React from "react";
import { Container, Paper, Typography } from "@mui/material";

export default function Obedy() {
  const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
  return (
    <>
      {/* Simple overview page for lunch offerings */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }} id="obedy">
        <Paper
          variant="outlined"
          sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Obědy
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Denní nabídka obědů v naší restauraci. Přijďte a vyberte si z tradičních jídel české kuchyně.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Otevírací doba a aktuální menu se mohou měnit dle sezóny.
          </Typography>
        </Paper>
      </Container>
    </>
  );
}
