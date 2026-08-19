import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";

// Klíč "bed" má zvláštní chování v RoomCard - necháte-li text prázdný,
// dopočítá se automaticky z kapacity pokoje (`${room.capacity} lůžek`).
export const ROOM_AMENITY_ICON_OPTIONS = {
  bed: { label: "Lůžka / kapacita", Icon: HotelOutlinedIcon },
  bathroom: { label: "Koupelna", Icon: BathtubOutlinedIcon },
  wifi: { label: "Wi-Fi", Icon: WifiOutlinedIcon },
  tv: { label: "Televize", Icon: TvOutlinedIcon },
  dog: { label: "Pes / mazlíčci", Icon: PetsOutlinedIcon },
};

export function resolveRoomAmenityIcon(key) {
  return ROOM_AMENITY_ICON_OPTIONS[key]?.Icon || ROOM_AMENITY_ICON_OPTIONS.bed.Icon;
}

// Dokud backend nemá pole `amenities` vyplněné (nebo ho ještě vůbec nemá),
// pokoje se chovají stejně jako dřív - tahle sada odpovídá původním
// napevno vykresleným třem ikonám.
export const DEFAULT_ROOM_AMENITIES = [
  { icon: "bed", text: "" },
  { icon: "bathroom", text: "Koupelna" },
  { icon: "wifi", text: "Wi-Fi" },
];
