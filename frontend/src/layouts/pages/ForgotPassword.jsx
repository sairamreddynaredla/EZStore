import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useToast } from "../../context/toast-context";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await authApi.post("/auth/forgot-password", { email });
      success("If that email exists, password reset instructions were sent.");
      setSubmitted(true);
    } catch (err) {
      error(err.response?.data?.message || "Unable to submit request. Please try again.");
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
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Forgot Password</h1>
            <p className="text-gray-500 text-lg">
              Enter your registered email and we’ll send you a link to reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold text-emerald-900">Check Your Email</h2>
              <p className="text-emerald-700 text-base max-w-md mx-auto">
                If an account with <span className="font-semibold">{email}</span> exists, password reset instructions have been sent to your inbox.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 underline"
                >
                  Try another email
                </button>
                <span className="hidden sm:inline text-emerald-300">•</span>
                <Link to="/login" className="text-sm font-semibold text-orange-500 hover:underline">
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-5 rounded-2xl text-xl font-bold disabled:cursor-not-allowed disabled:opacity-70 shadow-md hover:shadow-lg"
              >
                {loading ? "Sending Instructions..." : "Send Reset Instructions"}
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

export default ForgotPassword;
