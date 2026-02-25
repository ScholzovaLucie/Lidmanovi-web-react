import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AppCard from "../../../components/containers/AppCard";
import { DatePicker } from "@mui/x-date-pickers";
import MenuDecorator from "../../../components/decorators/MenuDecorator";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useReservationContext } from "../context/ReservationContext";
import { useDispatch, useSelector } from "react-redux";
import { updateReservation } from "../../../redux/slices/reservation/reservationSlice";
import {
  validateFieldThunk,
  validateTermAndGuests,
} from "../../../redux/slices/reservation/reservationThunks";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";

export default function TermSelect() {
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();
  const { enqueueSnackbar } = useSnackbar();
  const reservationState = useSelector((state) => state.reservation);
  const dispatch = useDispatch();
  const values = reservationState.values;
  const errors = reservationState.errors;

  const handleNextStep = async () => {
    const { isValid, validationErrors } = await dispatch(
      validateTermAndGuests(),
    );

    if (!isValid) {
      validationErrors.map((error) => {
        enqueueSnackbar(error, {
          variant: "error",
          autoHideDuration: 5000,
        });
      });
      return;
    }
    increaseStep();
  };

  return (
    <Stack
      sx={{
        minHeight: "calc(100vh - 190px)",
        paddingTop: 2, // Přidá mezeru pod sticky AppBar
      }}
      alignItems={"center"}
      justifyContent={"center"}
      p={3}
      spacing={4}
    >
      <Typography variant="h4">Vyberte termín a hosty</Typography>

      <AppCard>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <DatePicker
            label="Datum příjezdu"
            value={values.check_in_date ? dayjs(values.check_in_date) : null}
            onChange={(value) =>
              dispatch(
                updateReservation({
                  check_in_date: value ? value.format("YYYY-MM-DD") : null,
                }),
              )
            }
            onBlur={() => dispatch(validateFieldThunk("check_in_date"))}
            error={!!errors["check_in_date"]}
            helperText={errors["check_in_date"]}
          />

          <DatePicker
            label="Datum odjezdu"
            value={values.check_out_date ? dayjs(values.check_out_date) : null}
            onChange={(value) =>
              dispatch(
                updateReservation({
                  check_out_date: value ? value.format("YYYY-MM-DD") : null,
                }),
              )
            }
            onBlur={() => dispatch(validateFieldThunk("check_out_date"))}
            error={!!errors["check_out_date"]}
            helperText={errors["check_out_date"]}
          />

          <MenuDecorator
            menuContent={
              <Stack>
                <Stack
                  p={2}
                  direction={"row"}
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography>Dospělí</Typography>
                  <Stack direction={"row"} alignItems="center" spacing={1}>
                    <IconButton
                      onClick={() =>
                        dispatch(
                          updateReservation({
                            num_adults: Math.max(
                              0,
                              (values.num_adults || 0) - 1,
                            ),
                          }),
                        )
                      }
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                    <Typography>{values.num_adults || 0}</Typography>
                    <IconButton
                      onClick={() =>
                        dispatch(
                          updateReservation({
                            num_adults: (values.num_adults || 0) + 1,
                          }),
                        )
                      }
                    >
                      <ControlPointIcon />
                    </IconButton>
                  </Stack>
                </Stack>
                <Stack
                  p={2}
                  direction={"row"}
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography>Děti</Typography>
                  <Stack direction={"row"} alignItems="center" spacing={1}>
                    <IconButton
                      onClick={() =>
                        dispatch(
                          updateReservation({
                            num_children: Math.max(
                              0,
                              (values.num_children || 0) - 1,
                            ),
                          }),
                        )
                      }
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                    <Typography>{values.num_children || 0}</Typography>
                    <IconButton
                      onClick={() =>
                        dispatch(
                          updateReservation({
                            num_children: (values.num_children || 0) + 1,
                          }),
                        )
                      }
                    >
                      <ControlPointIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            }
          >
            <TextField
              label="Přidat hosty"
              value={`${values.num_adults || 0} dospělí, ${values.num_children || 0} děti`}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                width: "246px",
                cursor: "pointer",
                "& .MuiOutlinedInput-root": {
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                /* handle click */
              }}
            />
          </MenuDecorator>
        </Stack>
      </AppCard>
      <Button
        variant="contained"
        size="large"
        sx={{ maxWidth: "300px" }}
        onClick={handleNextStep}
      >
        Zobrazit dostupné pokoje
      </Button>
    </Stack>
  );
}
