export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;

  if (typeof value === "string" && value.trim() === "") return true;

  if (Array.isArray(value) && value.length === 0) return true;

  return false;
};

export const validateField = (values, field) => {
  switch (field) {
    case "check_in_date":
      if (isEmpty(values.check_in_date)) return "Check-in date is required";
      return null;

    case "check_out_date":
      if (isEmpty(values.check_out_date)) return "Check-out date is required";

      if (values.check_out_date <= values.check_in_date)
        return "Check-out must be after check-in";

      return null;

    case "primary_guest.first_name":
      if (isEmpty(values.primary_guest.first_name))
        return "First name is required";
      return null;

    case "primary_guest.last_name":
      if (isEmpty(values.primary_guest.last_name))
        return "Last name is required";
      return null;

    case "primary_guest.email":
      if (isEmpty(values.primary_guest.email)) return "Email is required";

      if (!values.primary_guest.email.includes("@")) return "Invalid email";

      return null;

    case "primary_guest.phone":
      if (isEmpty(values.primary_guest.phone)) return "Phone is required";
      return null;

    default:
      return null;
  }
};

export const validateForm = (values) => {
  const errors = {};

  const fields = ["check_in_date", "check_out_date", "primary_guest.email"]; // TODO: nevaliduji všechny pole..

  fields.forEach((f) => {
    const err = validateField(values, f);
    if (err) errors[f] = err;
  });

  return errors;
};
