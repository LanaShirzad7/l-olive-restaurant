import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  // 🎯 FIXED: Added your live server address here
  const API_BASE_URL = "https://l-olive-restaurant-mhla.vercel.app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      // 🎯 FIXED: Updated the fetch URL to use your live server
      const response = await fetch(
        `${API_BASE_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("🌿 Password updated! Redirecting to login...");
        setTimeout(() => navigate("/auth"), 3000);
      } else {
        setError(data.msg || "Invalid or expired link.");
      }
    } catch (err) {
      console.error("Reset Error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-40 px-6 font-serif flex justify-center">
      <div className="w-full max-w-md p-10 bg-white/60 backdrop-blur-sm border border-sand shadow-sm h-fit text-center">
        <h2 className="text-3xl text-earth-dark italic mb-6 border-b border-sand pb-4">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-earth-dark font-sans font-bold mb-2 text-left">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-earth-dark/20 py-2 outline-none focus:border-earth-medium"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-earth-dark font-sans font-bold mb-2 text-left">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border-b border-earth-dark/20 py-2 outline-none focus:border-earth-medium"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-800 italic font-sans">{error}</p>
          )}
          {message && (
            <p className="text-xs text-earth-dark italic font-sans">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-earth-dark text-cream hover:bg-earth-medium transition-all uppercase tracking-widest text-xs font-sans font-semibold mt-4 shadow-lg cursor-pointer border-none"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
