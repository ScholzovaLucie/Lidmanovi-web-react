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
