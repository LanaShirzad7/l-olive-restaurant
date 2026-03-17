import { useEffect, useRef } from "react"; // 🎯 Added useRef and useEffect
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null); // 🎯 Create a reference to the video

  // 🎯 This "forces" the video to play and stay muted on mobile
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented by browser:", error);
      });
    }
  }, []);

  return (
    <div className="relative font-serif bg-cream min-h-screen">
      {/* 1. Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef} // 🎯 Attach the reference here
            src="/IMG_2902.mp4"
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controls={false} // 🎯 Explicitly tell React NO controls
            className="w-full h-full object-cover pointer-events-none" // 🎯 pointer-events-none stops clicks from showing controls
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-cream">
          <p className="uppercase tracking-[0.3em] mb-4 text-sm font-sans font-medium">
            {t("est")}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 italic drop-shadow-lg">
            {t("real_food")} <br /> {t("real_soul")}
          </h1>
          <Link
            to="/menu"
            className="inline-block px-8 py-3 border-2 border-cream text-cream hover:bg-cream hover:text-earth-dark transition-all duration-300 uppercase tracking-widest text-xs font-sans font-semibold no-underline"
          >
            {t("explore_menu")}
          </Link>
        </div>
      </header>

      {/* 2. Manifesto Section */}
      <section className="py-20 md:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-earth-medium/20 z-0"></div>
              <img
                src="/home.avif"
                alt="Chef"
                className="relative z-10 w-full h-auto shadow-xl hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="text-center md:text-left">
              <span className="text-earth-medium uppercase tracking-widest text-xs font-sans font-bold mb-2 block">
                {t("our_philosophy")}
              </span>
              <h2 className="text-4xl md:text-5xl mb-8 text-earth-dark font-normal">
                {t("soil_to_soul")}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed font-light">
                {t("manifesto_desc")}
              </p>
              <Link
                to="/about"
                className="inline-block mt-4 border-b border-earth-dark pb-1 text-earth-dark hover:text-earth-light uppercase tracking-widest text-[10px] font-sans font-bold transition-colors no-underline"
              >
                {t("read_story")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quote Section */}
      <section
        className="relative py-40 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854')",
        }}
      >
        <div className="absolute inset-0 bg-earth-dark/75"></div>
        <div className="relative z-10 container mx-auto px-4 text-center text-cream">
          <blockquote className="text-3xl md:text-6xl italic leading-tight max-w-5xl mx-auto mb-8 font-light">
            {t("quote_text")}
          </blockquote>
          <cite className="text-cream/60 uppercase tracking-[0.4em] text-[10px] font-sans font-bold not-italic">
            {t("quote_author")}
          </cite>
        </div>
      </section>

      {/* 4. Membership Section */}
      <section className="py-32 bg-[#FDFCF0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-earth-medium uppercase tracking-[0.3em] text-[10px] font-sans font-bold mb-4 block">
                {t("membership")}
              </span>
              <h2 className="text-5xl md:text-6xl text-earth-dark italic mb-8 leading-tight">
                {t("lolive_circle")}
              </h2>
              <p className="text-gray-600 text-lg mb-10 font-light leading-relaxed">
                {t("circle_desc")}
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex gap-6">
                  <span className="text-earth-medium font-serif italic text-2xl">
                    01
                  </span>
                  <div>
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-earth-dark mb-1 font-sans">
                      {t("benefit_1_title")}
                    </h4>
                    <p className="text-sm text-gray-500 italic">
                      {t("benefit_1_desc")}
                    </p>
                  </div>
                </div>
                {/* ... other benefits ... */}
              </div>

              <Link
                to="/auth"
                className="inline-block px-12 py-5 bg-earth-dark text-cream uppercase tracking-[0.2em] text-[10px] font-sans font-bold hover:bg-earth-medium transition-all shadow-xl no-underline"
              >
                {t("enter_sanctuary")}
              </Link>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-earth-medium/10 blur-[100px] rounded-full"></div>
              <div className="relative bg-earth-dark p-12 rounded-sm shadow-2xl text-cream overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl italic select-none">
                  O
                </div>
                <div className="relative z-10 space-y-20">
                  <div className="flex justify-between items-start">
                    <div className="border border-cream/30 px-3 py-1 rounded-full">
                      <p className="text-[8px] uppercase tracking-widest">
                        {t("premium_member")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-2 font-sans">
                      {t("collector_points")}
                    </p>
                    <h3 className="text-5xl font-light italic">
                      {t("lolive_circle")}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
