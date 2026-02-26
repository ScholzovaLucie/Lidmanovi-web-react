import dayjs from "dayjs";
import i18n from "../../../locales";

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;

  if (typeof value === "string" && value.trim() === "") return true;

  if (Array.isArray(value) && value.length === 0) return true;

  return false;
};

export const validateField = (values, field) => {
  const t = i18n.t.bind(i18n);

  switch (field) {
    case "check_in_date": {
      const checkInIsInThePast = dayjs(values.check_in_date).isBefore(
        dayjs(),
        "day",
      );
      if (isEmpty(values.check_in_date)) return t("rezervace:form.errors.dateFrom");
      if (checkInIsInThePast)
        return t("rezervace:validation.checkInPast");
      return null;
    }

    case "check_out_date":
      if (isEmpty(values.check_out_date)) return t("rezervace:form.errors.dateTo");
      if (values.check_out_date <= values.check_in_date)
        return t("rezervace:form.errors.dateOrder");

      return null;

    case "primary_guest.first_name":
      return isEmpty(values.primary_guest.first_name)
        ? t("rezervace:validation.firstNameRequired")
        : null;

    case "primary_guest.last_name":
      return isEmpty(values.primary_guest.last_name)
        ? t("rezervace:validation.lastNameRequired")
        : null;

    case "primary_guest.email":
      if (isEmpty(values.primary_guest.email)) return t("rezervace:form.errors.emailRequired");
      if (!values.primary_guest.email.includes("@")) return t("rezervace:form.errors.emailInvalid");
      return null;

    case "primary_guest.phone":
      return isEmpty(values.primary_guest.phone)
        ? t("rezervace:form.errors.phoneRequired")
        : null;

    case "primary_guest.country":
      return isEmpty(values.primary_guest.country)
        ? t("rezervace:validation.countryRequired")
        : null;

    case "num_adults": {
      const cantBeNegative = values.num_adults < 0;
      const atLeastOneAdult = values.num_adults >= 1;

      if (cantBeNegative) return t("rezervace:validation.adultsNegative");
      if (!atLeastOneAdult) return t("rezervace:validation.adultsRequired");
      return null;
    }

    case "num_children": {
      const cantBeNegative = values.num_children < 0;
      const noAloneChildren =
        values.num_adults === 0 && values.num_children > 0;

      if (cantBeNegative) return t("rezervace:validation.childrenNegative");
      if (noAloneChildren) return t("rezervace:validation.childrenWithoutAdult");
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
