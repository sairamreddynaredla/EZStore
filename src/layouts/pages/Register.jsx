import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, PawPrint } from "lucide-react";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/toast-context";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { error } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password || !confirmPassword) {
      error("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      error("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      error("You must accept the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const [firstName, ...rest] = fullName.trim().split(" ");
      const lastName = rest.join(" ") || undefined;

      const response = await authApi.post("/auth/register", {
        firstName: fullName ? firstName : undefined,
        lastName: fullName ? lastName : undefined,
        email,
        password,
      });

      login(response.data.user, response.data.token);
      navigate("/");
    } catch (err) {
      error(err.response?.data?.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16">
        <div className="grid lg:grid-cols-2 bg-white rounded-[40px] overflow-hidden shadow-lg">
          {/* LEFT SIDE */}
          <div className="hidden lg:flex flex-col justify-center bg-orange-500 text-white p-16">
            <div className="max-w-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-white/20 p-4 rounded-full">
                  <PawPrint size={40} />
                </div>

                <h1 className="text-5xl font-bold">Pet Store</h1>
              </div>

              <h2 className="text-6xl font-bold leading-18.75 mb-8">
                Create Your Pet Care Account
              </h2>

              <p className="text-xl leading-10 text-orange-100">
                Join thousands of pet lovers shopping premium nutrition, treats, toys, and
                healthcare products for their pets.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            {/* TITLE */}
            <div className="mb-10">
              <h1 className="text-5xl font-bold mb-4">Create Account</h1>

              <p className="text-gray-500 text-lg">Start shopping premium products for your pets.</p>
            </div>

            {/* FORM */}
            <form id="register-form" className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />

                <input
                  form="register-form"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Full Name"
                  className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg"
                />
              </div>

              <div className="relative">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />

                <input
                  form="register-form"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email Address"
                  className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />

                <input
                  id="register-password"
                  name="password"
                  form="register-form"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />

                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm Password"
                  className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg"
                />
              </div>

              <label htmlFor="register-terms" className="flex items-start gap-3 text-gray-600 text-sm leading-7">
                <input
                  id="register-terms"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                  type="checkbox"
                  className="mt-1"
                />
                I agree to the Terms & Conditions and Privacy Policy.
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-5 rounded-2xl text-xl font-bold disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-gray-200"></div>

                <span className="text-gray-400">OR</span>

                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <button
                type="button"
                className="w-full border border-gray-300 hover:border-orange-500 transition py-5 rounded-2xl text-lg font-semibold"
              >
                Continue With Google
              </button>

              <p className="text-center text-gray-500 text-lg">
                Already have an account?
                <Link to="/login" className="text-orange-500 font-semibold ml-2">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
