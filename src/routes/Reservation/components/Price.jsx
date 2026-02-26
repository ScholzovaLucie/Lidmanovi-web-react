import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Price({ room }) {
  const { t } = useTranslation("rezervace");
  return (
    <Stack direction={"column"} spacing={0.5} alignItems={"start"}>
      <Typography fontSize={14} color={"text.secondary"} lineHeight="16px">
        {t("price.title")}
      </Typography>

      <Stack direction={"row"} spacing={0.5} alignItems={"end"}>
        <Typography
          fontSize={28}
          color="primary"
          fontWeight={"bold"}
          lineHeight="30px"
        >
          {t("common.priceCzk", { amount: room.price_for_adult })}
        </Typography>
        <Typography fontSize={14} color={"text.secondary"} lineHeight="22px">
          {t("price.perAdult")}
        </Typography>
      </Stack>
      <Stack direction={"row"} spacing={0.5} alignItems={"end"}>
        <Typography
          fontSize={20}
          color={"text.secondary"}
          fontWeight={"bold"}
          lineHeight="22px"
        >
          {t("common.priceCzk", { amount: room.price_for_children })}
        </Typography>
        <Typography fontSize={14} color={"text.secondary"} lineHeight="18px">
          {t("price.perChild")}
        </Typography>
      </Stack>
    </Stack>
  );
}
