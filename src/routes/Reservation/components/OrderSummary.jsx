import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import { Bed } from "@mui/icons-material";
import { CalendarIcon } from "@mui/x-date-pickers";
import ReservationAppBar from "./ReservationAppBar";

export function OrderSummary() {
  return (
    <>
      <ReservationAppBar />
      <Stack
        sx={{ 
          minHeight: "calc(100vh - 190px)",
          paddingTop: 2 // Přidá mezeru pod sticky AppBar
        }}
        alignItems={"center"}
        justifyContent={"center"}
        p={3}
      >
      <Stack width={{ width: "100%", maxWidth: 600 }} spacing={4}>
        <Typography variant="h4" textAlign={{ xs: "start", sm: "center" }}>
          Souhrn rezervace
        </Typography>

        <AppCardCustomizable>
          <Stack p={2} spacing={2} sx={{ width: "100%" }}>
            <Typography
              variant="h5"
              fontWeight={"bold"}
              textAlign={"start"}
              component={Box}
              paddingX={1}
            >
              Penzion u Lidmanů
            </Typography>

            <Divider />

            {/* Detalily pobytu */}
            <Stack alignItems={"center"} direction={"row"} spacing={1.5} p={1}>
              <HighlightedIcon Icon={CalendarIcon} />

              <Stack alignItems={"start"}>
                <Typography variant="body1" fontWeight={"bold"} color="primary">
                  Termín pobytu
                </Typography>
                <Typography variant="body1">
                  <strong>27.1. - 28.1.2026</strong> (2 noci)
                </Typography>
              </Stack>
            </Stack>

            {/* Počet hostů */}
            <Stack
              alignItems={"center"}
              direction={"row"}
              spacing={1.5}
              paddingX={1}
            >
              <HighlightedIcon Icon={Bed} />

              <Stack alignItems={"start"}>
                <Typography variant="body1" fontWeight={"bold"} color="primary">
                  Počet hostů
                </Typography>
                <Typography variant="body1">
                  <strong>4 hosté</strong> (2 dospělí, 2 děti)
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            {/* Ubytování */}
            <Stack spacing={1}>
              {Array(2)
                .fill()
                .map((_, index) => (
                  <Stack
                    bgcolor={"#f6fbff"}
                    borderRadius={1}
                    p={1}
                    spacing={0.5}
                  >
                    <Stack
                      alignItems={"center"}
                      direction={"row"}
                      spacing={1.5}
                    >
                      <HighlightedIcon Icon={Bed} />

                      <Stack
                        alignItems={"start"}
                        justifyContent={"space-between"}
                        direction={"row"}
                        width={"100%"}
                      >
                        <Typography
                          variant="body1"
                          fontWeight={"bold"}
                          color="primary"
                        >
                          Třílůžkový pokoj
                        </Typography>
                        <Typography variant="body1" fontWeight={"bold"}>
                          5 463 Kč
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography variant="body2" color="text.tertiary">
                        2x Dosplělý
                      </Typography>
                      <Typography variant="body2" color="text.tertiary">
                        345 Kč
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography variant="body2" color="text.tertiary">
                        1x Dítě
                      </Typography>
                      <Typography variant="body2" color="text.tertiary">
                        145 Kč
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
            </Stack>

            <Divider />

            {/* Celková cena */}
            <Stack
              spacing={1}
              alignItems={"end"}
              justifyContent={"space-between"}
              direction={"row"}
              px={1}
            >
              <Typography variant="h6" color="primary">
                Celková cena:
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                7 063 Kč
              </Typography>
            </Stack>

            <Box padding={1}>
              <Button variant="contained" size="large" fullWidth>
                ZÁVAZNĚ REZERVOVAT
              </Button>
            </Box>
          </Stack>
        </AppCardCustomizable>
      </Stack>
    </Stack>
    </>
  );
}
function HighlightedIcon({ Icon }) {
  return (
    <Stack padding={1} borderRadius={1} bgcolor={"#E3F2FD"}>
      <Icon color="primary" />
    </Stack>
  );
}
