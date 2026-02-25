import dayjs from "dayjs";

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;

  if (typeof value === "string" && value.trim() === "") return true;

  if (Array.isArray(value) && value.length === 0) return true;

  return false;
};

export const validateField = (values, field) => {
  switch (field) {
    case "check_in_date": {
      const checkInIsInThePast = dayjs(values.check_in_date).isBefore(
        dayjs(),
        "day",
      );
      if (isEmpty(values.check_in_date)) return "Check-in date is required";
      if (checkInIsInThePast) return "Check-in date cannot be in the past";
      return null;
    }

    case "check_out_date":
      if (isEmpty(values.check_out_date)) return "Check-out date is required";
      if (values.check_out_date <= values.check_in_date)
        return "Check-out must be after check-in";

      return null;

    case "primary_guest.first_name":
      return isEmpty(values.primary_guest.first_name)
        ? "First name is required"
        : null;

    case "primary_guest.last_name":
      return isEmpty(values.primary_guest.last_name)
        ? "Last name is required"
        : null;

    case "primary_guest.email":
      if (isEmpty(values.primary_guest.email)) return "Email is required";
      if (!values.primary_guest.email.includes("@")) return "Invalid email";
      return null;

    case "primary_guest.phone":
      return isEmpty(values.primary_guest.phone) ? "Phone is required" : null;

    case "num_adults": {
      const cantBeNegative = values.num_adults < 0;
      const atLeastOneAdult = values.num_adults >= 1;

      if (cantBeNegative) return "Number of adults cannot be negative";
      if (!atLeastOneAdult) return "At least one adult is required";
      return null;
    }

    case "num_children": {
      const cantBeNegative = values.num_children < 0;
      const noAloneChildren =
        values.num_adults === 0 && values.num_children > 0;

      if (cantBeNegative) return "Number of children cannot be negative";
      if (noAloneChildren) return "Children cannot be alone without adults";
      return null;
    }

    default:
      return null;
  }
};

// example: const fields = ["check_in_date", "check_out_date", "primary_guest.email"];
export const validateForm = (values, fields) => {
  const errors = {};

  fields.forEach((f) => {
    const err = validateField(values, f);
    if (err) errors[f] = err;
  });

  return errors;
};
