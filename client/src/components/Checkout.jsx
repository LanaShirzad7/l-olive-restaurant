import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { useTranslation } from "react-i18next";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

  // --- STATE ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' or 'wallet'
  const [usePoints, setUsePoints] = useState(false);

  // --- USER DATA ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : { points: 0, walletBalance: 0 };
  });

  const userPoints = user.points || 0;
  const walletBalance = user.walletBalance || 0;

  // --- CALCULATIONS ---
  const pointsDollarValue = (userPoints / 100).toFixed(2);

  // Final amount to be charged
  const finalTotal = usePoints
    ? Math.max(0, cartTotal - parseFloat(pointsDollarValue)).toFixed(2)
    : cartTotal.toFixed(2);

  // --- SECURE PAYMENT HANDLER ---
  const processOrder = async (e) => {
    if (e) e.preventDefault();

    // Safety check for wallet balance
    if (paymentMethod === "wallet" && walletBalance < finalTotal) {
      alert(t("checkout insufficient wallet"));
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const orderData = {
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
        totalAmount: parseFloat(finalTotal),
        paymentMethod: paymentMethod,
        pointsUsed: usePoints ? userPoints : 0,
      };

      const res = await fetch(`${API_BASE_URL}/api/orders/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        // 🎯 THE CLEVER PART: Update local data with server-calculated values
        const updatedUser = {
          ...user,
          walletBalance: data.walletBalance,
          points: data.points,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        // Sync Navbar and clear cart
        window.dispatchEvent(new Event("storage"));
        if (clearCart) clearCart();

        // Translated Alert string
        alert(
          `${t("checkout order success")} \n${t("checkout earned")}: $${data.cashbackEarned.toFixed(2)} ${t("checkout cashback")}`,
        );
        navigate("/dashboard");
      } else {
        alert(data.msg || t("checkout payment failed"));
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert(t("checkout server error"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-cream min-h-screen pt-48 pb-20 font-serif text-center px-6">
        <div className="max-w-md mx-auto">
          <span className="text-earth-medium uppercase tracking-[0.4em] text-[10px] font-sans font-bold mb-4 block">
            {t("checkout empty harvest")}
          </span>
          <h1 className="text-4xl text-earth-dark italic mb-8">
            {t("checkout basket empty")}
          </h1>
          <Link
            to="/menu"
            className="inline-block px-10 py-4 bg-earth-dark text-cream uppercase tracking-widest text-xs font-sans font-bold no-underline hover:bg-earth-medium transition-all"
          >
            {t("checkout explore menu")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pt-32 pb-20 font-serif overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16 border-b border-sand pb-8">
          <span className="text-earth-medium uppercase tracking-[0.4em] text-[10px] font-sans font-bold mb-2 block">
            {t("checkout final step")}
          </span>
          <h1 className="text-5xl text-earth-dark italic">
            {t("checkout title")}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* LEFT: PAYMENT METHODS */}
          <div className="space-y-8">
            {/* Payment Method Toggle */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 py-4 text-[10px] uppercase font-bold tracking-widest border transition-all ${paymentMethod === "card" ? "bg-earth-dark text-cream border-earth-dark" : "bg-transparent text-earth-dark border-sand"}`}
              >
                <i className="fas fa-credit-card mr-2"></i>{" "}
                {t("checkout credit card")}
              </button>
              <button
                onClick={() => setPaymentMethod("wallet")}
                className={`flex-1 py-4 text-[10px] uppercase font-bold tracking-widest border transition-all ${paymentMethod === "wallet" ? "bg-earth-dark text-cream border-earth-dark" : "bg-transparent text-earth-dark border-sand"}`}
              >
                <i className="fas fa-wallet mr-2"></i> {t("checkout wallet")}
              </button>
            </div>

            <div className="bg-white/40 backdrop-blur-md p-8 md:p-10 shadow-2xl border border-sand">
              {paymentMethod === "card" ? (
                <form onSubmit={processOrder} className="space-y-8">
                  <h2 className="text-2xl text-earth-dark italic mb-4">
                    {t("checkout payment info")}
                  </h2>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-earth-medium font-bold mb-2">
                      {t("checkout cardholder name")}
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-transparent border-b border-sand py-2 outline-none focus:border-earth-dark italic"
                      placeholder={t("checkout enter name")}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-earth-medium font-bold mb-2">
                      {t("checkout card details")}
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-transparent border-b border-sand py-2 outline-none"
                      placeholder={t("checkout card number placeholder")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <input
                      required
                      type="text"
                      className="w-full bg-transparent border-b border-sand py-2 outline-none"
                      placeholder={t("checkout exp date placeholder")}
                    />
                    <input
                      required
                      type="text"
                      className="w-full bg-transparent border-b border-sand py-2 outline-none"
                      placeholder={t("checkout cvv placeholder")}
                    />
                  </div>
                  <button
                    disabled={isProcessing}
                    type="submit"
                    className="w-full py-5 bg-earth-dark text-cream uppercase tracking-[0.3em] text-xs font-bold shadow-xl hover:bg-earth-medium transition-all"
                  >
                    {isProcessing
                      ? t("checkout verifying")
                      : `${t("checkout pay now")} — $${finalTotal}`}
                  </button>
                </form>
              ) : (
                <div className="text-center py-10">
                  <h2 className="text-2xl text-earth-dark italic mb-6">
                    {t("checkout wallet payment")}
                  </h2>
                  <div className="bg-sand/10 p-8 border border-dashed border-sand mb-8">
                    <p className="text-[10px] uppercase font-bold text-earth-medium mb-2">
                      {t("checkout available balance")}
                    </p>
                    <p className="text-5xl font-light text-earth-dark">
                      ${walletBalance.toFixed(2)}
                    </p>
                  </div>
                  <button
                    disabled={isProcessing || walletBalance < finalTotal}
                    onClick={processOrder}
                    className="w-full py-5 bg-earth-dark text-cream uppercase tracking-[0.3em] text-xs font-bold shadow-xl hover:bg-earth-medium transition-all disabled:opacity-30"
                  >
                    {isProcessing
                      ? t("checkout processing")
                      : `${t("checkout confirm with wallet")} — $${finalTotal}`}
                  </button>
                  {walletBalance < finalTotal && (
                    <p className="text-red-800 text-[10px] uppercase font-bold mt-4 tracking-widest">
                      {t("checkout top up required")}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:sticky lg:top-40">
            <h2 className="text-2xl text-earth-dark italic mb-8 border-b border-sand pb-4">
              {t("checkout your selection")}
            </h2>

            <div className="space-y-6 mb-10 max-h-62.5 overflow-y-auto pr-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-end">
                  <div>
                    <h4 className="text-lg text-earth-dark">
                      {item.tKey ? t(item.tKey) : item.name}
                    </h4>
                    <p className="text-[10px] uppercase text-gray-400 font-sans">
                      {t("check quantity")}: {item.qty}
                    </p>
                  </div>
                  <span className="text-lg text-earth-dark font-light">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* REWARDS SECTION */}
            <div className="mb-8 p-6 border border-sand bg-white/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-earth-medium mb-1">
                    {t("checkout lolive circle")}
                  </h4>
                  <p className="text-xs text-earth-dark italic">
                    {userPoints} {t("checkout pts")} (${pointsDollarValue})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUsePoints(!usePoints)}
                className={`w-full py-3 text-[9px] uppercase font-bold tracking-widest border transition-all ${usePoints ? "bg-earth-dark text-white border-earth-dark" : "bg-transparent text-earth-dark border-earth-dark hover:bg-sand"}`}
              >
                {usePoints
                  ? t("checkou redemption applied")
                  : t("checkout apply points")}
              </button>
            </div>

            {/* TOTALS */}
            <div className="bg-sand/20 p-8 border border-sand">
              <div className="flex justify-between mb-2 text-gray-500 uppercase text-[10px] font-bold">
                <span>{t("checkout subtotal")}</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {usePoints && (
                <div className="flex justify-between mb-2 text-green-700 uppercase text-[10px] font-bold">
                  <span>{t("checkout circle discount")}</span>
                  <span>-${pointsDollarValue}</span>
                </div>
              )}
              <div className="flex justify-between mb-6 text-gray-500 uppercase text-[10px] font-bold">
                <span>{t("checkout cashback bonus")}</span>
                <span className="text-earth-dark">+3%</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-sand pt-6 text-earth-dark">
                <span className="uppercase text-xs font-bold">
                  {t("checkout total")}
                </span>
                <span className="text-5xl font-semibold">${finalTotal}</span>
              </div>
            </div>
            <p className="mt-6 text-[10px] text-gray-400 italic text-center uppercase tracking-widest">
              {t("checkout secured by")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
