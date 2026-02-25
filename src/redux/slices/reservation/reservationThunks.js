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

export const validateInformationAndConfirmation = () =>
  validateFormThunk([
    "primary_guest.first_name",
    "primary_guest.last_name",
    "primary_guest.email",
    "primary_guest.phone",
    "primary_guest.country",
  ]);

export const validateTermAndGuests = () =>
  validateFormThunk([
    "check_in_date",
    "check_out_date",
    "num_adults",
    "num_children",
  ]);

export const validateAll = () =>
  validateFormThunk([
    "check_in_date",
    "check_out_date",
    "num_adults",
    "num_children",
    "primary_guest.first_name",
    "primary_guest.last_name",
    "primary_guest.email",
    "primary_guest.phone",
    "primary_guest.country",
  ]);

export const validateFormThunk = (fields) => (dispatch, getState) => {
  const state = getState();
  const values = state.reservation.values;

  const errors = validateForm(values, fields);
  dispatch(setErrors(errors)); // Maybe not necessary to save errors - i am not using it for now.

  const isValid = Object.keys(errors).length === 0; // return true if no errors, false if there are errors
  const validationErrors = Object.values(errors);
  return { isValid, validationErrors };
};

export const submitFormThunk = () => async (dispatch, getState) => {
  const { isValid, validationErrors } = await dispatch(validateAll());

  if (!isValid) {
    alert("Formulář obsahuje chyby. Opravte je prosím před odesláním.");
    return { isValid, validationErrors };
  }

  const { reservation } = getState();
  const payload = reservation.values; // posílám celý stav, jsou tam nějaká pole navíc... mapování by asi v aktuálním stavu by zbytečně zvyšovalo komplexnost.
  console.log("Submitting reservation:", payload);

  try {
    const data = await dispatch(
      reservationsApi.endpoints.createReservation.initiate(payload),
    ).unwrap();

    return { isValid: true, validationErrors: [], response: data };
  } catch (e) {
    dispatch(
      setErrors({
        global: `Submission failed: ${e.message}`,
      }),
    );
    return {
      isValid: false,
      validationErrors: [
        `Nepodařilo se odeslat rezervaci, zkuste to prosím znovu později,
         nebo nás kontaktujte emailem nebo telefonicky.`,
      ],
    };
  }
};

/*
dispatch(validateFieldThunk("check_in_date"));
dispatch(validateFormThunk());
dispatch(submitFormThunk());
*/
