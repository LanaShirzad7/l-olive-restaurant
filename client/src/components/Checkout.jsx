import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { useTranslation } from "react-i18next"; // 🎯 IMPORTED TRANSLATOR

const Checkout = () => {
  const { cart, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation(); // 🎯 INITIALIZED TRANSLATOR

  // State for Points Redemption
  const [usePoints, setUsePoints] = useState(false);

  // Get User Data (Points)
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userPoints = storedUser.points || 0;

  // Point Conversion Logic (100 points = $1)
  const pointsDollarValue = (userPoints / 100).toFixed(2);
  const isSufficient = parseFloat(pointsDollarValue) >= cartTotal;

  // Final Total Calculation
  const finalTotal = usePoints
    ? cartTotal - parseFloat(pointsDollarValue) < 0
      ? 0
      : (cartTotal - parseFloat(pointsDollarValue)).toFixed(2)
    : cartTotal;

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      alert(
        usePoints ? t("checkout.alert_points") : t("checkout.alert_success"),
      );
      navigate("/dashboard");
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-cream min-h-screen pt-48 pb-20 font-serif text-center px-6">
        <div className="max-w-md mx-auto">
          <span className="text-earth-medium uppercase tracking-[0.4em] text-[10px] font-sans font-bold mb-4 block">
            {t("checkout.empty_harvest")}
          </span>
          <h1 className="text-4xl text-earth-dark italic mb-8">
            {t("checkout.basket_empty")}
          </h1>
          <Link
            to="/menu"
            className="inline-block px-10 py-4 bg-earth-dark text-cream uppercase tracking-widest text-xs font-sans font-bold no-underline hover:bg-earth-medium transition-all"
          >
            {t("checkout.explore_menu")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pt-32 pb-20 font-serif">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 border-b border-sand pb-8">
          <span className="text-earth-medium uppercase tracking-[0.4em] text-[10px] font-sans font-bold mb-2 block">
            {t("checkout.final_step")}
          </span>
          <h1 className="text-5xl text-earth-dark italic">
            {t("checkout.title")}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* LEFT: Payment Form */}
          <div className="bg-white/40 backdrop-blur-md p-10 shadow-2xl border border-sand">
            <h2 className="text-2xl text-earth-dark italic mb-8 border-b border-sand pb-4">
              {t("checkout.payment_info")}
            </h2>

            <form onSubmit={handlePayment} className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-earth-medium font-sans font-bold mb-2">
                  {t("checkout.cardholder_name")}
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-earth-dark transition-all text-earth-dark italic"
                  placeholder={t("checkout.enter_name")}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-earth-medium font-sans font-bold mb-2">
                  {t("checkout.card_details")}
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-earth-dark transition-all text-earth-dark"
                    placeholder="0000 0000 0000 0000"
                  />
                  <div className="absolute right-0 top-2 flex gap-2 opacity-30 text-earth-dark">
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-earth-medium font-sans font-bold mb-2">
                    {t("checkout.expiry")}
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-earth-dark transition-all text-earth-dark"
                    placeholder="MM / YY"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-earth-medium font-sans font-bold mb-2">
                    {t("checkout.cvc")}
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-earth-dark transition-all text-earth-dark"
                    placeholder="000"
                  />
                </div>
              </div>

              <button
                disabled={isProcessing}
                type="submit"
                className={`w-full py-5 bg-earth-dark text-cream uppercase tracking-[0.3em] text-xs font-sans font-bold shadow-xl transition-all mt-6 ${isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-earth-medium"}`}
              >
                {isProcessing
                  ? t("checkout.verifying")
                  : `${t("checkout.confirm_payment")} — $${finalTotal}`}
              </button>
            </form>
          </div>

          {/* RIGHT: Order Summary & POINTS SECTION */}
          <div className="sticky top-40">
            <h2 className="text-2xl text-earth-dark italic mb-8 border-b border-sand pb-4">
              {t("checkout.your_selection")}
            </h2>

            <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-4 scrollbar-thin">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-end">
                  <div>
                    <h4 className="text-xl text-earth-dark">{item.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-sans">
                      {t("checkout.quantity")}: {item.qty}
                    </p>
                  </div>
                  <span className="text-lg text-earth-dark font-light">
                    ${item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            {/* L'OLIVE CIRCLE REWARDS CARD */}
            <div className="mb-8 p-6 border border-sand bg-white/20 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-earth-medium mb-1 font-sans">
                    {t("checkout.lolive_circle")}
                  </h4>
                  <p className="text-xs text-earth-dark italic">
                    {t("checkout.balance")}:{" "}
                    <span className="font-bold">
                      {userPoints} {t("checkout.pts")}
                    </span>
                  </p>
                </div>
                <p className="text-xs text-earth-dark font-sans font-bold text-right">
                  ${pointsDollarValue}
                </p>
              </div>

              {isSufficient ? (
                <button
                  onClick={() => setUsePoints(!usePoints)}
                  className={`w-full py-3 text-[9px] uppercase tracking-widest font-bold transition-all border ${usePoints ? "bg-earth-dark text-white border-earth-dark" : "bg-transparent text-earth-dark border-earth-dark hover:bg-sand"}`}
                >
                  {usePoints
                    ? t("checkout.redemption_applied")
                    : t("checkout.apply_points")}
                </button>
              ) : (
                <div className="w-full py-3 bg-red-50 border border-red-100 text-red-800 text-[9px] uppercase tracking-widest font-bold text-center">
                  {t("checkout.insufficient_points")}
                </div>
              )}
            </div>

            {/* Total Display */}
            <div className="bg-sand/20 p-8 border border-sand">
              <div className="flex justify-between items-center mb-2 text-gray-500 uppercase tracking-widest text-[10px] font-sans font-bold">
                <span>{t("checkout.subtotal")}</span>
                <span>${cartTotal}</span>
              </div>

              {/* POINTS DISCOUNT ROW */}
              {usePoints && (
                <div className="flex justify-between items-center mb-2 text-green-700 uppercase tracking-widest text-[10px] font-sans font-bold">
                  <span>{t("checkout.circle_discount")}</span>
                  <span>-${pointsDollarValue}</span>
                </div>
              )}

              <div className="flex justify-between items-center mb-6 text-gray-500 uppercase tracking-widest text-[10px] font-sans font-bold">
                <span>{t("checkout.delivery")}</span>
                <span className="italic">{t("checkout.complimentary")}</span>
              </div>

              <div className="flex justify-between items-baseline border-t border-sand pt-6 text-earth-dark">
                <span className="uppercase tracking-[0.2em] text-xs font-sans font-bold">
                  {t("checkout.total")}
                </span>
                <span className="text-5xl font-semibold">${finalTotal}</span>
              </div>
            </div>

            <p className="mt-6 text-[10px] text-gray-400 italic text-center uppercase tracking-widest">
              {t("checkout.secured_by")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
