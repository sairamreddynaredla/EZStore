import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, PawPrint, Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/toast-context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.post("/auth/login", {
        email,
        password,
      });

      login(response.data.user, response.data.token);
      success("Signed in successfully.");
      navigate("/account", { replace: true });
    } catch (err) {
      error(err.response?.data?.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const response = await authApi.get("/auth/google/url");
      const authUrl = response?.data?.url;
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        error("Unable to initiate Google sign-in. Please try again.");
        setGoogleLoading(false);
      }
    } catch (err) {
      error(err.response?.data?.message || "Google sign-in is currently unavailable.");
      setGoogleLoading(false);
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

              <h2 className="text-6xl font-bold leading-18.75 mb-8">Premium Food For Your Pets</h2>

              <p className="text-xl leading-10 text-orange-100">
                Shop high-quality nutrition, treats, supplements, and pet care essentials for dogs,
                cats, birds, fish, rabbits, and more.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            {/* TITLE */}
            <div className="mb-10">
              <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>

              <p className="text-gray-500 text-lg">Login to continue shopping for your pets.</p>
            </div>

            {/* FORM */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full border border-gray-300 focus:border-orange-500 outline-none pl-14 pr-5 py-5 rounded-2xl text-lg"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 text-gray-600 cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500" />
                  Remember Me
                </label>

                <Link to="/forgot-password" className="text-orange-500 font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-5 rounded-2xl text-xl font-bold disabled:cursor-not-allowed disabled:opacity-70 shadow-md hover:shadow-lg"
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-gray-200"></div>

                <span className="text-gray-400 font-medium">OR</span>

                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="w-full border border-gray-300 hover:border-orange-500 transition py-5 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 bg-white text-gray-700 hover:bg-gray-50 shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
              >
                {googleLoading ? (
                  <span className="animate-pulse">Connecting to Google...</span>
                ) : (
                  <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue With Google
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-lg">
                Don’t have an account?
                <Link to="/register" className="text-orange-500 font-semibold ml-2 hover:underline">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
