import {
  Box,
  Typography,
  ListItemButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  List,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ArrowBack, CalendarMonth, People } from "@mui/icons-material";
import CampaignIcon from "@mui/icons-material/Campaign";
import BedIcon from "@mui/icons-material/Bed";
import { useEffect, useRef, useState } from "react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import {
  CalendarSection,
  GuestsSection,
  ReservationsSection,
} from "./sections";
import RoomsSection from "./sections/rooms/RoomsSection";
import AnnouncementSection from "./sections/announcement/AnnouncementSection";
import { useNavigate } from "react-router-dom";
import GallerySection from "./sections/gallery/GallerySection";
import CollectionsIcon from "@mui/icons-material/Collections";
import MenuSection from "./sections/menu/MenuSection";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";

// Menu items s reálnými admin komponentami
const menuItems = [
  { id: "calendar", text: "Kalendář", icon: CalendarMonth },
  { id: "reservations", text: "Rezervace", icon: EventAvailableIcon },
  { id: "guests", text: "Hosté", icon: People },
  { id: "rooms", text: "Pokoje", icon: BedIcon },
  { id: "announcement", text: "Oznámení", icon: CampaignIcon },
  { id: "gallery", text: "Fotky", icon: CollectionsIcon },
  { id: "menu", text: "Menu", icon: ViewHeadlineIcon },
];

const DRAWER_WIDTH = 200;

export default function AdminPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("calendar");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const contentRef = useRef(null);

  // Sekce v adminu se přepínají bez remountu scroll kontejneru, takže by
  // jinak nová sekce naskočila zascrollovaná tam, kde skončila ta předchozí.
  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [activeComponent]);

  const handleMenuClick = (componentId) => {
    setActiveComponent(componentId);
    if (isMobile) setMobileOpen(false);
  };

  const renderActiveComponent = () => {
    const components = {
      calendar: <CalendarSection />,
      reservations: <ReservationsSection />,
      guests: <GuestsSection />,
      rooms: <RoomsSection />,
      announcement: <AnnouncementSection />,
      gallery: <GallerySection />,
      menu: <MenuSection />,
    };
    return components[activeComponent] || components.calendar;
  };

  const drawerContent = (
    <Box
      sx={{
        overflow: "auto",
        paddingTop: isMobile ? "64px" : 0,
        height: "100%",
        bgcolor: "#292520",
        color: "#fffaf0",
      }}
    >
        <Toolbar>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 26,
              color: "#fffaf0",
            }}
          >
            Administrace
          </Typography>
        </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,250,240,0.08)" }} />

      <ListItem disablePadding>
        <ListItemButton onClick={() => navigate("/")} sx={{ color: "#c7b89f" }}>
          <ListItemIcon sx={{ color: "#c7b89f", minWidth: 34 }}>
            <ArrowBack />
          </ListItemIcon>
          <ListItemText primary="Zpět na web" />
        </ListItemButton>
      </ListItem>

      <Divider sx={{ borderColor: "rgba(255,250,240,0.08)" }} />

      {menuItems.map(({ id, text, icon: Icon }) => (
        <ListItem key={id} disablePadding>
          <ListItemButton
            onClick={() => handleMenuClick(id)}
            sx={{
              bgcolor: activeComponent === id ? "primary.main" : "transparent",
              color: "#fffaf0",
              "&:hover": { bgcolor: activeComponent === id ? "primary.main" : "rgba(255,250,240,0.07)" },
            }}
          >
            <ListItemIcon
              sx={{
                color: "#fffaf0",
                minWidth: 34,
              }}
            >
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={text}
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: activeComponent === id ? 700 : 400,
                  fontSize: "0.92rem",
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            minHeight: "64px",
            justifyContent: "center",
          }}
        >
          <Toolbar sx={{ minHeight: "64px"}}>
            <IconButton
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { md: "none" },  }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap color="black">
              Administrace
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              bgcolor: "#292520",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              bgcolor: "#292520",
              borderRight: "1px solid #201c18",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        ref={contentRef}
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, md: 4 },
          mt: isMobile ? "64px" : 0,
          overflow: "auto",
          bgcolor: "background.default",
        }}
      >
        {renderActiveComponent()}
      </Box>
    </Box>
  );
}
