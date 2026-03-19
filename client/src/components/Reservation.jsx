import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Reservation = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Use the environment variable for the API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

  const times = [
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM",
  ];

  const [formData, setFormData] = useState({
    adults: 2,
    children: 0,
    date: "",
    time: "7:00 PM",
    area: "Main Dining Room",
    specialRequest: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setMessage(t("sign_in_required"));
      setLoading(false);
      setTimeout(() => navigate("/auth"), 2000);
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      // DYNAMIC URL: Works on localhost and Vercel!
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id || user._id,
          userEmail: user.email,
          userName: user.name,
          date: formData.date,
          time: formData.time,
          guests: Number(formData.adults) + Number(formData.children),
          area: formData.area,
          specialRequest: formData.specialRequest,
        }),
      });

      // Handle "Unexpected token S" errors (Server crashes)
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.message || t("server_error"));
        } else {
          // This catches the "Server Error" HTML page
          throw new Error(
            "The server is currently sleepy. Please try again in a moment.",
          );
        }
      }

      const result = await response.json();
      console.log("Reservation successful:", result);

      // Notification Logic
      const existingNotes = JSON.parse(
        localStorage.getItem("notifications") || "[]",
      );
      const newBookingNote = {
        title: t("res_received"),
        message: t("res_pending_msg", {
          date: formData.date,
          time: formData.time,
        }),
        date: new Date().toLocaleString(),
      };
      localStorage.setItem(
        "notifications",
        JSON.stringify([newBookingNote, ...existingNotes]),
      );
      window.dispatchEvent(new Event("update-notifications"));

      setMessage(t("res_success_msg"));
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (error) {
      console.error("Reservation Error:", error.message);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 font-serif bg-gradient-to-b from-[#71824F]/20 to-[#FDFCF0] flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden rounded-sm">
        {/* LEFT SIDE: IMAGE & CONTACT */}
        <div className="md:w-5/12 relative min-h-[400px]">
          <img
            src="/reserve.jpg"
            alt="Restaurant Atmosphere"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-10 left-10 text-white space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold opacity-80">
              {t("contact_us")}
            </p>
            <p className="text-[13px] uppercase tracking-widest leading-loose opacity-70">
              +374 55239909
            </p>
            <p className="text-[10px] uppercase tracking-widest leading-loose opacity-70">
              Komitas, Nikoghayos Tigranyan 10, Yerevan
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[10px] uppercase border-b border-white/40 pb-1 mt-4 tracking-widest hover:text-[#C5A28E] transition-colors"
            >
              {t("show_maps")}
            </a>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="md:w-7/12 p-8 md:p-16 bg-[#FDFCF0] flex flex-col justify-center">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-earth-medium mb-2 font-sans font-bold">
              {t("excellence")}
            </p>
            <h2 className="text-5xl text-earth-dark italic">
              {t("reserve_title")}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="border-b border-sand pb-2">
                <label className="block text-[10px] uppercase tracking-widest text-earth-medium mb-1 font-sans font-bold">
                  {t("adults")}
                </label>
                <input
                  type="number"
                  name="adults"
                  min="1"
                  value={formData.adults}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-earth-dark font-serif italic text-base"
                />
              </div>
              <div className="border-b border-sand pb-2">
                <label className="block text-[10px] uppercase tracking-widest text-earth-medium mb-1 font-sans font-bold">
                  {t("children")}
                </label>
                <input
                  type="number"
                  name="children"
                  min="0"
                  value={formData.children}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-earth-dark font-serif italic text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border-b border-sand pb-2">
                <label className="block text-[10px] uppercase tracking-widest text-earth-medium mb-1 font-sans font-bold">
                  {t("booking_date")}
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  // 🎯 CHANGED: Replaced font-sans text-sm with font-serif italic text-base
                  className="w-full bg-transparent outline-none text-earth-dark font-serif italic text-base cursor-pointer"
                />
              </div>
              <div className="border-b border-sand pb-2">
                <label className="block text-[10px] uppercase tracking-widest text-earth-medium mb-1 font-sans font-bold">
                  {t("time")}
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  // 🎯 CHANGED: Replaced font-sans text-sm with font-serif italic text-base
                  className="w-full bg-transparent outline-none text-earth-dark font-serif italic text-base cursor-pointer"
                >
                  {times.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-b border-sand pb-2">
              <label className="block text-[10px] uppercase tracking-widest text-earth-medium mb-1 font-sans font-bold">
                {t("area_pref")}
              </label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                // 🎯 CHANGED: Replaced font-sans text-sm with font-serif italic text-base
                className="w-full bg-transparent outline-none text-earth-dark font-serif italic text-base cursor-pointer"
              >
                <option value="Main Dining Room">{t("Main Dining")}</option>
                <option value="Terrace (Outdoor)">{t("Terrace")}</option>
                <option value="Chef's Table">{t("Chef's Table")}</option>
                <option value="Private Vault">{t("Private Vault")}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-earth-medium mb-2 font-sans font-bold">
                {t("special_requests")}
              </label>
              <textarea
                name="specialRequest"
                value={formData.specialRequest}
                onChange={handleChange}
                placeholder={t("placeholder_reserve")}
                className="w-full h-24 p-4 bg-white/40 border border-sand outline-none focus:border-earth-dark transition-colors italic text-sm resize-none"
              ></textarea>
            </div>

            {message && (
              <p
                className={`text-xs italic text-center animate-pulse ${message.includes("try again") || message.includes("error") ? "text-red-600" : "text-earth-dark"}`}
              >
                {message}
              </p>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-4 bg-earth-dark text-white uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-earth-medium transition-all shadow-xl disabled:opacity-50 cursor-pointer"
              >
                {loading ? t("confirming") : t("btn_reserve")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
