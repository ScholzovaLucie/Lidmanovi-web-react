// Formát sloupců pro POST /pension/admin/reservations/bulk-import/
// (viz docs/reservation_bulk_import.md v backend repozitáři). Jeden řádek = jeden
// pokoj, řádky se stejným booking_reference tvoří dohromady jednu rezervaci.
export const RESERVATION_IMPORT_COLUMNS = [
  {
    key: "booking_reference",
    required: true,
    format: "text, unikátní v souboru",
    note: "spojuje řádky do jedné rezervace",
  },
  {
    key: "check_in_date",
    required: true,
    format: "YYYY-MM-DD nebo DD.MM.YYYY",
    note: "musí být stejné pro celou skupinu",
  },
  {
    key: "check_out_date",
    required: true,
    format: "YYYY-MM-DD nebo DD.MM.YYYY",
    note: "pozdější než check_in_date",
  },
  {
    key: "room_name",
    required: true,
    format: "přesný název existujícího aktivního pokoje",
    note: "case-sensitive shoda s Room.name",
  },
  {
    key: "room_num_adults",
    required: true,
    format: "celé číslo ≥ 1",
    note: "počet dospělých v tomto pokoji",
  },
  {
    key: "room_num_children",
    required: false,
    format: "celé číslo ≥ 0, výchozí 0",
    note: "počet dětí v tomto pokoji",
  },
  {
    key: "guest_first_name",
    required: true,
    format: "text",
    note: "jméno hlavního hosta",
  },
  {
    key: "guest_last_name",
    required: true,
    format: "text",
    note: "příjmení hlavního hosta",
  },
  {
    key: "guest_email",
    required: false,
    format: "e-mail",
    note: "slouží k dohledání existujícího hosta",
  },
  { key: "guest_phone", required: false, format: "text", note: "" },
  { key: "guest_country", required: false, format: "text", note: "" },
  {
    key: "guest_note",
    required: false,
    format: "text",
    note: "poznámka u hosta",
  },
  {
    key: "status",
    required: false,
    format: "new/confirmed/cancelled/payment_pending/payed/done, výchozí new",
    note: "",
  },
  { key: "currency", required: false, format: "text, výchozí CZK", note: "" },
  { key: "note", required: false, format: "text", note: "poznámka u rezervace" },
  {
    key: "number",
    required: false,
    format: "text, unikátní",
    note: "jinak se vygeneruje automaticky",
  },
  {
    key: "price",
    required: false,
    format: "číslo",
    note: "jinak se dopočítá z ceníku pokojů a počtu nocí",
  },
];

// Statická šablona (s ukázkovým řádkem a README listem) uložená v public/templates.
export const RESERVATION_IMPORT_TEMPLATE_URL = `${import.meta.env.BASE_URL}templates/sablona_import_rezervaci.xlsx`;
