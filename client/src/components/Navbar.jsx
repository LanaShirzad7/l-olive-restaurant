import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext.jsx";
// 🎯 1. Import the translation hook
import { useTranslation } from "react-i18next";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  // 🎯 2. Initialize translation hook
  const { t, i18n } = useTranslation();

  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    cartCount,
    cartTotal,
    removeFromCart,
    addToCart,
  } = useContext(CartContext);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    try {
      const storedNotes = localStorage.getItem("notifications");
      return storedNotes ? JSON.parse(storedNotes) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncNotifications = () => {
      if (!isLoggedIn) {
        setNotifications([]);
        return;
      }
      try {
        const storedNotes = localStorage.getItem("notifications");
        const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
        setNotifications(Array.isArray(parsedNotes) ? parsedNotes : []);
      } catch {
        setNotifications([]);
      }
    };
    syncNotifications();
    window.addEventListener("update-notifications", syncNotifications);
    window.addEventListener("storage", syncNotifications);
    return () => {
      window.removeEventListener("update-notifications", syncNotifications);
      window.removeEventListener("storage", syncNotifications);
    };
  }, [isLoggedIn]);

  let safeUser = {};
  let isAdmin = false;
  if (isLoggedIn) {
    try {
      safeUser = JSON.parse(localStorage.getItem("user") || "{}");
      isAdmin = safeUser.email === "lana.shirzad@gmail.com";
    } catch (e) {
      console.error("Error reading user data", e);
    }
  }

  const clearNotifications = () => {
    localStorage.setItem("notifications", JSON.stringify([]));
    setNotifications([]);
    setIsNotificationOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    if (setIsLoggedIn) setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleCheckoutNavigation = () => {
    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/checkout");
  };

  // 🎯 HELPER TO CHANGE LANGUAGE
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <nav
        className={`fixed w-full z-40 transition-all duration-300 px-6 ${
          isScrolled || isMobileMenuOpen
            ? "py-3 bg-[#FBFBF0]/95 shadow-md backdrop-blur-md"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* LOGO */}
          <Link
            to="/"
            className="no-underline z-50"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl font-semibold tracking-wider text-earth-dark">
                L&apos;OLIVE
              </span>
              {/* 🎯 TRANSLATED */}
              <span className="text-earth-medium text-[8px] md:text-[10px] tracking-[0.3em] uppercase font-sans -mt-1">
                {t("organic_kitchen")}
              </span>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-8 uppercase tracking-[0.15em] text-[11px] font-sans font-semibold">
            <Link
              to="/about"
              className="text-earth-dark hover:text-earth-light no-underline transition-colors"
            >
              {t("our_story")}
            </Link>
            <Link
              to="/menu"
              className="text-earth-dark hover:text-earth-light no-underline transition-colors"
            >
              {t("menu")}
            </Link>
            <Link
              to="/reservation"
              className="text-earth-dark hover:text-earth-light no-underline transition-colors"
            >
              {t("book_table")}
            </Link>

            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="text-earth-dark hover:text-earth-light no-underline border-l border-earth-dark/20 pl-8 flex items-center gap-3 group"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-earth-dark/20 transition-transform group-hover:scale-110">
                  {safeUser.profilePic ? (
                    <img
                      src={safeUser.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-sand/50 flex items-center justify-center text-[10px] font-sans font-bold text-earth-dark uppercase">
                      {safeUser.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <span className="hidden lg:block">{t("dashboard")}</span>
              </Link>
            )}

            {isLoggedIn && isAdmin && (
              <Link
                to="/admin"
                className="text-red-800 hover:text-red-600 font-bold no-underline border-l border-earth-dark/20 pl-8 flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-lock text-xs"></i> {t("admin_panel")}
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-5 md:space-x-6 z-50">
            {/* 🎯 LANGUAGE TOGGLE */}
            <div className="hidden md:flex items-center space-x-2 text-[9px] font-sans font-bold text-earth-dark/50 tracking-widest">
              <button
                onClick={() => changeLanguage("en")}
                className={`bg-transparent border-none cursor-pointer transition-colors ${i18n.language === "en" ? "text-earth-dark" : "hover:text-earth-dark"}`}
              >
                EN
              </button>
              <span>|</span>
              <button
                onClick={() => changeLanguage("hy")}
                className={`bg-transparent border-none cursor-pointer transition-colors ${i18n.language === "hy" ? "text-earth-dark" : "hover:text-earth-dark"}`}
              >
                HY
              </button>
              <span>|</span>
              <button
                onClick={() => changeLanguage("ru")}
                className={`bg-transparent border-none cursor-pointer transition-colors ${i18n.language === "ru" ? "text-earth-dark" : "hover:text-earth-dark"}`}
              >
                RU
              </button>
            </div>

            {/* NOTIFICATION BELL */}
            {isLoggedIn && (
              <div className="relative">
                {isNotificationOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationOpen(false)}
                  ></div>
                )}

                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative z-50 text-earth-dark hover:text-earth-light bg-transparent border-none cursor-pointer flex items-center transition-transform hover:scale-110"
                >
                  <i className="far fa-bell text-lg md:text-xl"></i>
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-[#FDFCF0] animate-pulse"></span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-[-40px] md:right-0 mt-6 w-[85vw] max-w-[320px] md:w-80 bg-[#FDFCF0]/95 backdrop-blur-xl border border-sand shadow-2xl p-0 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right rounded-sm overflow-hidden">
                    <div className="p-4 border-b border-sand flex justify-between items-center bg-white/60">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-earth-medium">
                        Sanctuary Notices
                      </h4>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-[9px] text-gray-400 bg-transparent cursor-pointer hover:text-red-800 uppercase font-bold tracking-widest transition-colors border-none"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((note, idx) => (
                          <div
                            key={idx}
                            className="p-5 border-b border-sand/50 last:border-0 hover:bg-white/50 transition-colors"
                          >
                            <div className="flex gap-4">
                              <i className="fas fa-leaf text-[10px] text-earth-medium mt-1"></i>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-earth-dark mb-1">
                                  {note.title}
                                </p>
                                <p className="text-xs italic text-earth-medium leading-relaxed font-serif">
                                  {note.message}
                                </p>
                                <p className="text-[8px] uppercase text-gray-400 mt-2 tracking-widest font-sans">
                                  {note.date}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center bg-white/30">
                          <i className="fas fa-wind text-2xl text-sand mb-3"></i>
                          <p className="text-xs italic text-gray-400 font-serif">
                            Your sanctuary is peaceful.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CART ICON */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-earth-dark bg-transparent cursor-pointer flex items-center transition-transform hover:scale-110 border-none"
            >
              <i className="fas fa-shopping-bag text-lg md:text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-earth-dark text-cream text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-sans font-bold shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              className="md:hidden text-earth-dark text-xl bg-transparent cursor-pointer border-none ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i
                className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}
              ></i>
            </button>

            {/* DESKTOP AUTH */}
            <div className="hidden md:block pl-2">
              {!isLoggedIn ? (
                <Link
                  to="/auth"
                  className="px-5 py-2 border border-earth-dark text-earth-dark hover:bg-earth-dark hover:text-cream no-underline transition-all font-sans text-[11px] font-bold uppercase"
                >
                  {t("sign_up")}
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-red-800 text-[10px] uppercase tracking-widest bg-transparent cursor-pointer opacity-70 hover:opacity-100 transition-opacity font-bold border-none"
                >
                  {t("logout")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-[#FDFCF0] transition-all duration-300 overflow-hidden shadow-lg ${isMobileMenuOpen ? "max-h-screen opacity-100 py-10" : "max-h-0 opacity-0"}`}
        >
          <div className="flex flex-col items-center space-y-8 uppercase tracking-[0.2em] text-xs font-sans font-bold text-earth-dark">
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="no-underline text-earth-dark"
            >
              {t("our_story")}
            </Link>
            <Link
              to="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="no-underline text-earth-dark"
            >
              {t("menu")}
            </Link>
            <Link
              to="/reservation"
              onClick={() => setIsMobileMenuOpen(false)}
              className="no-underline text-earth-dark"
            >
              {t("book_table")}
            </Link>

            {isLoggedIn && isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="no-underline text-red-800 flex items-center gap-2"
              >
                <i className="fas fa-lock"></i> {t("admin_panel")}
              </Link>
            )}

            <div className="pt-4 w-full px-10">
              {!isLoggedIn ? (
                <Link
                  to="/auth"
                  className="block w-full text-center py-4 border border-earth-dark no-underline text-earth-dark"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("sign_in")}
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full text-red-800 bg-transparent border-none cursor-pointer font-bold uppercase tracking-[0.2em] py-4"
                >
                  {t("logout")}
                </button>
              )}
            </div>

            {/* MOBILE LANGUAGE TOGGLE */}
            <div className="flex items-center space-x-4 pt-4 text-[10px] font-sans font-bold text-earth-dark/50 tracking-widest border-t border-sand w-[50%] justify-center">
              <button
                onClick={() => {
                  changeLanguage("en");
                  setIsMobileMenuOpen(false);
                }}
                className={`bg-transparent border-none cursor-pointer ${i18n.language === "en" ? "text-earth-dark" : ""}`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  changeLanguage("hy");
                  setIsMobileMenuOpen(false);
                }}
                className={`bg-transparent border-none cursor-pointer ${i18n.language === "hy" ? "text-earth-dark" : ""}`}
              >
                HY
              </button>
              <button
                onClick={() => {
                  changeLanguage("ru");
                  setIsMobileMenuOpen(false);
                }}
                className={`bg-transparent border-none cursor-pointer ${i18n.language === "ru" ? "text-earth-dark" : ""}`}
              >
                RU
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- CART DRAWER UI --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-earth-dark/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-[#FDFCF0] h-full shadow-2xl flex flex-col font-serif animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-sand flex justify-between items-center bg-white/30">
              <h2 className="text-3xl text-earth-dark italic">Your Order</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-earth-dark hover:text-earth-light bg-transparent cursor-pointer text-xl border-none transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              {cart.length === 0 ? (
                <div className="text-center py-32">
                  <i className="fas fa-shopping-basket text-4xl text-sand mb-4"></i>
                  <p className="text-gray-400 italic font-serif text-lg">
                    Your basket is empty.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b border-sand/50 pb-6"
                    >
                      <div>
                        <h4 className="text-xl text-earth-dark">{item.name}</h4>
                        <p className="text-xs font-sans uppercase tracking-widest text-earth-medium mt-1">
                          ${item.price}
                        </p>
                      </div>
                      <div className="flex items-center border border-earth-dark/30 rounded-sm overflow-hidden">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="px-4 py-2 bg-transparent hover:bg-sand/30 cursor-pointer border-none transition-colors text-earth-dark"
                        >
                          <i className="fas fa-minus text-[10px]"></i>
                        </button>
                        <span className="px-4 text-sm font-sans font-bold text-earth-dark">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 bg-transparent hover:bg-sand/30 cursor-pointer border-none transition-colors text-earth-dark"
                        >
                          <i className="fas fa-plus text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-8 border-t border-sand bg-white/50">
                <div className="flex justify-between items-end mb-8">
                  <span className="uppercase tracking-[0.2em] text-[10px] font-sans font-bold text-gray-400">
                    Subtotal
                  </span>
                  <span className="text-4xl text-earth-dark font-light tracking-tighter">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckoutNavigation}
                  className="w-full py-5 bg-earth-dark text-cream hover:bg-earth-medium transition-colors uppercase tracking-[0.3em] text-xs font-sans font-bold cursor-pointer border-none shadow-xl"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
