import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useToast } from "../../context/toast-context";

const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 6) score += 1;
  if (pwd.length >= 10) score += 1;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500 text-red-600" };
  if (score === 2 || score === 3) return { score: 2, label: "Medium", color: "bg-yellow-500 text-yellow-600" };
  return { score: 3, label: "Strong", color: "bg-emerald-500 text-emerald-600" };
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const strength = getPasswordStrength(password);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password || !confirmPassword) {
      error("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 6) {
      error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      error("Passwords do not match.");
      return;
    }

    if (!token) {
      error("Reset token is missing or invalid. Please request a new password reset link.");
      return;
    }

    setLoading(true);
    try {
      await authApi.post("/auth/reset-password", {
        token,
        password,
      });
      success("Your password has been reset successfully.");
      setResetDone(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    } catch (err) {
      error(err.response?.data?.message || "Unable to reset password. Token may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-16">
        <div className="bg-white rounded-[40px] shadow-lg p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Reset Password</h1>
            <p className="text-gray-500 text-lg">
              Set a strong new password to regain access to your account.
            </p>
          </div>

          {!token && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-6 mb-6">
              <p className="font-semibold">Missing Reset Token</p>
              <p className="text-sm text-amber-700 mt-1">
                Your reset token is missing. Please check your email or request a new password reset link below.
              </p>
              <Link to="/forgot-password" className="inline-block mt-3 text-orange-500 font-bold hover:underline">
                Request new reset link →
              </Link>
            </div>
          )}

          {resetDone ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold text-emerald-900">Password Reset Successful!</h2>
              <p className="text-emerald-700 text-base max-w-md mx-auto">
                Your password has been updated. Redirecting you to login...
              </p>
              <div className="pt-2">
                <Link to="/login" className="inline-block bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-600 transition">
                  Login Now
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="New Password"
                  required
                  className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-12 py-5 rounded-2xl text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>Password Strength:</span>
                    <span className={strength.color.split(" ")[1]}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color.split(" ")[0]}`}
                      style={{ width: strength.score === 1 ? "33%" : strength.score === 2 ? "66%" : "100%" }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm New Password"
                  required
                  className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-12 py-5 rounded-2xl text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
              )}

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-5 rounded-2xl text-xl font-bold disabled:cursor-not-allowed disabled:opacity-70 shadow-md hover:shadow-lg"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>

              <div className="text-center text-base text-gray-500 pt-2">
                <Link to="/login" className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:underline">
                  <ArrowLeft size={18} /> Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
