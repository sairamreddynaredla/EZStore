import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useToast } from "../../context/toast-context";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const response = await authApi.get("/addresses");
        setAddresses(response.data.addresses || []);
      } catch (err) {
        error(err.response?.data?.message || "Unable to load saved addresses.");
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <div className="bg-white rounded-[40px] shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Saved Addresses</h1>
          <p className="text-gray-500 mb-8">Manage your shipping and billing addresses for faster checkout.</p>

          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading addresses…</div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No saved addresses found.</div>
          ) : (
            <div className="grid gap-4">
              {addresses.map((address) => (
                <div key={address.id} className="rounded-3xl border border-gray-200 p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-lg">{address.label}</p>
                      {address.isDefault && (
                        <span className="text-sm text-white bg-orange-500 rounded-full px-3 py-1">Default</span>
                      )}
                    </div>
                    <p className="text-slate-700">{address.recipientName}</p>
                    <p className="text-slate-500">{address.phone}</p>
                    <p className="text-slate-500">{address.street}</p>
                    <p className="text-slate-500">{address.city}, {address.state} {address.postalCode}</p>
                    <p className="text-slate-500">{address.country}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Addresses;
