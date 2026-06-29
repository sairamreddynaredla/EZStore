import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useToast } from "../../context/toast-context";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
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
      setEmail("");
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
        <div className="bg-white rounded-[40px] shadow-lg p-10">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-3">Forgot Password</h1>
            <p className="text-gray-500 text-lg">
              Enter your email and we’ll send you instructions to reset your password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email Address"
                className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-5 rounded-2xl text-xl font-bold disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
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

export default ForgotPassword;
