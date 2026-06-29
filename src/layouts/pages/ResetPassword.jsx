import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useToast } from "../../context/toast-context";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password || !confirmPassword) {
      error("Please enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      error("Passwords do not match.");
      return;
    }

    if (!token) {
      error("Reset token is missing. Please check your reset link.");
      return;
    }

    setLoading(true);
    try {
      await authApi.post("/auth/reset-password", {
        token,
        password,
      });
      success("Your password has been reset successfully.");
      navigate("/login", { replace: true });
    } catch (err) {
      error(err.response?.data?.message || "Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-16">
        <div className="bg-white rounded-[40px] shadow-lg p-10">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-3">Reset Password</h1>
            <p className="text-gray-500 text-lg">
              Enter a new password to restore access to your account.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="New Password"
                className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm New Password"
                className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-5 rounded-2xl text-xl font-bold disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="text-center text-sm text-gray-500">
              <Link to="/login" className="inline-flex items-center gap-2 text-orange-500 font-semibold">
                <ArrowLeft size={16} /> Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
