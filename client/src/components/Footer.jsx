import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState(null);

  const googleMapsUrl = "https://maps.app.goo.gl/CJ7C7mTNqC3Fkj2C8";

  const legalContent = {
    privacy: {
      title: t("privacy"),
      text: "At L'Olive, we respect your sanctuary. We collect your name, email, and phone number only to facilitate reservations and manage your loyalty points. Your data is never shared with third parties.",
    },
    terms: {
      title: t("terms"),
      text: "Reservations are held for 15 minutes. Prime memberships ($5/month) provide daily alternating discounts. Loyalty points are calculated on the subtotal.",
    },
  };

  const closeModal = () => setActiveModal(null);

  return (
    <footer className="bg-[#3D4828] text-[#F5F5DC] pt-24 pb-12 px-8 font-sans relative overflow-hidden">
      {/* Decorative "O" Watermark */}
      <div className="absolute top-[-10%] right-[-5%] text-[300px] text-white/5 font-serif italic pointer-events-none select-none">
        O
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-[#F5F5DC]/10 pb-20">
        {/* 1. BRAND & STORY */}
        <div className="md:col-span-1 space-y-8">
          <Link
            to="/"
            className="no-underline block group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="font-serif text-4xl tracking-tighter text-[#F5F5DC]">
              L'OLIVE
            </span>
            <span className="text-[#F5F5DC]/50 text-[9px] block tracking-[0.4em] uppercase mt-1">
              {t("organic_kitchen")}
            </span>
          </Link>
          <p className="text-[#F5F5DC]/70 text-xs leading-loose italic max-w-xs">
            "A culinary sanctuary where the harvest of the Mediterranean meets
            the art of slow living."
          </p>
        </div>

        {/* 2. VISIT US */}
        <div className="space-y-6">
          <h4 className="uppercase tracking-[0.3em] text-[10px] font-black text-[#F5F5DC]/90">
            {t("contact_us")}
          </h4>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block space-y-4 text-[11px] tracking-wide text-[#F5F5DC]/70 leading-relaxed no-underline cursor-pointer group/address"
          >
            <p className="group-hover/address:text-white transition-colors border-b border-transparent group-hover/address:border-[#F5F5DC]/20 pb-1 w-fit">
              Nikoghayos Tigranyan 10
              <br />
              Yerevan, Armenia
            </p>
          </a>
        </div>

        {/* 3. JOURNEY (Socials) */}
        <div className="space-y-6">
          <h4 className="uppercase tracking-[0.3em] text-[10px] font-black text-[#F5F5DC]/90">
            {t("follow_harvest")}
          </h4>
          <div className="flex flex-col space-y-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 no-underline"
            >
              <span className="w-8 h-[1px] bg-[#F5F5DC]/20 group-hover:w-12 group-hover:bg-[#F5F5DC] transition-all"></span>
              <span className="text-[10px] uppercase tracking-widest text-[#F5F5DC]/70 group-hover:text-white transition-colors">
                Instagram
              </span>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 no-underline"
            >
              <span className="w-8 h-[1px] bg-[#F5F5DC]/20 group-hover:w-12 group-hover:bg-[#F5F5DC] transition-all"></span>
              <span className="text-[10px] uppercase tracking-widest text-[#F5F5DC]/70 group-hover:text-white transition-colors">
                Facebook
              </span>
            </a>
          </div>
        </div>

        {/* 4. NEWSLETTER */}
        <div className="space-y-6">
          <h4 className="uppercase tracking-[0.3em] text-[10px] font-black text-[#F5F5DC]/90">
            {t("newsletter")}
          </h4>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Welcome to the Circle.");
            }}
          >
            <input
              type="email"
              required
              placeholder={t("email_addr")}
              className="w-full bg-transparent border-b border-[#F5F5DC]/20 py-3 text-xs text-[#F5F5DC] focus:outline-none focus:border-[#FDFCF0]/60 transition-all placeholder:text-[#F5F5DC]/30"
            />
            <button className="w-full bg-[#FDFCF0] text-[#3D4828] py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all cursor-pointer shadow-lg border-none">
              {t("join_circle")}
            </button>
          </form>
        </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="max-w-7xl mx-auto pt-12 flex flex-col md:flex-row justify-between items-center text-[#F5F5DC]/30 text-[9px] font-bold tracking-[0.3em]">
        <p>
          © 2026 L'OLIVE {t("organic_kitchen")}. {t("all_rights")}.
        </p>
        <div className="flex space-x-10">
          <button
            onClick={() => setActiveModal("privacy")}
            className="bg-transparent border-none text-inherit hover:text-white cursor-pointer uppercase transition-colors"
          >
            {t("privacy")}
          </button>
          <button
            onClick={() => setActiveModal("terms")}
            className="bg-transparent border-none text-inherit hover:text-white cursor-pointer uppercase transition-colors"
          >
            {t("terms")}
          </button>
        </div>
      </div>

      {/* --- LEGAL MODAL --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-[#3D4828]/80 backdrop-blur-md"
            onClick={closeModal}
          ></div>
          <div className="relative bg-[#FDFCF0] w-full max-w-lg p-12 shadow-2xl border border-[#D4D3AC] rounded-sm animate-in fade-in zoom-in duration-300">
            <button
              onClick={closeModal}
              className="absolute top-6 right-8 text-[#3D4828] bg-transparent border-none cursor-pointer text-2xl font-light"
            >
              ×
            </button>
            <h3 className="font-serif text-3xl text-[#3D4828] italic mb-6 border-b border-[#D4D3AC] pb-4">
              {legalContent[activeModal].title}
            </h3>
            <p className="text-[#3D4828]/80 text-sm leading-loose italic mb-10">
              {legalContent[activeModal].text}
            </p>
            <button
              onClick={closeModal}
              className="w-full py-5 bg-[#3D4828] text-[#F5F5DC] uppercase tracking-[0.3em] text-[10px] font-bold border-none cursor-pointer hover:bg-[#4a5732] transition-colors"
            >
              {t("understood")}
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
