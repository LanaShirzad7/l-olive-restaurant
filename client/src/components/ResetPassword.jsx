import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🎯 SMART SWITCH: Works on localhost and Render automatically
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5005"
      : "https://l-olive-backend.onrender.com";

  // 🎯 PASSWORD VALIDATION LOGIC
  const validatePassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!minLength) return "Password must be at least 8 characters long.";
    if (!hasUpper) return "Include at least one uppercase letter.";
    if (!hasLower) return "Include at least one lowercase letter.";
    if (!hasNumber) return "Include at least one number.";
    if (!hasSpecial) return "Include at least one special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // 1. Check if passwords match
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    // 2. Check safety requirements
    const passwordError = validatePassword(password);
    if (passwordError) {
      return setError(passwordError);
    }

    setIsLoading(true);
    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-40 px-6 font-serif flex justify-center">
      <div className="w-full max-w-md p-10 bg-white/60 backdrop-blur-sm border border-sand shadow-sm h-fit">
        <h2 className="text-3xl text-earth-dark italic mb-6 border-b border-sand pb-4 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NEW PASSWORD FIELD */}
          <div className="relative">
            <label className="block text-[10px] uppercase tracking-widest text-earth-dark font-sans font-bold mb-2 text-left">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-earth-dark/20 py-2 pr-10 outline-none focus:border-earth-medium text-earth-dark"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 bottom-2 text-earth-medium hover:text-earth-dark bg-transparent border-none cursor-pointer p-1"
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}
              ></i>
            </button>
          </div>

          {/* CONFIRM PASSWORD FIELD */}
          <div className="relative">
            <label className="block text-[10px] uppercase tracking-widest text-earth-dark font-sans font-bold mb-2 text-left">
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border-b border-earth-dark/20 py-2 pr-10 outline-none focus:border-earth-medium text-earth-dark"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 bottom-2 text-earth-medium hover:text-earth-dark bg-transparent border-none cursor-pointer p-1"
            >
              <i
                className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}
              ></i>
            </button>
          </div>

          {/* SAFETY RULES TEXT */}
          <p className="text-[9px] text-gray-400 mt-2 font-sans tracking-wide leading-relaxed text-left">
            Must be 8+ chars with uppercase, lowercase, number, & special char.
          </p>

          {error && (
            <p className="p-3 bg-red-50 border border-red-100 text-[10px] text-red-800 uppercase tracking-widest font-bold italic">
              {error}
            </p>
          )}
          {message && (
            <p className="p-3 bg-earth-dark/5 border border-earth-dark/10 text-[10px] text-earth-dark uppercase tracking-widest font-bold italic">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 bg-earth-dark text-cream transition-all uppercase tracking-widest text-xs font-sans font-semibold mt-4 shadow-lg border-none ${
              isLoading
                ? "opacity-50 cursor-wait"
                : "hover:bg-earth-medium cursor-pointer"
            }`}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
