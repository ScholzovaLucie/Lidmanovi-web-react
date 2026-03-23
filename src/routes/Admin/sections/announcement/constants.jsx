import { Anchor, WidthFull } from "@mui/icons-material";
import { Icon, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const announcementColumns = [
  {
    key: "title",
    label: "Text oznámení",
    render: (row) => <Typography>{row.title}</Typography>,
  },
  {
    key: "starts_at",
    label: "Aktivní od",
    render: (row) => <Typography>{row.starts_at}</Typography>,
  },
  {
    key: "ends_at",
    label: "Aktivní do",
    render: (row) => <Typography>{row.ends_at}</Typography>,
  },
  {
    key: "actions",
    label: "Akce",
    align: "center",
    render: (row) => (
      <IconButton color="error">
        <DeleteIcon />
      </IconButton>
    ),
  },
];
