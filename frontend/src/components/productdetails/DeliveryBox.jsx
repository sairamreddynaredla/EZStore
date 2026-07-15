import { useState } from "react";

const DeliveryBox = () => {
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleCheckPincode = () => {
    const isValid = /^\d{5}(-\d{4})?$/.test(pincode.trim());
    if (!isValid) {
      setError("Please enter a valid 5-digit ZIP code!");
      setStatusMessage("");
      return;
    }

    setError("");
    setStatusMessage("Delivery available for this ZIP code.");
  };

  return (
    <div className="hidden sm:block bg-[#f8f8f8] border border-gray-200 rounded-[28px] p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Fast Delivery Available 🚚</h3>

          <p className="text-gray-500 mt-1">Delivery within 2-4 business days</p>
        </div>

        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
          Free Shipping
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4">
        <label className="text-sm font-semibold text-slate-700">Enter ZIP Code</label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="5-digit ZIP code"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
          <button
            type="button"
            onClick={handleCheckPincode}
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Check
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {statusMessage && <p className="mt-3 text-sm text-emerald-700">{statusMessage}</p>}
        <p className="mt-3 text-sm italic text-slate-500">
          The final delivery date will depend on the items in the cart.
        </p>
      </div>
    </div>
  );
};

export default DeliveryBox;
