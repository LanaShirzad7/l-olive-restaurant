import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-cream min-h-screen pt-32 pb-20 font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="text-earth-medium uppercase tracking-[0.3em] text-xs font-sans font-bold mb-4 block">
            {t("heritage")}
          </span>
          <h1 className="text-5xl md:text-7xl text-earth-dark italic mb-6">
            {t("about_title")}
          </h1>
          <div className="w-24 h-1 bg-earth-medium/30 mx-auto"></div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-earth-medium/10 z-0"></div>
            <img
              src="/cheff.png"
              alt="Our Kitchen Philosophy"
              className="relative z-10 w-full h-500px object-cover shadow-2xl hover:grayscale-0 transition-all duration-700 rounded-sm"
            />
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl text-earth-dark leading-tight italic">
              {t("about_subtitle")}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {t("about_para_1")}
            </p>
            <p className="text-gray-700 leading-relaxed">{t("about_para_2")}</p>

            <div className="pt-6">
              <Link
                to="/menu"
                className="inline-block px-10 py-4 bg-earth-dark text-cream hover:bg-earth-medium transition-all duration-300 uppercase tracking-widest text-xs font-sans font-semibold shadow-lg no-underline"
              >
                {t("taste_philosophy")}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-earth-medium/20 pt-20">
          <div className="text-center">
            <h3 className="text-xl text-earth-dark mb-4 italic">
              {t("pure_origin")}
            </h3>
            <p className="text-gray-600 text-sm">{t("pure_origin_desc")}</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl text-earth-dark mb-4 italic">
              {t("zero_waste")}
            </h3>
            <p className="text-gray-600 text-sm">{t("zero_waste_desc")}</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl text-earth-dark mb-4 italic">
              {t("soulful_craft")}
            </h3>
            <p className="text-gray-600 text-sm">{t("soulful_craft_desc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
