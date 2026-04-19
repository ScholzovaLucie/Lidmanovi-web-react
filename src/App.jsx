import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout.jsx";
import { useAuth } from "./hooks/useAuth.js";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Lazy loaded routes
const HomePage = lazy(() => import("./routes/Home/HomePage.jsx"));
const Kontakt = lazy(() => import("./routes/Kontakt.jsx"));
const Restauration = lazy(() => import("./routes/Restauration.jsx"));
const Accommodations = lazy(() => import("./routes/Accommodations.jsx"));
const Weddings = lazy(() => import("./routes/Weddings.jsx"));
const AccommodationPackages = lazy(
  () => import("./routes/AccommodationPackages.jsx"),
);
const PriceList = lazy(() => import("./routes/PriceList.jsx"));
const Galerie = lazy(() => import("./routes/Galerie.jsx"));
const AdminPage = lazy(() => import("./routes/Admin/AdminPage.jsx"));
const ReservationPage2 = lazy(
  () => import("./routes/Reservation/ReservationPage.jsx"),
);
const PokojevPage = lazy(() => import("./routes/Pokoje/PokojevPage.jsx"));
const Gdpr = lazy(() => import("./routes/Gdpr.jsx"));

// Loading component
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
      fontSize: "18px",
    }}
  >
    Načítání...
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/o-nas" element={<Navigate to="/" replace />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/restaurace" element={<Restauration />} />
          <Route path="/ubytovani" element={<Accommodations />} />
          <Route path="/svatby" element={<Weddings />} />
          <Route path="/pobytove_balicky" element={<AccommodationPackages />} />
          <Route path="/cenik" element={<PriceList />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/pokoje" element={<PokojevPage />} />
          <Route path="/rezervace" element={<ReservationPage2 />} />
          <Route path="/gdpr" element={<Gdpr />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
