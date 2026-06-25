import { useState } from "react";

const FooterBanner = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // placeholder: integrate with newsletter API later
    setEmail("");
  };

  return (
    <div className="w-full bg-[#ead7ea]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2c1d36]">Sign up to our news & offers</h3>
            <p className="mt-2 text-sm md:text-base text-[#5b495d]">Be the first to know about exclusive offers, new services, couriers, tools and more!</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-auto">
            <div className="flex items-center w-full md:w-[520px] bg-white rounded-full shadow-sm overflow-hidden">
              <input
                type="email"
                placeholder="email@address.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 outline-none text-sm md:text-base"
              />
              <button
                type="submit"
                className="bg-[#2abd73] hover:bg-[#22a963] transition-colors text-white font-semibold px-6 py-3 rounded-full"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FooterBanner;
