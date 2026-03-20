import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useTranslation } from "react-i18next";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
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

  // 🎯 USER STATE (Now strictly using sessionStorage)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

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
    const syncData = () => {
      if (!isLoggedIn) {
        setNotifications([]);
        setUser(null);
        return;
      }
      try {
        const savedUser = sessionStorage.getItem("user"); // 🎯 SECURE
        const storedNotes = localStorage.getItem("notifications");

        if (savedUser) setUser(JSON.parse(savedUser));
        if (storedNotes) setNotifications(JSON.parse(storedNotes));
      } catch (e) {
        console.error("Navbar Sync Error", e);
      }
    };

    syncData();
    window.addEventListener("update-notifications", syncData);
    window.addEventListener("storage", syncData);

    return () => {
      window.removeEventListener("update-notifications", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, [isLoggedIn]);

  const isAdmin = user?.email === "lana.shirzad@gmail.com";

  const clearNotifications = () => {
    localStorage.setItem("notifications", JSON.stringify([]));
    setNotifications([]);
    setIsNotificationOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.clear(); // 🎯 SECURE: Wipes session memory
    localStorage.clear(); // Clears remaining local data like cart/notes
    if (setIsLoggedIn) setIsLoggedIn(false);
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleCheckoutNavigation = () => {
    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/checkout");
  };

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
              <span className="text-earth-medium text-[8px] md:text-[10px] tracking-[0.3em] uppercase font-sans -mt-1">
                {t("organic_kitchen")}
              </span>
            </div>
          </Link>

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

            {!isLoggedIn ? (
              <Link
                to="/auth"
                className="text-earth-dark border border-earth-dark/40 px-4 py-2 no-underline hover:bg-earth-dark hover:text-cream transition-all"
              >
                {t("sign_in") || "SIGN IN"}
              </Link>
            ) : (
              <div className="flex items-center border-l border-earth-dark/20 pl-8 gap-6">
                {!isAdmin && (
                  <>
                    <div className="flex flex-col items-end">
                      <span className="text-[7px] text-earth-medium opacity-60 tracking-[0.2em] uppercase font-sans">
                        {t("wallet") || "Wallet"}
                      </span>
                      <span className="text-earth-dark font-sans font-bold text-[12px] mt-[-2px]">
                        ${user?.walletBalance?.toFixed(2) || "0.00"}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 group no-underline"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-earth-dark/20 transition-transform group-hover:scale-110">
                        {user?.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-sand/50 flex items-center justify-center text-[10px] font-sans font-bold text-earth-dark uppercase">
                            {user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-red-800 hover:text-red-600 font-bold no-underline flex items-center gap-2"
                  >
                    <i className="fas fa-lock text-xs"></i>{" "}
                    {t("admin_panel") || "ADMIN PANEL"}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-transparent border-none text-red-800/60 hover:text-red-800 cursor-pointer text-[10px] uppercase font-bold tracking-widest transition-colors ml-2"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i>{" "}
                  {t("logout") || "Sign Out"}
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-5 md:space-x-6 z-50">
            <div className="hidden md:flex items-center space-x-2 text-[9px] font-sans font-bold text-earth-dark/50 tracking-widest">
              <button
                onClick={() => changeLanguage("en")}
                className={`bg-transparent border-none cursor-pointer ${i18n.language === "en" ? "text-earth-dark" : "hover:text-earth-dark"}`}
              >
                EN
              </button>
              <span>|</span>
              <button
                onClick={() => changeLanguage("hy")}
                className={`bg-transparent border-none cursor-pointer ${i18n.language === "hy" ? "text-earth-dark" : "hover:text-earth-dark"}`}
              >
                HY
              </button>
              <span>|</span>
              <button
                onClick={() => changeLanguage("ru")}
                className={`bg-transparent border-none cursor-pointer ${i18n.language === "ru" ? "text-earth-dark" : "hover:text-earth-dark"}`}
              >
                RU
              </button>
            </div>

            {isLoggedIn && (
              <div className="relative">
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
                  <div className="absolute right-[-40px] md:right-0 mt-6 w-[85vw] max-w-[320px] md:w-80 bg-[#FDFCF0]/95 backdrop-blur-xl border border-sand shadow-2xl p-0 z-50 rounded-sm overflow-hidden">
                    <div className="p-4 border-b border-sand flex justify-between items-center bg-white/60">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-earth-medium">
                        {t("notifications.title")}
                      </h4>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-[9px] text-gray-400 bg-transparent cursor-pointer hover:text-red-800 uppercase font-bold tracking-widest border-none"
                        >
                          {t("notifications.clear_all")}
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
                            <p className="text-[10px] font-bold uppercase tracking-widest text-earth-dark mb-1">
                              {note.title}
                            </p>
                            <p className="text-xs italic text-earth-medium font-serif">
                              {note.message}
                            </p>
                            <p className="text-[8px] uppercase text-gray-400 mt-2 tracking-widest font-sans">
                              {note.date}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center text-gray-400 italic text-xs">
                          {t("notifications.empty")}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

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

            <button
              className="md:hidden text-earth-dark text-xl bg-transparent cursor-pointer border-none ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i
                className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}
              ></i>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden absolute top-full left-0 w-full bg-[#FDFCF0] transition-all duration-300 overflow-hidden shadow-lg ${isMobileMenuOpen ? "max-h-screen opacity-100 py-10" : "max-h-0 opacity-0"}`}
        >
          <div className="flex flex-col items-center space-y-8 uppercase tracking-[0.2em] text-xs font-sans font-bold text-earth-dark">
            {isLoggedIn && !isAdmin && (
              <>
                <div className="flex flex-col items-center bg-sand/20 px-10 py-4 rounded-sm">
                  <span className="text-[8px] opacity-50 mb-1 tracking-widest">
                    {t("wallet_balance") || "WALLET BALANCE"}
                  </span>
                  <span className="text-xl italic">
                    ${user?.walletBalance?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 no-underline text-earth-dark"
                >
                  <i className="fas fa-user-circle"></i> {t("dashboard")}
                </Link>
              </>
            )}

            {isLoggedIn && isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-red-800 flex items-center gap-2 no-underline font-bold"
              >
                <i className="fas fa-lock"></i>{" "}
                {t("admin_panel") || "ADMIN PANEL"}
              </Link>
            )}

            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
              {t("our_story")}
            </Link>
            <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)}>
              {t("menu")}
            </Link>
            <Link to="/reservation" onClick={() => setIsMobileMenuOpen(false)}>
              {t("book_table")}
            </Link>

            <div className="pt-4 w-full px-10 text-center">
              {!isLoggedIn ? (
                <Link
                  to="/auth"
                  className="block w-full py-4 border border-earth-dark no-underline text-earth-dark"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("sign_up")}
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
          </div>
        </div>
      </nav>

      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-earth-dark/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-[#FDFCF0] h-full shadow-2xl flex flex-col font-serif">
            <div className="p-8 border-b border-sand flex justify-between items-center bg-white/30">
              <h2 className="text-3xl text-earth-dark italic">
                {t("cart.your_order")}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-earth-dark bg-transparent border-none cursor-pointer text-xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              {cart.length === 0 ? (
                <div className="text-center py-32 text-gray-400 italic text-lg">
                  {t("cart.empty")}
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b border-sand/50 pb-6"
                    >
                      <div>
                        <h4 className="text-xl text-earth-dark">
                          {t(item.name)}
                        </h4>
                        <p className="text-xs font-sans uppercase tracking-widest text-earth-medium">
                          ${item.price}
                        </p>
                      </div>
                      <div className="flex items-center border border-earth-dark/30 rounded-sm">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="px-4 py-2 bg-transparent border-none cursor-pointer text-earth-dark"
                        >
                          <i className="fas fa-minus text-[10px]"></i>
                        </button>
                        <span className="px-4 text-sm font-sans font-bold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 bg-transparent border-none cursor-pointer text-earth-dark"
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
                  <span className="uppercase text-[10px] font-sans font-bold text-gray-400">
                    {t("cart.subtotal")}
                  </span>
                  <span className="text-4xl text-earth-dark font-light">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckoutNavigation}
                  className="w-full py-5 bg-earth-dark text-cream uppercase tracking-[0.3em] text-xs font-sans font-bold cursor-pointer border-none shadow-xl"
                >
                  {t("cart.proceed_checkout")}
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
