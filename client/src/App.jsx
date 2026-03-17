import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Menu from "./components/Menu";
import AboutUs from "./components/AboutUs";
import Reservation from "./components/Reservation";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import Checkout from "./components/Checkout";
import { CartProvider } from "./context/CartContext.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ResetPassword from "./components/ResetPassword";
import Footer from "./components/Footer";

// --- GLOBAL SCROLL RESET ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- PROTECTED ADMIN ROUTE ---
const AdminRoute = ({ children }) => {
  const storedUserString = localStorage.getItem("user");
  let isAdmin = false;
  let needsRelogin = false;

  if (!storedUserString) {
    needsRelogin = true;
  } else {
    try {
      const storedUser = JSON.parse(storedUserString);
      isAdmin = storedUser.email === "lana.shirzad@gmail.com";
    } catch (error) {
      console.error("Failed to parse user session data:", error);
      needsRelogin = true;
    }
  }

  if (needsRelogin) return <Navigate to="/auth" />;
  if (isAdmin) return children;
  return <Navigate to="/" />;
};

function App() {
  // 🎯 PERSISTENCE: Initialize state directly from the browser's memory
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // 🎯 FEATURE 5: THE "GOLDEN HOUR" THEME STATE
  const [isEvening, setIsEvening] = useState(false);

  // 🎯 SYNC: Listen for changes in localStorage (e.g., if user logs out in another tab)
  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // 🎯 DYNAMIC TIME CHECKER FOR THE THEME
  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours();
      // Activates the dark theme between 7 PM (19:00) and 6:59 AM
      setIsEvening(currentHour >= 19 || currentHour < 7);
    };

    checkTime(); // Check immediately on load
    const interval = setInterval(checkTime, 60000); // Re-check every minute
    return () => clearInterval(interval);
  }, []);

  const handleAuthChange = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        {/* 🎯 UPDATED WRAPPER: Smooth transition between Day and Night themes */}
        <div
          className={`flex flex-col min-h-screen font-sans transition-colors duration-1000 ease-in-out ${
            isEvening
              ? "bg-[#1C2517] text-[#FDFCF0]" // Midnight Olive (Night)
              : "bg-[#FDFCF0] text-[#283618]" // Cream & Sage (Day)
          }`}
        >
          <Navbar
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={handleAuthChange}
            isEvening={isEvening}
          />

          <main className="grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

              {/* PROTECTED ADMIN */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* PROTECTED DASHBOARD */}
              <Route
                path="/dashboard"
                element={
                  isLoggedIn ? (
                    <Dashboard setIsLoggedIn={handleAuthChange} />
                  ) : (
                    <Navigate to="/auth" />
                  )
                }
              />

              {/* AUTH ROUTE */}
              <Route
                path="/auth"
                element={
                  !isLoggedIn ? (
                    <Auth setIsLoggedIn={handleAuthChange} />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                }
              />

              {/* CHECKOUT */}
              <Route
                path="/checkout"
                element={isLoggedIn ? <Checkout /> : <Navigate to="/auth" />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
