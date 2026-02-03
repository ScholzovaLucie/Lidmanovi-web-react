import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export function NavButton({ label, navigateTo }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(navigateTo)}
      variant={location.pathname === navigateTo ? "contained" : "text"}
    >
      {label}
    </Button>
  );
}