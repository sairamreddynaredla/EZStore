import { Link } from "react-router-dom";

const OrderSuccess = () => {

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center px-4">
      <div className="bg-white rounded-[40px] shadow-md p-8 sm:p-10 w-full max-w-xl text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-green-600 text-4xl">✓</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-[#071c3d] mb-4">Order Placed!</h1>

        {/* Description */}
        <p className="text-gray-500 text-lg leading-8 mb-10">
          Thank you for shopping with <span className="text-red-500 font-semibold">EZStore</span>.
          Your premium gadgets are being prepared for dispatch.
        </p>

        {/* Order Details */}
        <div className="border rounded-[30px] p-6 bg-[#fafafa] mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between mb-5">
            <span className="text-gray-400 font-medium">ORDER NUMBER</span>

            <span className="font-bold text-[#071c3d]">#FS-636723</span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <span className="text-gray-400 font-medium">ESTIMATED DELIVERY</span>

            <span className="text-blue-600 font-semibold">3-5 Business Days</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-[#004d40] hover:bg-[#00352d] text-white px-8 py-4 rounded-full font-semibold transition-all"
          >
            CONTINUE SHOPPING
          </Link>

          <button className="border border-gray-300 px-8 py-4 rounded-full font-semibold text-gray-700 hover:bg-gray-100 transition-all">
            TRACK ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
