import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useToast } from "../../context/toast-context";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await authApi.get("/orders");
        setOrders(response.data.orders || []);
      } catch (err) {
        error(err.response?.data?.message || "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <div className="bg-white rounded-[40px] shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Order History</h1>
          <p className="text-gray-500 mb-8">Review your past purchases and order statuses.</p>

          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading orders…</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-500">You have no orders yet.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-gray-200 p-6">
                  <div className="flex flex-wrap justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order</p>
                      <p className="font-semibold text-lg">#{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Placed</p>
                      <p className="font-semibold">{new Date(order.placedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-semibold">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold capitalize">{order.status}</p>
                    </div>
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

export default Orders;
