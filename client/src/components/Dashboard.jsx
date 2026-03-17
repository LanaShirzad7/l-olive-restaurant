import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // 🎯 Added

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // 🎯 Added i18n to detect current language
  const fileInputRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : { name: "Guest", email: "", profilePic: "" };
  });

  const [reservations, setReservations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [loading, setLoading] = useState(false);
  const [loadingRes, setLoadingRes] = useState(true);

  useEffect(() => {
    setNewName(user.name || "");
  }, [user.name]);

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
  }, [user.email]);

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
    const confirmed = window.confirm(t("release_confirm")); // 🎯 Translated
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
          title: t("res_cancelled"), // 🎯 Translated
          message: t("res_released_msg", { date }), // 🎯 Translated
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
    <div className="bg-cream min-h-screen pt-40 pb-20 px-6 font-serif">
      <div className="max-w-5xl mx-auto">
        {/* HEADER SECTION */}
        <header className="mb-16 flex flex-col md:flex-row items-center gap-8 border-b border-sand pb-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-sand shadow-xl bg-white flex items-center justify-center">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <span className="text-4xl text-earth-medium font-sans font-bold uppercase">
                  {user.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <button
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 bg-earth-dark text-cream w-10 h-10 rounded-full flex items-center justify-center border-4 border-cream cursor-pointer hover:bg-earth-medium transition-colors shadow-lg"
            >
              <i className="fas fa-camera text-xs"></i>
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
                  className="bg-transparent border-b-2 border-earth-dark text-4xl italic outline-none text-earth-dark w-full max-w-md font-serif"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateName}
                    disabled={loading}
                    className="bg-earth-dark text-cream px-8 py-2 text-[10px] uppercase font-bold tracking-widest cursor-pointer border-none shadow-lg"
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
                <h1 className="text-6xl text-earth-dark italic leading-tight">
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

        {/* RESERVATIONS SECTION */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-8 border-b border-sand pb-4">
            <h2 className="text-3xl text-earth-dark italic">
              {t("res_history")}
            </h2>
            <span className="text-[10px] uppercase tracking-widest text-earth-medium font-sans font-bold">
              {t("archive")}
            </span>
          </div>

          {loadingRes ? (
            /* Luxury Skeleton Loader remains as is for visual consistency */
            <div className="grid grid-cols-1 gap-6">
              {[1, 2].map((skel) => (
                <div
                  key={skel}
                  className="bg-white/40 p-8 border border-sand flex flex-col md:flex-row justify-between items-center animate-pulse"
                >
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className="border-r border-sand pr-8">
                      <div className="h-3 w-12 bg-sand/80 rounded mb-2"></div>
                      <div className="h-8 w-10 bg-sand/80 rounded"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-5 w-48 bg-sand/80 rounded"></div>
                      <div className="h-3 w-32 bg-sand/60 rounded"></div>
                    </div>
                  </div>
                  <div className="mt-6 md:mt-0 w-24 h-8 bg-sand/80 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : reservations.length === 0 ? (
            <div className="py-24 bg-white/30 border border-dashed border-sand text-center">
              <p className="text-gray-400 italic mb-6">{t("no_res_msg")}</p>
              <Link
                to="/reservation"
                className="inline-block px-8 py-3 bg-earth-dark text-cream text-[10px] uppercase font-bold tracking-[0.2em] no-underline"
              >
                {t("book_first_table")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {reservations.map((res) => (
                <div
                  key={res._id}
                  className="bg-white/60 backdrop-blur-sm p-8 border border-sand flex flex-col md:flex-row justify-between items-center group transition-all shadow-sm"
                >
                  <div className="flex items-center gap-8">
                    <div className="text-center border-r border-sand pr-8 min-w-[100px]">
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
                      <p className="text-3xl text-earth-dark font-sans leading-none">
                        {res.date ? new Date(res.date).getDate() : "--"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl text-earth-dark italic mb-1">
                        {res.time} — {res.guests} Guests
                      </h4>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans">
                        {/* Translate area name if it exists in i18n, else use fallback */}
                        {t(res.area?.toLowerCase().replace(/\s+/g, "_")) ||
                          res.area ||
                          "Main Sanctuary"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0 flex items-center gap-8">
                    <span
                      className={`text-[9px] uppercase tracking-[0.3em] font-bold px-5 py-2 rounded-full border ${
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
                        className="text-[10px] uppercase tracking-widest font-bold text-red-800/40 hover:text-red-800 bg-transparent border-none cursor-pointer"
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

        {/* POINTS CARD */}
        <section className="p-10 bg-earth-dark text-cream flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="uppercase tracking-[0.4em] text-[10px] font-bold text-cream/40 mb-4">
              {t("harvest_points")}
            </h3>
            <p className="text-6xl font-sans font-light tracking-tighter">
              2,000
            </p>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="relative z-10 px-10 py-4 bg-cream text-earth-dark text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-sand transition-all border-none cursor-pointer"
          >
            {t("redeem")}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
