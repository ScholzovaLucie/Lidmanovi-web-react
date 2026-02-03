import {
  AppBar,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectButton } from "./controls/SelectButton";
import { useTranslation } from "react-i18next";
import { NavButton } from "./controls/NavButton";
import { useState } from "react";
import LoginModal from "./modals/LoginModal";

export function Header2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation("global");

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "background.paper",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Stack
        direction={"row"}
        p={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack spacing={2} direction="row">
          <img
            src="logolidman.webp"
            height={40}
            alt="U Lidmanů"
            onClick={() => navigate("/")}
          />
          <Box />
          <NavButton label={"Rezervace"} navigateTo={"/rezervace"} />
          <Divider orientation="vertical" flexItem />

          <NavButton label={"Restaurace"} navigateTo={"/restaurace"} />
          <NavButton label={"Svatby"} navigateTo={"/svatby"} />
          <Divider orientation="vertical" flexItem />
          <NavButton label={"Ubytování"} navigateTo={"/ubytovani"} />
          <NavButton
            label={"Pobytové balíčky"}
            navigateTo={"/pobytove_balicky"}
          />
          <Divider orientation="vertical" flexItem />
          <SelectButton
            variant={
              ["/galerie", "/kontakt", "/cenik"].includes(location.pathname)
                ? "contained"
                : "text"
            }
            label={"O Nás"}
            options={[
              { label: "Galerie", onClick: () => navigate("/galerie") },
              { label: "Kontakt", onClick: () => navigate("/kontakt") },
              { label: "Ceník", onClick: () => navigate("/cenik") },
            ]}
          />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <SelectButton
            label={"Jazyk"}
            options={[
              { label: "CZ", onClick: () => i18n.changeLanguage("cz") },
              { label: "EN", onClick: () => i18n.changeLanguage("en") },
              { label: "PL", onClick: () => i18n.changeLanguage("pl") },
              { label: "DE", onClick: () => i18n.changeLanguage("de") },
            ]}
          />
          <Divider orientation="vertical" flexItem />
          <Button onClick={() => setOpen(true)}>Login</Button>
          <LoginModal open={open} setOpen={setOpen} />
        </Stack>
      </Stack>
    </AppBar>
  );
}
