import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import LocalParkingOutlinedIcon from "@mui/icons-material/LocalParkingOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import BalconyOutlinedIcon from "@mui/icons-material/BalconyOutlined";
import SmokeFreeOutlinedIcon from "@mui/icons-material/SmokeFreeOutlined";

// Kompletní paleta ikon, které frontend umí vykreslit. Backend (tabulka
// AmenityIcon) řídí, které z těchto klíčů se administrátorovi nabízí a jak
// se jmenují - přidání nové položky do palety níž je jediné místo, kde je
// pro novou ikonu potřeba frontend deploy; zapnutí/vypnutí/přejmenování už
// jde čistě přes admin bez zásahu do kódu.
export const ROOM_AMENITY_ICON_LIBRARY = {
  bed: { label: "Lůžka / kapacita", Icon: HotelOutlinedIcon },
  bathroom: { label: "Koupelna", Icon: BathtubOutlinedIcon },
  wifi: { label: "Wi-Fi", Icon: WifiOutlinedIcon },
  tv: { label: "Televize", Icon: TvOutlinedIcon },
  dog: { label: "Pes / mazlíčci", Icon: PetsOutlinedIcon },
  parking: { label: "Parkování", Icon: LocalParkingOutlinedIcon },
  aircon: { label: "Klimatizace", Icon: AcUnitOutlinedIcon },
  kitchen: { label: "Kuchyňka", Icon: KitchenOutlinedIcon },
  balcony: { label: "Balkon", Icon: BalconyOutlinedIcon },
  nonsmoking: { label: "Nekuřácký pokoj", Icon: SmokeFreeOutlinedIcon },
};

export function resolveRoomAmenityIcon(key) {
  return ROOM_AMENITY_ICON_LIBRARY[key]?.Icon || ROOM_AMENITY_ICON_LIBRARY.bed.Icon;
}

// Klíč "bed" má zvláštní chování v RoomCard - necháte-li text prázdný,
// dopočítá se automaticky z kapacity pokoje (`${room.capacity} lůžek`).

// Použije se, dokud backendový číselník AmenityIcon není dostupný (endpoint
// ještě neexistuje / vrátí chybu / je prázdný) - odpovídá výchozímu seedu,
// který má backend nastavit.
export const DEFAULT_AMENITY_ICON_OPTIONS = [
  { key: "bed", label: ROOM_AMENITY_ICON_LIBRARY.bed.label, is_active: true },
  { key: "bathroom", label: ROOM_AMENITY_ICON_LIBRARY.bathroom.label, is_active: true },
  { key: "wifi", label: ROOM_AMENITY_ICON_LIBRARY.wifi.label, is_active: true },
  { key: "tv", label: ROOM_AMENITY_ICON_LIBRARY.tv.label, is_active: true },
  { key: "dog", label: ROOM_AMENITY_ICON_LIBRARY.dog.label, is_active: true },
];

// Dokud pokoj nemá vlastní `amenities` (starší data / backend pole ještě
// nevyplnil), zobrazí se tahle sada - odpovídá původním napevno
// vykresleným třem ikonám.
export const DEFAULT_ROOM_AMENITIES = [
  { icon: "bed", text: "" },
  { icon: "bathroom", text: "Koupelna" },
  { icon: "wifi", text: "Wi-Fi" },
];
