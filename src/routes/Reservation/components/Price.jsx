import { Stack, Typography } from "@mui/material";

export default function Price({ room }) {
  return (
    <Stack direction={"column"} spacing={0.5} alignItems={"start"}>
      <Typography fontSize={14} color={"text.secondary"} lineHeight="16px">
        CENA ZA NOC
      </Typography>

      <Stack direction={"row"} spacing={0.5} alignItems={"end"}>
        <Typography
          fontSize={28}
          color="primary"
          fontWeight={"bold"}
          lineHeight="30px"
        >
          {room.price_for_adult} Kč
        </Typography>
        <Typography fontSize={14} color={"text.secondary"} lineHeight="22px">
          / dospělý
        </Typography>
      </Stack>
      <Stack direction={"row"} spacing={0.5} alignItems={"end"}>
        <Typography
          fontSize={20}
          color={"text.secondary"}
          fontWeight={"bold"}
          lineHeight="22px"
        >
          {room.price_for_children} Kč
        </Typography>
        <Typography fontSize={14} color={"text.secondary"} lineHeight="18px">
          / dítě
        </Typography>
      </Stack>
    </Stack>
  );
}
