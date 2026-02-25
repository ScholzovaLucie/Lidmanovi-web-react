# Admin Dashboard - Penzion Lidmanovi

Moderní administrátorský dashboard pro správu penzionu s rezervačním systémem.

## Struktura

```
src/routes/Admin/
├── AdminPage.jsx                 # Hlavní dashboard komponenta
├── constants.jsx                 # Konstanty a konfigurace
├── components/                   # Sdílené komponenty
│   ├── CustomMuiCalendar.jsx    # Vlastní kalendář komponenta
│   └── CustomMuiTable.jsx       # Vlastní tabulka komponenta
└── sections/                    # Sekce dashboardu
    ├── index.js                 # Export všech sekcí
    ├── calendar/
    │   └── CalendarSection.jsx  # Sekce kalendáře rezervací
    ├── guests/
    │   └── GuestsSection.jsx    # Sekce správy hostů
    └── reservations/
        └── ReservationsSection.jsx # Sekce správy rezervací
```

## Funkce

### 🗓️ Kalendář rezervací
- Vizualizace rezervací v kalendáři
- Statistiky rezervací (celkem, tento měsíc, nadcházející)
- Přehledné zobrazení obsazených termínů

### 👥 Správa hostů
- Seznam všech hostů s kontaktními údaji
- Vyhledávání hostů podle jména, emailu nebo telefonu
- Statistiky hostů (celkem, s rezervacemi, noví)
- Možnost přidání nového hosta

### 📋 Správa rezervací
- Seznam všech rezervací s detaily
- Filtrování podle stavu rezervace
- Vyhledávání rezervací
- Zobrazení tržeb a statistik
- Možnost upravení stavu rezervace

## Design

- **Minimalistický a čistý**: Vzdušný design s důrazem na čitelnost
- **Responsivní**: Plně funkční na všech zařízeních
- **Material-UI**: Využívá MUI komponenty pro konzistentní vzhled
- **Přepínací sekce**: Každá funkce ve vlastní záložce
- **Moderní vzhled**: Glassmorphism efekty a jemné stíny

## Použití

Dashboard se automaticky načte po přihlášení administrátora. Mezi sekcemi lze přepínat pomocí záložek v horní části.

### Základní navigace:
1. **Kalendář** - Přehled rezervací v kalendáři
2. **Rezervace** - Správa všech rezervací 
3. **Hosté** - Správa databáze hostů

### Funkce:
- Statistiky v reálném čase
- Vyhledávání a filtrování
- Responsivní design
- Intuitivní ovládání