import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Reservation = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reservations`,
        {
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
        },
      );

      if (response.ok) {
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
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || t("server_error"));
      }
    } catch (error) {
      console.error("Reservation Error:", error);
      setMessage(t("server_error"));
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
        {/* --- LEFT SIDE: IMAGE & CONTACT --- */}
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
              Komitas,
              <br />
              Nikoghayos Tigranyan 10, Yerevan
            </p>
            <a
              href="https://maps.app.goo.gl/jPYdbr1DGRbcjcbG6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[10px] uppercase border-b border-white/40 pb-1 mt-4 tracking-widest hover:text-sand transition-colors"
            >
              {t("show_maps")}
            </a>
          </div>
        </div>

        {/* --- RIGHT SIDE: RESERVATION FORM --- */}
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
            {/* Guest Breakdown */}
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
                  className="w-full bg-transparent outline-none text-earth-dark focus:text-earth-medium transition-colors"
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
                  className="w-full bg-transparent outline-none text-earth-dark focus:text-earth-medium transition-colors"
                />
              </div>
            </div>

            {/* Date & Time */}
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
                  className="w-full bg-transparent outline-none text-earth-dark font-sans text-sm cursor-pointer"
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
                  className="w-full bg-transparent outline-none text-earth-dark font-sans text-sm cursor-pointer"
                >
                  {times.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dining Area */}
            <div className="border-b border-sand pb-2">
              <label className="block text-[10px] uppercase tracking-widest text-earth-medium mb-1 font-sans font-bold">
                {t("area_pref")}
              </label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-earth-dark font-sans text-sm cursor-pointer"
              >
                <option value="Main Dining Room">{t("main_dining")}</option>
                <option value="Terrace (Outdoor)">{t("terrace")}</option>
                <option value="Chef's Table">{t("chef_table")}</option>
                <option value="Private Vault">{t("vault")}</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-earth-medium mb-2 font-sans font-bold">
                {t("special_requests")}
              </label>
              <textarea
                name="specialRequest"
                value={formData.specialRequest}
                onChange={handleChange}
                placeholder={t("placeholder_reserve")}
                className="w-full h-24 p-4 bg-white/40 border border-sand outline-none focus:border-earth-dark transition-colors italic text-sm resize-none placeholder:text-gray-300"
              ></textarea>
            </div>

            {/* Feedback Message */}
            {message && (
              <p
                className={`text-xs italic text-center animate-pulse ${
                  message.includes("error") || message.includes("Failed")
                    ? "text-red-600"
                    : "text-earth-dark"
                }`}
              >
                {message}
              </p>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-4 bg-earth-dark text-white uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-earth-medium transition-all shadow-xl disabled:opacity-50 cursor-pointer border-none"
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
