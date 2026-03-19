import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);

  // 🎯 Production-ready API URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: "Guest",
          email: "",
          profilePic: "",
          points: 0,
          walletBalance: 0,
        };
  });

  const [reservations, setReservations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [loading, setLoading] = useState(false);
  const [loadingRes, setLoadingRes] = useState(true);

  useEffect(() => {
    setNewName(user.name || "");
  }, [user.name]);

  // 🎯 NEW: Handle Redeeming Points to Wallet Cash
  const handleRedeem = async () => {
    if (user.points < 100) {
      alert(
        t("minimum_points_required") ||
          "Minimum 100 points required to redeem.",
      );
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/auth/redeem-points`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id || user._id }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state and storage
        const updatedUser = {
          ...user,
          points: data.points,
          walletBalance: data.walletBalance,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event("storage")); // Sync Navbar
        alert(t("redeem_success") || "Points converted to Wallet Balance!");
      } else {
        alert(data.msg || "Redemption failed");
      }
    } catch (err) {
      console.error("Redeem Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user.email) {
          setLoadingRes(false);
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}/api/reservations/my-reservations?email=${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await res.json();
        if (res.ok) {
          setReservations(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Archive fetch failed:", err);
      }
      setTimeout(() => {
        setLoadingRes(false);
      }, 800);
    };

    fetchMyReservations();
  }, [user.email, API_BASE_URL]);

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.name) {
      return setIsEditing(false);
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName.trim(),
          email: user.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = {
          ...user,
          name: data.user?.name || newName.trim(),
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.error("Update Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id, date) => {
    const confirmed = window.confirm(t("release_confirm"));
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r._id !== id));
        const existingNotes = JSON.parse(
          localStorage.getItem("notifications") || "[]",
        );
        const newNote = {
          title: t("res_cancelled"),
          message: t("res_released_msg", { date }),
          date: new Date().toLocaleString(),
        };
        localStorage.setItem(
          "notifications",
          JSON.stringify([newNote, ...existingNotes]),
        );
        window.dispatchEvent(new Event("update-notifications"));
      }
    } catch (err) {
      console.error("Cancellation failed", err);
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result;
      const updatedUser = { ...user, profilePic: base64String };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event("storage"));
    };
  };

  return (
    <div className="bg-cream min-h-screen pt-24 md:pt-40 pb-20 px-4 md:px-6 font-serif overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        {/* HEADER SECTION - FIXED FOR MOBILE */}
        <header className="mb-12 flex flex-col md:flex-row items-center gap-6 md:gap-8 border-b border-sand pb-10 md:pb-12">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-sand shadow-xl bg-white flex items-center justify-center">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <span className="text-3xl md:text-4xl text-earth-medium font-sans font-bold uppercase">
                  {user.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <button
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 bg-earth-dark text-cream w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 border-cream cursor-pointer hover:bg-earth-medium transition-colors shadow-lg"
            >
              <i className="fas fa-camera text-[10px]"></i>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] text-earth-medium uppercase tracking-[0.4em] font-sans font-bold mb-2">
              {t("member_sanctuary")}
            </p>

            {isEditing ? (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-transparent border-b-2 border-earth-dark text-3xl md:text-4xl italic outline-none text-earth-dark w-full max-w-md font-serif"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateName}
                    disabled={loading}
                    className="bg-earth-dark text-cream px-6 py-2 text-[10px] uppercase font-bold tracking-widest cursor-pointer border-none shadow-lg"
                  >
                    {loading ? "..." : t("save")}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-transparent border border-sand text-earth-medium px-4 py-2 text-[10px] uppercase font-bold cursor-pointer"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center md:justify-start gap-4 group">
                <h1 className="text-4xl md:text-6xl text-earth-dark italic leading-tight break-words max-w-full">
                  {user.name}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-earth-medium hover:text-earth-dark cursor-pointer bg-transparent border-none p-2"
                >
                  <i className="fas fa-pencil-alt text-sm"></i>
                </button>
              </div>
            )}
            <p className="text-xs text-gray-400 italic mt-2 tracking-wide">
              {user.email}
            </p>
          </div>
        </header>

        {/* 🎯 WALLET & POINTS SECTION - NEW COMPACT LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Harvest Points Card */}
          <section className="p-8 md:p-10 bg-earth-dark text-cream flex flex-col justify-between shadow-2xl relative overflow-hidden rounded-sm">
            <div className="relative z-10">
              <h3 className="uppercase tracking-[0.4em] text-[10px] font-bold text-cream/40 mb-4">
                {t("harvest_points")}
              </h3>
              <p className="text-5xl md:text-6xl font-sans font-light tracking-tighter">
                {user.points?.toLocaleString() || 0}
              </p>
            </div>
            <button
              onClick={handleRedeem}
              disabled={loading || user.points < 100}
              className="relative z-10 mt-8 px-8 py-4 bg-cream text-earth-dark text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-sand transition-all border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : t("redeem_to_wallet")}
            </button>
            <i className="fas fa-leaf absolute right-[-20px] bottom-[-20px] text-9xl opacity-5 rotate-12"></i>
          </section>

          {/* Digital Wallet Card */}
          <section className="p-8 md:p-10 bg-white border border-sand flex flex-col justify-between shadow-xl relative overflow-hidden rounded-sm">
            <div>
              <h3 className="uppercase tracking-[0.4em] text-[10px] font-bold text-earth-medium mb-4">
                {t("digital_wallet") || "DIGITAL WALLET"}
              </h3>
              <p className="text-5xl md:text-6xl font-sans font-light tracking-tighter text-earth-dark">
                ${user.walletBalance?.toFixed(2) || "0.00"}
              </p>
              <p className="mt-4 text-[10px] text-gray-400 italic tracking-wide">
                {t("3_cashback_note") ||
                  "3% Automatic cashback active on all orders"}
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-earth-medium">
              <i className="fas fa-wallet text-sm"></i>
              <span className="text-[10px] uppercase font-bold tracking-widest">
                {t("verified_account") || "VERIFIED"}
              </span>
            </div>
          </section>
        </div>

        {/* RESERVATIONS SECTION - RESPONSIVE CARDS */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-8 border-b border-sand pb-4">
            <h2 className="text-2xl md:text-3xl text-earth-dark italic">
              {t("res_history")}
            </h2>
            <span className="text-[10px] uppercase tracking-widest text-earth-medium font-sans font-bold">
              {t("archive")}
            </span>
          </div>

          {loadingRes ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2].map((skel) => (
                <div
                  key={skel}
                  className="bg-white/40 p-8 border border-sand animate-pulse flex flex-col md:flex-row justify-between"
                >
                  <div className="h-10 w-48 bg-sand/50 rounded"></div>
                  <div className="h-10 w-24 bg-sand/50 rounded mt-4 md:mt-0"></div>
                </div>
              ))}
            </div>
          ) : reservations.length === 0 ? (
            <div className="py-20 bg-white/30 border border-dashed border-sand text-center">
              <p className="text-gray-400 italic mb-6">{t("no_res_msg")}</p>
              <Link
                to="/reservation"
                className="inline-block px-8 py-3 bg-earth-dark text-cream text-[10px] uppercase font-bold tracking-[0.2em] no-underline"
              >
                {t("book_first_table")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {reservations.map((res) => (
                <div
                  key={res._id}
                  className="bg-white/60 backdrop-blur-sm p-6 md:p-8 border border-sand flex flex-col md:flex-row justify-between items-center gap-6 group transition-all shadow-sm"
                >
                  <div className="flex items-center gap-6 md:gap-8 w-full md:w-auto">
                    <div className="text-center border-r border-sand pr-6 md:pr-8 min-w-[70px] md:min-w-[100px]">
                      <p className="text-[10px] uppercase font-bold text-earth-medium tracking-widest mb-1">
                        {res.date
                          ? new Date(res.date).toLocaleDateString(
                              i18n.language === "hy"
                                ? "hy-AM"
                                : i18n.language === "ru"
                                  ? "ru-RU"
                                  : "en-US",
                              { month: "short" },
                            )
                          : "Month"}
                      </p>
                      <p className="text-2xl md:text-3xl text-earth-dark font-sans leading-none">
                        {res.date ? new Date(res.date).getDate() : "--"}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg md:text-xl text-earth-dark italic mb-1">
                        {res.time} — {res.guests} {t("guests") || "Guests"}
                      </h4>
                      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans">
                        {t(res.area?.toLowerCase().replace(/\s+/g, "_")) ||
                          res.area ||
                          "Main Sanctuary"}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 md:gap-8 border-t md:border-t-0 border-sand/30 pt-4 md:pt-0">
                    <span
                      className={`text-[9px] uppercase tracking-[0.3em] font-bold px-4 py-2 rounded-full border ${
                        res.status === "confirmed"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : res.status === "declined"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-orange-50 text-orange-700 border-orange-100"
                      }`}
                    >
                      {t(`status_${res.status || "pending"}`)}
                    </span>
                    {res.status !== "declined" && (
                      <button
                        onClick={() =>
                          handleCancelReservation(res._id, res.date)
                        }
                        className="text-[10px] uppercase tracking-widest font-bold text-red-800/40 hover:text-red-800 bg-transparent border-none cursor-pointer transition-colors"
                      >
                        {t("cancel")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
