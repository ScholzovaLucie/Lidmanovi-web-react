import {
  Numbers,
  CheckCircleOutline,
  Favorite,
  Cake,
  EventAvailable,
  Groups,
  Restaurant,
  MusicNote,
  Home,
  Park,
} from "@mui/icons-material";

// Special value — no icon is rendered, the "value" field is shown as a big
// number instead (see EditableIconPicker / SalPage).
export const NUMBER_MODE = "number";

export const ICON_OPTIONS = {
  [NUMBER_MODE]: { label: "Velké číslo (bez ikony)", Icon: Numbers },
  check: { label: "Zaškrtnutí", Icon: CheckCircleOutline },
  heart: { label: "Srdce", Icon: Favorite },
  cake: { label: "Dort", Icon: Cake },
  event: { label: "Kalendář", Icon: EventAvailable },
  groups: { label: "Skupina lidí", Icon: Groups },
  restaurant: { label: "Restaurace", Icon: Restaurant },
  music: { label: "Hudba", Icon: MusicNote },
  home: { label: "Ubytování", Icon: Home },
  park: { label: "Zahrada", Icon: Park },
};

export function resolveIcon(key) {
  return ICON_OPTIONS[key]?.Icon || ICON_OPTIONS.check.Icon;
}
