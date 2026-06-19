import { useState } from "react";
import { Mail, Send, PawPrint, CheckCircle, AlertCircle } from "lucide-react";

const NewsLetterSection = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [status, setStatus] = useState(null); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name");
      setStatus("error");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address");
      setStatus("error");
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      setStatus("error");
      return;
    }

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setFormData({ fullName: "", email: "" });
      setTimeout(() => setStatus(null), 3000);
    }, 1000);
  };

  return (
    <section className="py-12 md:py-20 lg:py-32 bg-linear-to-b from-[#f8f8f8] to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="mb-8 md:mb-12 lg:mb-20 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6">
            <div className="h-1 w-8 md:w-12 bg-linear-to-r from-red-500 to-red-400 rounded-full"></div>
            <p className="text-xs md:text-sm uppercase tracking-[2px] md:tracking-[3px] font-bold text-red-500">Stay Updated</p>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-3 md:mb-6">
            Pet Care Insights & Exclusive Deals
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
            Join our community of pet lovers and receive curated product recommendations, nutrition
            guides, wellness tips, and limited-time offers delivered straight to your inbox.
          </p>
        </div>

        {/* MAIN CARD SECTION */}
        <div className="relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-linear-to-r from-[#16325B] to-[#1a3a6f] rounded-lg md:rounded-2xl blur-xl opacity-40"></div>

          <div className="relative bg-linear-to-br from-[#16325B] to-[#0f1f3a] rounded-lg md:rounded-2xl overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-red-500/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-40 md:w-80 h-40 md:h-80 bg-white/5 blur-3xl rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-32 md:w-64 h-32 md:h-64 bg-orange-500/10 blur-3xl rounded-full"></div>

            {/* Content Grid */}
            <div className="relative z-10 grid md:grid-cols-2 gap-6 md:gap-12 items-center p-4 sm:p-8 md:p-12 lg:p-16">
              {/* LEFT CONTENT */}
              <div className="text-white">
                <div className="inline-flex items-center justify-center w-14 md:w-20 h-14 md:h-20 bg-white/10 backdrop-blur-md rounded-2xl mb-6 md:mb-8 border border-white/20">
                  <PawPrint size={24} className="text-red-400 md:w-[36px]" />
                </div>

                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <div className="inline-block">
                    <span className="text-xs md:text-sm uppercase tracking-[2px] md:tracking-[4px] font-bold text-red-400 bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                      Newsletter Benefits
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                    Expert Tips & Exclusive Access
                  </h3>

                  <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed">
                    Get personalized pet care recommendations and be the first to know about new
                    products.
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <CheckCircle size={20} className="text-green-400" />
                    </div>
                    <p className="text-gray-300">Exclusive product previews & early access</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <CheckCircle size={20} className="text-green-400" />
                    </div>
                    <p className="text-gray-300">Expert nutrition & wellness guides</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <CheckCircle size={20} className="text-green-400" />
                    </div>
                    <p className="text-gray-300">Special discounts & seasonal offers</p>
                  </div>
                </div>
              </div>

              {/* RIGHT FORM */}
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl">
                {/* Form Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center">
                    <Mail size={28} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">Subscribe Now</h4>
                    <p className="text-gray-600 text-sm">Get updates delivered weekly</p>
                  </div>
                </div>

                {/* Success Message */}
                {status === "success" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
                    <p className="text-green-800 font-medium">
                      Thanks for subscribing! Check your email for confirmation.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {status === "error" && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                    <p className="text-red-800 font-medium">{errorMessage}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="newsletter-name"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      id="newsletter-name"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      disabled={status === "loading"}
                      className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 outline-none focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newsletter-email"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      disabled={status === "loading"}
                      className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 outline-none focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="w-full h-12 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 disabled:scale-100 active:scale-95"
                  >
                    {status === "loading" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Subscribe Now
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Text */}
                <p className="text-gray-600 text-xs leading-relaxed mt-6 text-center">
                  We respect your privacy. Unsubscribe anytime. By subscribing, you agree to our{" "}
                  <a href="#" className="text-red-500 hover:text-red-600 font-semibold">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-red-500 hover:text-red-600 font-semibold">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetterSection;
