import ezstoreLogo from "../assets/logo/ezstore-logo.png";

const Footer = () => {
  return (
    <footer className="bg-white text-[#1A1A1A] mt-12 pt-12 pb-6 px-4 md:px-8 border-t">

      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Logo Section */}
        <div>
          <img src={ezstoreLogo} alt="EZStore Logo" className="h-10 mb-3" />
          <p className="text-sm text-gray-600 leading-6 mb-6">
            Redefining pet shopping with premium food, accessories,
            and trusted brands designed to improve your pet’s life.
          </p>

          {/* Accepted Payments */}
          <div>
            <h3 className="font-semibold mb-3">
              Accepted Payments
            </h3>

            <div className="flex items-center gap-3 flex-wrap">

              <div className="bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
                <img
                  src="https://img.icons8.com/color/48/stripe.png"
                  alt="Stripe"
                  className="h-5 object-contain"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
                <img
                  src="https://img.icons8.com/color/48/visa.png"
                  alt="Visa"
                  className="h-5 object-contain"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
                <img
                  src="https://img.icons8.com/color/48/mastercard-logo.png"
                  alt="MasterCard"
                  className="h-5 object-contain"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
                <img
                  src="https://img.icons8.com/color/48/google-pay-india.png"
                  alt="Google Pay"
                  className="h-5 object-contain"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
                <img
                  src="https://img.icons8.com/ios-filled/50/mac-os.png"
                  alt="Apple Pay"
                  className="h-5 object-contain"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Pets */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Pets
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#">Dogs</a></li>
            <li><a href="#">Cats</a></li>
            <li><a href="#">Birds</a></li>
            <li><a href="#">Fish</a></li>
            <li><a href="#">Rabbits</a></li>
            <li><a href="#">Hamsters</a></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            About EZStore
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">News & Updates</a></li>
            <li><a href="#">Store Locations</a></li>
            <li><a href="#">EZStore Promise</a></li>
          </ul>
        </div>

        {/* Brands */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Popular Brands
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#">Pedigree</a></li>
            <li><a href="#">Royal Canin</a></li>
            <li><a href="#">Whiskas</a></li>
            <li><a href="#">Drools</a></li>
            <li><a href="#">Farmina</a></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Help & Support
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Returns & Refunds</a></li>
            <li><a href="#">Track Your Order</a></li>
            <li><a href="#">Contact Support</a></li>
            <li><a href="#">Feedback</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 mt-10 pt-5">

        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-xs text-gray-500">

          {/* Left */}
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} EZStore. All rights reserved.
          </div>

          {/* Center */}
          <div className="text-center">
            Designed & Developed by Virtu Tech Solutions
          </div>

          {/* Right */}
          <div className="flex gap-5 justify-center md:justify-end">

            <a href="#" className="hover:text-[#F53B3B]">
              Terms of Service
            </a>

            <a href="#" className="hover:text-[#F53B3B]">
              Privacy Policy
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;