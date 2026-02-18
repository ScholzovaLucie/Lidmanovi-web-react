import { reservationsApi } from "../../api/reservationsApi";
import { setErrors, setFieldError } from "./reservationSlice";
import { validateField, validateForm } from "./reservationValidation";

// onBlur={() => dispatch(validateFieldThunk("primary_guest.email"))}
export const validateFieldThunk = (fieldName) => (dispatch, getState) => {
  const state = getState();
  const values = state.reservation.values;

  const errorMessage = validateField(values, fieldName);

  dispatch(
    setFieldError({
      field: fieldName,
      message: errorMessage,
    }),
  );
};

// Vrací true/false → hodí se pro submit.
export const validateFormThunk = () => (dispatch, getState) => {
  const state = getState();
  const values = state.reservation.values;

  const errors = validateForm(values);

  dispatch(setErrors(errors));

  return Object.keys(errors).length === 0;
};

export const submitFormThunk = () => async (dispatch, getState) => {
  const isValid = await dispatch(validateFormThunk());

  if (!isValid) {
    alert("Formulář obsahuje chyby. Opravte je prosím před odesláním.");
    return false;
  }

  const { reservation } = getState();
  const payload = reservation.values; // posílám celý stav, jsou tam nějaká pole navíc... mapování by asi v aktuálním stavu by zbytečně zvyšovalo komplexnost.
  console.log("Submitting reservation:", payload);

  try {
    await dispatch(
      reservationsApi.endpoints.createReservation.initiate(payload),
    ).unwrap();
    console.log("Submitting reservation:", payload);

    return true;
  } catch (e) {
    dispatch(
      setErrors({
        global: `Submission failed: ${e.message}`,
      }),
    );
    return false;
  }
};

/*
dispatch(validateFieldThunk("check_in_date"));
dispatch(validateFormThunk());
dispatch(submitFormThunk());
*/
