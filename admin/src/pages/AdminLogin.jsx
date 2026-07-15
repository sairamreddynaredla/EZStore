import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import adminApi from "../services/api";
import { useAdminAuth } from "../hooks/useAdminAuth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminAuth();

  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await adminApi.post("/auth/login", { email, password });
      const { token, user } = response.data ?? {};

      if (!token || !user) {
        throw new Error("Invalid response from server.");
      }

      login({ token, user });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">EZStore Admin</h1>
        <p className="text-slate-500 text-center mb-6">Sign in to manage your store.</p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
