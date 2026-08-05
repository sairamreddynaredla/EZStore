import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import adminApi from "../services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!password || !confirm) return setError("Please provide and confirm your new password.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!token) return setError("Invalid or missing reset token.");

    setLoading(true);
    try {
      const res = await adminApi.post("/auth/reset-password", { token, password });
      setMessage(res?.data?.message || "Password reset successful. Redirecting to sign in...");
      setTimeout(() => navigate('/admin/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const strengthLabel = ["Very weak", "Weak", "Medium", "Strong", "Very strong"][strength];
  const canSubmit = password && confirm && password === confirm && strength >= 3;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Reset password</h1>
        <p className="text-slate-500 text-center mb-6">Enter your new password below.</p>

        {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        {message && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20"
            />
            <div className="mt-2 text-sm text-slate-600">Strength: <span className="font-medium">{strengthLabel}</span></div>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="text-sm text-slate-600 hover:underline"
            >
              Back to sign in
            </button>
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="rounded-xl bg-primary-600 py-2 px-4 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
