import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useToast } from "../../context/toast-context";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState({});
  const { error, success } = useToast();

  const loadOrders = async (nextPage = 1) => {
    try {
      const response = await authApi.get("/orders", { params: { page: nextPage, limit: pageSize, q: search } });
      setOrders(response.data.orders || []);
      setTotal(response.data.total || 0);
      setPage(response.data.page || 1);
    } catch (err) {
      error(err.response?.data?.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
  }, [pageSize]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadOrders(1);
    }, 250);

    return () => clearTimeout(debounce);
  }, [search]);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const haystack = `${order.orderNumber || ""} ${order.status || ""}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  }), [orders, search]);

  const handleAction = async (orderId, action) => {
    setActionLoading((current) => ({ ...current, [action + orderId]: true }));
    try {
      if (action === "cancel") {
        await authApi.post(`/orders/${orderId}/cancel`);
        success("Order cancelled.");
      } else if (action === "return") {
        await authApi.post(`/orders/${orderId}/returns`);
        success("Return request submitted.");
      } else if (action === "refund") {
        await authApi.post(`/orders/${orderId}/refunds`, { reason: "Requested from customer account" });
        success("Refund request submitted.");
      }
      await loadOrders(page);
    } catch (err) {
      error(err.response?.data?.message || "Unable to update order.");
    } finally {
      setActionLoading((current) => ({ ...current, [action + orderId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <div className="bg-white rounded-[40px] shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Order History</h1>
          <p className="text-gray-500 mb-8">Review your past purchases and order statuses.</p>

          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders"
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 md:max-w-xs"
            />
            <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="rounded-2xl border border-gray-300 px-4 py-3">
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading orders…</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-500">You have no orders yet.</div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
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
                      <p className="font-semibold">₹{Number(order.totalAmount || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold capitalize">{order.status}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(["pending", "confirmed", "processing"].includes(order.status)) && (
                      <button onClick={() => handleAction(order.id, "cancel")} disabled={actionLoading[`cancel${order.id}`]} className="rounded-full border border-red-500 px-4 py-2 text-sm text-red-600 disabled:opacity-60">{actionLoading[`cancel${order.id}`] ? "Working…" : "Cancel Order"}</button>
                    )}
                    {order.status === "delivered" && (
                      <button onClick={() => handleAction(order.id, "return")} disabled={actionLoading[`return${order.id}`]} className="rounded-full border border-orange-500 px-4 py-2 text-sm text-orange-600 disabled:opacity-60">{actionLoading[`return${order.id}`] ? "Working…" : "Return Item"}</button>
                    )}
                    {(["delivered", "returned"].includes(order.status)) && (
                      <button onClick={() => handleAction(order.id, "refund")} disabled={actionLoading[`refund${order.id}`]} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-700 disabled:opacity-60">{actionLoading[`refund${order.id}`] ? "Working…" : "Refund Request"}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {Math.min(pageSize, filteredOrders.length)} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => loadOrders(Math.max(1, page - 1))} disabled={page <= 1} className="rounded-full border border-gray-300 px-4 py-2 text-sm disabled:opacity-50">Previous</button>
              <button onClick={() => loadOrders(page + 1)} disabled={page * pageSize >= total} className="rounded-full border border-gray-300 px-4 py-2 text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
