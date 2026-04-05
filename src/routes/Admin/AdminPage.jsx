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
import { useState } from "react";
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

// Menu items s reálnými admin komponentami
const menuItems = [
  { id: "calendar", text: "Kalendář", icon: CalendarMonth },
  { id: "reservations", text: "Rezervace", icon: EventAvailableIcon },
  { id: "guests", text: "Hosté", icon: People },
  { id: "rooms", text: "Pokoje", icon: BedIcon },
  { id: "announcement", text: "Oznámení", icon: CampaignIcon },
  { id: "gallery", text: "Galerie", icon: CollectionsIcon },
];

const DRAWER_WIDTH = 200;

export default function AdminPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("calendar");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

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
    };
    return components[activeComponent] || components.calendar;
  };

  const drawerContent = (
    <Box
      sx={{
        overflow: "auto",
        paddingTop: isMobile ? "64px" : 0,
      }}
    >
        <Toolbar>
          <Typography variant="h6"> Administrace</Typography>
        </Toolbar>

      <Divider />

      <ListItem disablePadding>
        <ListItemButton onClick={() => navigate("/")}>
          <ListItemIcon>
            <ArrowBack />
          </ListItemIcon>
          <ListItemText primary="Zpět na web" />
        </ListItemButton>
      </ListItem>

      <Divider />

      {menuItems.map(({ id, text, icon: Icon }) => (
        <ListItem key={id} disablePadding>
          <ListItemButton onClick={() => handleMenuClick(id)}>
            <ListItemIcon
              sx={{
                color: activeComponent === id ? "black" : "rgba(0,0,0,0.6)",
              }}
            >
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={text}
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: activeComponent === id ? "bold" : "light",
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
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          mt: isMobile ? "64px" : 0,
          overflow: "auto",
        }}
      >
        {renderActiveComponent()}
      </Box>
    </Box>
  );
}
