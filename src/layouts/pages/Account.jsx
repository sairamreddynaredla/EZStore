import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/toast-context";

const Account = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });
  const { success, error } = useToast();

  useEffect(() => {
    if (user) {
      setProfile(user);
      setFormState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await authApi.put("/auth/profile", formState);
      setProfile(response.data.user);
      success("Profile updated successfully.");
    } catch (err) {
      error(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="bg-white rounded-[40px] shadow-lg p-10">
            <h1 className="text-4xl font-bold mb-4">My Account</h1>
            <p className="text-gray-500 mb-8">Manage your profile, password, orders, and saved addresses.</p>

            <div className="grid gap-6">
              <div className="grid gap-2">
                <span className="text-sm font-medium text-slate-500">Account email</span>
                <p className="text-lg font-semibold text-slate-900">{profile.email}</p>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium text-slate-500">Member since</span>
                <p className="text-lg text-slate-900">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <form className="mt-10 space-y-6" onSubmit={handleSave}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-500">First Name</span>
                  <input
                    name="firstName"
                    value={formState.firstName}
                    onChange={handleChange}
                    className="mt-2 w-full border border-gray-300 rounded-2xl px-4 py-4 focus:border-orange-500 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-500">Last Name</span>
                  <input
                    name="lastName"
                    value={formState.lastName}
                    onChange={handleChange}
                    className="mt-2 w-full border border-gray-300 rounded-2xl px-4 py-4 focus:border-orange-500 outline-none"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-500">Phone</span>
                <input
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  className="mt-2 w-full border border-gray-300 rounded-2xl px-4 py-4 focus:border-orange-500 outline-none"
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 transition text-white py-4 px-8 rounded-2xl text-lg font-bold disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[40px] shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
              <div className="space-y-3">
                <Link to="/change-password" className="block rounded-2xl border border-gray-200 p-4 hover:border-orange-500 transition">
                  <p className="font-semibold">Change Password</p>
                  <p className="text-sm text-gray-500">Update your password and sign-in security.</p>
                </Link>
                <Link to="/orders" className="block rounded-2xl border border-gray-200 p-4 hover:border-orange-500 transition">
                  <p className="font-semibold">Order History</p>
                  <p className="text-sm text-gray-500">View your latest purchases and order status.</p>
                </Link>
                <Link to="/addresses" className="block rounded-2xl border border-gray-200 p-4 hover:border-orange-500 transition">
                  <p className="font-semibold">Saved Addresses</p>
                  <p className="text-sm text-gray-500">Manage billing and shipping addresses.</p>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Account Actions</h2>
              <button
                type="button"
                onClick={logout}
                className="w-full bg-slate-900 hover:bg-slate-700 transition text-white py-4 rounded-2xl text-lg font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
