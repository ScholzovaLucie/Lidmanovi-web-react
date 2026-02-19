import { Card, Stack, Typography } from "@mui/material";
import AppScheduler from "./components/AppScheduler";
import AppDataTable from "./components/AppDataTable";
import CustomMuiCalendar from "./components/CustomMuiCalendar";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import CustomTable from "./components/CustomMuiTable";

const SAMPLE_EVENTS = [
  {
    name: "Svatba Novákovi",
    from: dayjs().startOf("month").add(4, "day"),
    to: dayjs().startOf("month").add(6, "day"),
    text: "Svatba rodiny Novákových - hlavní sál, 80 hostů, catering zajištěn.",
  },
  {
    name: "Firemní teambuilding",
    from: dayjs().startOf("month").add(10, "day"),
    to: dayjs().startOf("month").add(12, "day"),
    text: "Teambuilding firmy Acme s.r.o. - ubytování pro 25 osob, aktivitní program.",
  },
  {
    name: "Oslava narozenin",
    from: dayjs().startOf("month").add(11, "day"),
    to: dayjs().startOf("month").add(11, "day"),
    text: "Narozeniny paní Králové - malý salonek, dort, 15 hostů.",
  },
  {
    name: "Víkendový pobyt",
    from: dayjs().startOf("month").add(18, "day"),
    to: dayjs().startOf("month").add(20, "day"),
    text: "Víkendový relaxační pobyt - 2 pokoje, polopenze, wellness.",
  },
  {
    name: "Konference",
    from: dayjs().startOf("month").add(5, "day"),
    to: dayjs().startOf("month").add(5, "day"),
    text: "Jednodenní regionální konference - projektor, občerstvení, 40 účastníků.",
  },
];

const columns = [
  { key: "name", label: "Dessert" },
  { key: "calories", label: "Calories", align: "right" },
  { key: "fat", label: "Fat", align: "right" },
  {
    key: "action",
    label: "Action",
    render: (row) => (
      <Button variant="contained" size="small">
        {row.name}
      </Button>
    ),
  },
];

const rows = [
  { name: "Frozen yoghurt", calories: 159, fat: 6.0 },
  { name: "Ice cream sandwich", calories: 237, fat: 9.0 },
  { name: "Eclair", calories: 262, fat: 16.0 },
];

export default function AdminPage() {
  return (
    <Stack
      sx={{
        minHeight: "calc(100vh - 130px)",
        paddingTop: 2,
      }}
      alignItems={"center"}
      p={3}
      spacing={4}
    >
      <Card sx={{ width: "100%" }}>
        <CustomMuiCalendar events={SAMPLE_EVENTS} />
      </Card>
      <CustomTable columns={columns} data={rows} getRowId={(row) => row.name} />
    </Stack>
  );
}
