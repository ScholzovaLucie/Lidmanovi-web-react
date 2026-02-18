import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AppModal from "../Modal";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useTokenMutation } from "../../redux/api/apiApi";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/slices/app/appSlice";

export default function LoginModal({ open, setOpen }) {
  const [getToken] = useTokenMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      Body={() => {
        return (
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" component="h2">
                Přihlášení
              </Typography>
              <IconButton onClick={() => setOpen(false)} aria-label="Close">
                <CloseIcon />
              </IconButton>
            </Stack>
            <TextField label="Uživatelské jméno" />
            <TextField label="Heslo" />

            <Button
              onClick={async () => {
                const response = await getToken({
                  username: "admin",
                  password: "admin",
                });
                console.log(response);
                dispatch(setToken(response.data.access));
                navigate("/admin");
                setOpen(false);
              }}
              sx={{ mt: 2 }}
              variant="contained"
            >
              Přihlásit
            </Button>
          </Stack>
        );
      }}
    />
  );
}
