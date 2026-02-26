import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CollapsableText({ text }) {
  const { t } = useTranslation("rezervace");
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <Stack spacing={1} alignItems={"center"}>
      <Typography
        fontSize={16}
        color={"text.secondary"}
        lineHeight="24px"
        textAlign={"start"}
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "none" : 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text}
      </Typography>
      <Button onClick={toggleExpanded} size="small">
        {expanded ? t("roomCard.showLess") : t("roomCard.showMore")}
      </Button>
    </Stack>
  );
}
