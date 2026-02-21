import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import "dayjs/locale/cs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Box, Tooltip, Typography, useTheme } from "@mui/material";

dayjs.extend(isBetween);
dayjs.extend(weekday);

const DAY_HEIGHT = 110;
const WEEK_DAY_HEADER_HEIGHT = 40;

/**
 * Spočítá kolik týdenních řádků zabere daný měsíc v kalendáři.
 * Replikuje logiku MUI AdapterDayjs.getWeekArray() –
 * od startOfWeek(startOfMonth) do endOfWeek(endOfMonth).
 * Používá locale "cs" aby startOfWeek byl pondělí.
 */
function getWeekRowsInMonth(date) {
  const d = date.locale("cs");
  const start = d.startOf("month").startOf("week");
  const end = d.endOf("month").endOf("week");
  const totalDays = end.diff(start, "day") + 1;
  return Math.round(totalDays / 7);
}

/**
 * Vlastní komponenta pro den v kalendáři.
 */
function EventDay(props) {
  const theme = useTheme();
  const {
    day,
    outsideCurrentMonth,
    events = [],
    eventColorMap,
    weekRows,
    displayedMonth,
    onDaySelect: _onDaySelect,
    isFirstVisibleCell: _isFirst,
    isLastVisibleCell: _isLast,
    selected: _selected,
    autoFocus: _autoFocus,
    disableHighlightToday: _disableHT,
    showDaysOutsideCurrentMonth: _showOutside,
    today: _today,
    ...boxProps
  } = props;

  const dayEvents = useMemo(() => {
    if (outsideCurrentMonth) return [];
    return events.filter((event) => {
      const from = dayjs(event.from).startOf("day");
      const to = dayjs(event.to).endOf("day");
      return day.isBetween(from, to, "day", "[]");
    });
  }, [day, events, outsideCurrentMonth]);

  // Neděle (day()=0) je poslední den v týdnu při pondělním startu
  const isLastInRow = day.day() === 0;

  // Zjistíme, jestli den patří do posledního řádku kalendáře.
  // Použijeme displayedMonth a weekRows pro správný výpočet –
  // grid začíná na startOfWeek(startOfMonth(displayedMonth)),
  // poslední řádek začíná (weekRows - 1) * 7 dní od začátku gridu.
  const gridStart = useMemo(
    () => displayedMonth.locale("cs").startOf("month").startOf("week"),
    [displayedMonth],
  );
  const lastRowStart = useMemo(
    () => gridStart.add((weekRows - 1) * 7, "day"),
    [gridStart, weekRows],
  );
  const isLastRow = !day.isBefore(lastRowStart, "day");

  const borderRight = isLastInRow
    ? "none"
    : `1px solid ${theme.palette.divider}`;
  const borderBottom = isLastRow
    ? "none"
    : `1px solid ${theme.palette.divider}`;

  if (outsideCurrentMonth) {
    return (
      <Box
        sx={{
          width: "100%",
          height: DAY_HEIGHT,
          borderRight,
          borderBottom,
          backgroundColor: "action.hover",
        }}
      />
    );
  }

  return (
    <Box
      {...boxProps}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
        height: DAY_HEIGHT,
        p: 0,
        m: 0,
        borderRight,
        borderBottom,
        cursor: "default",
        transition: "background-color 0.12s",
        "&:hover": {
          backgroundColor: "action.selected",
        },
      }}
    >
      {/* Číslo dne – na střed */}
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.95rem",
          fontWeight: 500,
          textAlign: "center",
          pt: 0.5,
          pb: 0.25,
          lineHeight: 1.4,
          userSelect: "none",
          color: "text.primary",
        }}
      >
        {day.date()}
      </Typography>

      {/* Pruhy událostí */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "3px",
          width: "100%",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {dayEvents.map((event) => (
          <Tooltip key={event.name} title={event.name} arrow>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                console.log(event.text);
              }}
              sx={{
                width: "100%",
                height: 12,
                backgroundColor:
                  eventColorMap?.[event.name] ?? theme.palette.primary.main,
                cursor: "pointer",
                //borderRadius: "16px", // border radius pruhu disabled for now - do not edit or remove comment
                transition: "opacity 0.15s",
                "&:hover": {
                  opacity: 0.65,
                },
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}

/**
 * CustomMuiCalendar
 *
 * Props:
 * - events: Array<{ name: string, from: string | Date | Dayjs, to: string | Date | Dayjs, text: string }>
 * - value / onChange: Volitelně pro řízený výběr data
 * - ...rest: Ostatní props se předají do DateCalendar
 */
export default function CustomMuiCalendar({
  events = [],
  value,
  onChange,
  ...rest
}) {
  const theme = useTheme();
  const [internalValue, setInternalValue] = useState(dayjs());
  // Sledujeme aktuálně zobrazený měsíc (může se lišit od vybraného data)
  const [displayedMonth, setDisplayedMonth] = useState(dayjs());

  const selectedValue = value !== undefined ? value : internalValue;
  const handleChange = onChange ?? setInternalValue;

  const handleMonthChange = useCallback((newMonth) => {
    setDisplayedMonth(newMonth);
  }, []);

  // Dynamický počet řádků pro aktuální měsíc
  const weekRows = useMemo(
    () => getWeekRowsInMonth(displayedMonth),
    [displayedMonth],
  );
  const gridHeight = weekRows * DAY_HEIGHT;

  // Přiřaď každé unikátní události stabilní barvu
  const eventColorMap = useMemo(() => {
    const map = {};
    const uniqueNames = [...new Set(events.map((e) => e.name))];
    const eventColors = theme.palette.event?.colors || [
      theme.palette.primary.main,
      theme.palette.error.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
    ];
    uniqueNames.forEach((name, i) => {
      map[name] = eventColors[i % eventColors.length];
    });
    return map;
  }, [events, theme]);

  return (
    <Box
      sx={{
        width: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
      }}
    >
      <DateCalendar
        value={selectedValue}
        onChange={handleChange}
        onMonthChange={handleMonthChange}
        showDaysOutsideCurrentMonth
        dayOfWeekFormatter={(date) =>
          dayjs(date)
            .format("dddd")
            .replace(/^\w/, (c) => c.toUpperCase())
        }
        slots={{ day: EventDay }}
        slotProps={{
          day: {
            events,
            eventColorMap,
            weekRows,
            displayedMonth,
          },
        }}
        sx={{
          width: "100%",
          maxWidth: "100%",
          height: "auto !important",
          maxHeight: "none !important",
          overflow: "hidden",

          // Vnitřní kontejnery – dynamická výška
          "& .MuiDateCalendar-viewTransitionContainer": {
            height: gridHeight + WEEK_DAY_HEADER_HEIGHT,
            transition: "height 0.2s ease",
          },

          // MonthContainer
          "& .MuiDayCalendar-monthContainer": {
            position: "relative",
          },

          // Header s názvem měsíce a šipkami
          "& .MuiPickersCalendarHeader-root": {
            px: 2,
            py: 2,
            m: 0,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiPickersCalendarHeader-label": {
            fontSize: "1.2rem",
            fontWeight: 600,
          },

          // Řádek s názvy dnů – celá slova
          "& .MuiDayCalendar-header": {
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            width: "100%",
          },
          "& .MuiDayCalendar-weekDayLabel": {
            width: "100%",
            height: WEEK_DAY_HEADER_HEIGHT,
            fontSize: "0.85rem",
            fontWeight: 600,
            margin: 0,
            borderRight: `1px solid ${theme.palette.divider}`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            "&:last-of-type": {
              borderRight: "none",
            },
          },

          // Slide transition – dynamická výška podle počtu týdnů v měsíci
          "& .MuiDayCalendar-slideTransition": {
            minHeight: gridHeight,
            height: gridHeight,
            transition: "height 0.2s ease, min-height 0.2s ease",
          },

          // Týdenní řádky
          "& .MuiDayCalendar-weekContainer": {
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            margin: 0,
          },

          // Reset defaultních PickersDay stylů
          "& .MuiPickersDay-root": {
            width: "100%",
            height: "auto",
            margin: 0,
            padding: 0,
            borderRadius: 0,
          },

          // YearCalendar / MonthCalendar – roztáhnout na celou šířku
          "& .MuiYearCalendar-root": {
            width: "100%",
            maxHeight: gridHeight,
            overflowY: "auto",
          },
          "& .MuiMonthCalendar-root": {
            width: "100%",
          },
        }}
        {...rest}
      />
    </Box>
  );
}
