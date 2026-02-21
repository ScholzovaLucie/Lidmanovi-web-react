import { Button, Chip, Typography } from "@mui/material";
import dayjs from "dayjs";

export const reservationColumns = [
  {
    key: "status",
    label: "Stav rezervace",
    align: "center",
    render: (row) => {
      const statusMeta = STATUS_META[row.status];

      return (
        <Chip
          label={statusMeta.label}
          color={statusMeta.color}
          // variant={row.status === "completed" ? "outlined" : "filled"} TODO: different variant for completed?
          size="small"
        />
      );
    },
  },
  {
    key: "",
    label: "Datum",
    render: (row) =>
      `${dayjs(row.check_in_date).format("DD. MM")} - ${dayjs(
        row.check_out_date,
      ).format("DD. MM. YYYY")}`,
  },

  {
    key: "price",
    label: "Cena",
    render: (row) => <Typography fontWeight={"bold"}>{`${row.price} Kč`}</Typography>,
  },
  {
    key: "rooms",
    label: "Pokoje",
    render: (row) => row.rooms.map((r) => r.name).join(", "),
  },

  {
    key: "",
    label: "Hosté",
    render: (row) => {
      if (!row.num_children) return `${row.num_adults} x dospělý`;
      if (!row.num_adults) return `${row.num_children} x dítě`;
      return `${row.num_adults} x dospělý, ${row.num_children} x dítě`;
    },
  },
  {
    key: "",
    label: "Osoba",
    render: (row) =>
      `${row.primary_guest.first_name} ${row.primary_guest.last_name}`,
  },
  {
    key: "action",
    label: "Akce",
    align: "center",
    render: (row) => (
      <Button variant="contained" size="small">
        Změnit stav
      </Button>
    ),
  },
];

export const STATUS_META = {
  new: { label: "New", color: "primary" },
  confirmed: { label: "Confirmed", color: "info" },
  cancelled: { label: "Cancelled", color: "error" },
  payment_pending: { label: "Payment Pending", color: "warning" },
  payed: { label: "Paid", color: "success" },
  done: { label: "Done", color: "default" },
};

export const HOST_COLUMNS = [
  { key: "first_name", label: "Name" },
  { key: "last_name", label: "Surname" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
];
