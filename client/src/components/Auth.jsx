/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SanctuaryAccess = () => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-200 bg-[#3D4828] flex flex-col items-center justify-center font-serif text-[#F5F5DC] animate-in fade-in duration-700">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className="text-[50vh] opacity-5 italic select-none">O</span>
      </div>
      <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-1000">
        <div className="flex justify-center">
          <i className="fas fa-leaf text-4xl animate-pulse text-earth-medium"></i>
        </div>
        <div className="space-y-2 px-4">
          <h2 className="text-3xl md:text-4xl italic tracking-wide">
            {t("prep_sanctuary")}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.4em] font-sans opacity-40">
            {t("setting_table")}
          </p>
        </div>
        <div className="w-32 md:w-48 h-px bg-white/10 mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-earth-medium animate-loading-line"></div>
        </div>
      </div>
      <style>{`
        @keyframes loading-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-line {
          animation: loading-line 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

const Auth = ({ setIsLoggedIn }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(false); // 🎯 Default to Registration (Sign Up)
  const [isEnteringSanctuary, setIsEnteringSanctuary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5005"
      : "https://l-olive-backend.onrender.com";

  const [activeWisdom, setActiveWisdom] = useState(null);

  const wisdomPool = [
    { tKey: "quote_1", tips: ["tip_1_1", "tip_1_2"], color: "#3D4828" },
    { tKey: "quote_2", tips: ["tip_2_1", "tip_2_2"], color: "#4A5732" },
  ];

  const shuffleWisdom = () => {
    setActiveWisdom((current) => {
      const remainingOptions = wisdomPool.filter(
        (w) => w.tKey !== current?.tKey,
      );
      const randomIndex = Math.floor(Math.random() * remainingOptions.length);
      return remainingOptions[randomIndex];
    });
  };

  useEffect(() => {
    shuffleWisdom();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) return "Password must be 8+ characters.";
    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial)
      return "Include upper, lower, number, & special char.";

    return null;
  };

  const handleForgotPassword = async () => {
    if (!formData.email)
      return setError("Please enter your email address first.");
    setError("");
    setMessage("Sending recovery email...");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("🌿 Check your inbox for the recovery link!");
        setError(""); // 🎯 Fix: Clear error if successful
      } else {
        setError(data.msg || "Could not send recovery email.");
        setMessage(""); // 🎯 Fix: Clear "Sending..." if failed
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);
      setError("Connection error.");
      setMessage(""); // 🎯 Fix: Clear "Sending..." if failed
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!isLogin) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    setIsLoading(true);

    const url = isLogin
      ? `${API_BASE_URL}/api/auth/login`
      : `${API_BASE_URL}/api/auth/register`;

    try {
      const body = isLogin
        ? {
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
          }
        : { ...formData, email: formData.email.toLowerCase().trim() };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Authentication failed");

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        setIsEnteringSanctuary(true);

        setTimeout(() => {
          if (setIsLoggedIn) setIsLoggedIn(true);
          window.dispatchEvent(new Event("storage"));
          navigate("/dashboard");
        }, 2500);
      }
    } catch (err) {
      setError(err.message);
      setMessage(""); // 🎯 Fix: Ensure message is empty on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isEnteringSanctuary && <SanctuaryAccess />}

      <div
        className={`bg-cream min-h-screen flex items-center justify-center pt-24 pb-12 px-4 md:px-6 font-serif transition-opacity duration-1000 ${isEnteringSanctuary ? "opacity-0" : "opacity-100"}`}
      >
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/40 backdrop-blur-md border border-sand shadow-2xl overflow-hidden rounded-sm">
          {/* Left Panel (Wisdom/Points) */}
          <div
            className="p-8 md:p-12 lg:p-16 text-cream flex flex-col justify-center relative transition-colors duration-1000"
            style={{
              backgroundColor: !isLogin
                ? "#3D4828"
                : activeWisdom?.color || "#3D4828",
            }}
          >
            <div className="absolute -top-10 -right-10 text-[180px] md:text-[250px] text-white/5 font-serif italic pointer-events-none select-none">
              O
            </div>
            <div className="relative z-10">
              {!isLogin ? (
                <div
                  key="signup-view"
                  className="animate-in fade-in zoom-in-95 duration-700"
                >
                  <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-cream/60 mb-4 block">
                    {t("first_harvest")}
                  </span>
                  <h2 className="text-3xl md:text-5xl italic mb-6 leading-tight text-white">
                    {t("gift_joining")}
                  </h2>
                  <p className="text-base md:text-lg text-cream/70 font-light leading-relaxed mb-8 italic">
                    {t("gift_desc")}
                  </p>
                  <div className="bg-white/10 border border-white/20 p-6 md:p-8 rounded-sm backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
                      <div className="text-5xl md:text-6xl font-sans font-light text-white tracking-tighter">
                        2,000
                      </div>
                      <div className="hidden sm:block h-12 w-px bg-white/20"></div>
                      <div className="text-center sm:text-left">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-cream">
                          {t("welcome_pts_title")}
                        </p>
                        <p className="text-[10px] text-cream/50 italic mt-1">
                          {t("equiv_credit")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                activeWisdom && (
                  <div
                    key={activeWisdom.tKey}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-1000"
                  >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-cream/60 mb-4 block">
                      {t("chefs_wisdom")}
                    </span>
                    <h2 className="text-3xl md:text-5xl italic mb-6 leading-tight text-white">
                      {t("wisdom.title")}
                    </h2>
                    <p className="text-base md:text-lg text-cream/80 font-light leading-relaxed mb-8 italic">
                      "{t(`wisdom.${activeWisdom.tKey}`)}"
                    </p>
                    <div className="space-y-6 mt-8">
                      {activeWisdom.tips.map((tipKey, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] italic font-serif shrink-0 text-white">
                            {idx + 1}
                          </div>
                          <p className="text-[9px] md:text-[10px] tracking-[0.2em] leading-relaxed text-cream/70 uppercase font-sans font-bold pt-1">
                            {t(`wisdom.${tipKey}`)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right Panel (Form) */}
          <div className="p-8 md:p-12 lg:p-16 bg-transparent flex flex-col justify-center">
            <div className="mb-8 text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl text-earth-dark italic mb-2">
                {isLogin ? t("welcome_back") : t("join_collective")}
              </h3>
              <p className="text-[9px] md:text-[10px] text-earth-medium uppercase tracking-[0.3em] font-sans font-bold">
                {isLogin ? t("enter_credentials") : t("claim_points")}
              </p>
            </div>

            <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="animate-in fade-in duration-500">
                  <label className="block text-[10px] uppercase tracking-widest text-earth-medium font-sans font-bold mb-2">
                    {t("full_name")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-earth-dark transition-all text-earth-dark italic"
                    placeholder="Lana Del Rey"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-earth-medium font-sans font-bold mb-2">
                  {t("email_addr")}
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-earth-dark transition-all text-earth-dark italic"
                  placeholder="nature@lolive.com"
                />
              </div>

              <div className="relative">
                <label className="block text-[10px] uppercase tracking-widest text-earth-medium font-sans font-bold mb-2">
                  {t("password")}
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-sand py-2 pr-10 outline-none focus:border-earth-dark transition-all text-earth-dark"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 text-earth-medium hover:text-earth-dark p-1 cursor-pointer bg-transparent border-none"
                >
                  <i
                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}
                  ></i>
                </button>
                {!isLogin && (
                  <p className="text-[9px] text-gray-400 mt-2 font-sans tracking-wide leading-relaxed">
                    8+ chars, upper, lower, number, & special.
                  </p>
                )}
              </div>

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[9px] text-earth-medium uppercase tracking-[0.2em] hover:text-earth-dark transition-colors bg-transparent border-none cursor-pointer font-bold"
                  >
                    {t("lost_key")}
                  </button>
                </div>
              )}

              {/* 🎯 Fix: Error and Message Logic Cleaned up */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-[10px] text-red-800 uppercase tracking-widest font-bold italic animate-in slide-in-from-top-2">
                  {error}
                </div>
              )}
              {message && !error && (
                <div className="p-4 bg-earth-dark/5 border border-earth-dark/10 text-[10px] text-earth-dark uppercase tracking-widest font-bold italic animate-in slide-in-from-top-2">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 md:py-5 bg-earth-dark text-cream transition-all uppercase tracking-[0.3em] text-[10px] font-sans font-bold shadow-xl border-none ${
                  isLoading
                    ? "opacity-70 cursor-wait"
                    : "hover:bg-[#2d361e] cursor-pointer"
                }`}
              >
                {isLoading
                  ? "Verifying..."
                  : isLogin
                    ? t("sign_in")
                    : t("register_claim")}
              </button>
            </form>

            <div className="mt-10 text-center">
              <button
                onClick={() => {
                  if (!isLogin) shuffleWisdom();
                  setIsLogin(!isLogin);
                  setError("");
                  setMessage("");
                  setFormData({ name: "", email: "", password: "" });
                  setShowPassword(false);
                }}
                className="text-earth-medium hover:text-earth-dark text-[10px] uppercase tracking-[0.2em] font-bold transition-all bg-transparent border-none cursor-pointer"
              >
                {/* 🎯 Fix: This text was reversed, now fixed! */}
                {isLogin ? t("new_to_circle") : t("already_member")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
