import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useToast } from "../../context/toast-context";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      error("Please fill out all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      error("New password and confirmation must match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      success("Password updated successfully. Please sign in again.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      logout();
    } catch (err) {
      error(err.response?.data?.message || "Unable to update password.");
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
            <h1 className="text-5xl font-bold mb-3">Change Password</h1>
            <p className="text-gray-500 text-lg">
              Update your account password to keep your profile secure.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Current Password"
                className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
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
              {loading ? "Saving..." : "Update Password"}
            </button>

            <div className="text-center text-sm text-gray-500">
              <Link to="/account" className="inline-flex items-center gap-2 text-orange-500 font-semibold">
                <ArrowLeft size={16} /> Back to account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
