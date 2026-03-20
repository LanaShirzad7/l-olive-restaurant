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
  // 🎯 SECURE: Check session storage
  const storedUserString = sessionStorage.getItem("user");
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
  // 🎯 SECURE: Initialize state directly from the secure session memory
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("token"),
  );
  const [isEvening, setIsEvening] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      const token = sessionStorage.getItem("token"); // 🎯 SECURE
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours();
      setIsEvening(currentHour >= 19 || currentHour < 7);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAuthChange = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div
          className={`flex flex-col min-h-screen font-sans transition-colors duration-1000 ease-in-out ${
            isEvening
              ? "bg-[#1C2517] text-[#FDFCF0]"
              : "bg-[#FDFCF0] text-[#283618]"
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
