const RESERVATION_STATUS_COLORS = {
  new: "#1565c0",
  confirmed: "#2e7d32",
  cancelled: "#c62828",
  payment_pending: "#e65100",
  payed: "#00695c",
  done: "#37474f",
};

export function getColorForReservationStatus(status) {
  return RESERVATION_STATUS_COLORS[status] ?? "#8c98a4";
}

export function getCzechTranslationForReservationStatus(status) {
  switch (status) {
    case "New":
      return "Nová";
    case "Confirmed":
      return "Potvrzená";
    case "Cancelled":
      return "Zrušená";
    case "Payment pending":
      return "Čeká na platbu";
    case "Payed":
      return "Zaplacená";
    case "Done":
      return "Dokončená";
    default:
      return status;
  }
}
