import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);

  // 🎯 Forces the video to play and stay muted on mobile
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
    <div className="relative font-serif bg-cream min-h-screen overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src="/IMG_2902.mp4"
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controls={false}
            className="w-full h-full object-cover pointer-events-none"
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

      {/* 2. MANIFESTO SECTION */}
      <section className="py-20 md:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-earth-medium/20 z-0"></div>
              <img
                src="/home.avif"
                alt="Chef"
                className="relative z-10 w-full h-auto shadow-xl transition-all duration-700"
              />
            </div>
            <div className="text-center md:text-left">
              <span className="text-earth-medium uppercase tracking-widest text-xs font-sans font-bold mb-2 block">
                {t("our_philosophy")}
              </span>
              <h2 className="text-4xl md:text-5xl mb-8 text-earth-dark font-normal leading-tight">
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

      {/* 3. QUOTE SECTION */}
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

      {/* 4. MEMBERSHIP SECTION - FIXED LAYOUT */}
      <section className="py-24 md:py-32 bg-[#FDFCF0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* TEXT CONTENT */}
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

              <div className="space-y-10 mb-12">
                <div className="flex gap-6">
                  <span className="text-earth-medium font-serif italic text-2xl">
                    01
                  </span>
                  <div>
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-earth-dark mb-1 font-sans">
                      {t("The Harvest Collection")}
                    </h4>
                    <p className="text-sm text-gray-500 italic">
                      {t(
                        "Every visit to our sanctuary is an investment in your well-being. Earn 100 Harvest Points for every $1 spent, allowing you to cultivate rewards that nourish your future dining experiences.",
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-earth-medium font-serif italic text-2xl">
                    02
                  </span>
                  <div>
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-earth-dark mb-1 font-sans">
                      {t("Digital Wallet Sanctuary")}
                    </h4>
                    <p className="text-sm text-gray-500 italic">
                      {t(
                        "Experience effortless dining with our integrated wallet. Seamlessly convert your points into sanctuary credits, receive 3% automatic cashback on every order, and manage your balance with absolute transparency.",
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-earth-medium font-serif italic text-2xl">
                    03
                  </span>
                  <div>
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-earth-dark mb-1 font-sans">
                      {t("Priority Sanctuary Access")}
                    </h4>
                    <p className="text-sm text-gray-500 italic">
                      {t(
                        "As a member of our organic community, you move to the front of the harvest. Enjoy early access to seasonal menu reveals, priority booking for our popular weekend brunches, and invitations to exclusive chef-led tasting events.",
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/auth"
                className="inline-block px-12 py-5 bg-earth-dark text-cream uppercase tracking-[0.2em] text-[10px] font-sans font-bold hover:bg-earth-medium transition-all shadow-xl no-underline"
              >
                {t("enter_sanctuary")}
              </Link>
            </div>

            {/* THE CARD DESIGN - FIXED SIZING */}
            <div className="order-1 lg:order-2 relative w-full flex justify-center">
              <div className="absolute inset-0 bg-earth-medium/10 blur-[80px] rounded-full"></div>
              <div className="relative bg-earth-dark p-10 md:p-14 rounded-sm shadow-2xl text-cream w-full max-w-lg overflow-hidden min-h-[350px] flex flex-col justify-between">
                {/* Decorative background "O" */}
                <div className="absolute top-[-20px] right-[-20px] opacity-10 text-[12rem] italic select-none leading-none">
                  O
                </div>

                <div className="relative z-10">
                  <div className="border border-cream/30 px-4 py-1 rounded-full w-fit">
                    <p className="text-[9px] uppercase tracking-widest">
                      {t("premium_member")}
                    </p>
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-4 font-sans">
                    {t("collector_points")}
                  </p>
                  <h3 className="text-4xl md:text-6xl font-light italic leading-none">
                    {t("lolive_circle")}
                  </h3>
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
