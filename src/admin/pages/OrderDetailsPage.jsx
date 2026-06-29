import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/toast-context";
import { getOrder, updateOrderStatus } from "../services/orderService";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const STATUS_TONES = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
  refunded: "danger",
};

const supportedStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const data = await getOrder(orderId);
        setOrder(data);
        setSelectedStatus(data.orderStatus || data.status || "pending");
      } catch (err) {
        setLoadError("Unable to load order details.");
        error(err.response?.data?.message || "Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, error]);

  const handleStatusUpdate = async () => {
    if (!order || !selectedStatus) return;
    const confirmed = window.confirm(`Confirm update order ${order.orderId ?? order.id} status to ${STATUS_LABELS[selectedStatus]}?`);
    if (!confirmed) return;

    setUpdating(true);
    try {
      await updateOrderStatus(order.id || order.orderId, selectedStatus);
      success("Order status updated successfully.");
      const refreshed = await getOrder(order.id || order.orderId);
      setOrder(refreshed);
    } catch (err) {
      error(err.response?.data?.message || "Unable to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  const orderDate = useMemo(() => {
    const raw = order?.orderDate || order?.date || order?.createdAt;
    return raw ? new Date(raw).toLocaleString() : "—";
  }, [order]);

  const customer = order?.customer || {
    name: order?.customerName || "—",
    email: order?.customerEmail || order?.email || "—",
    phone: order?.customerPhone || order?.phone || "—",
  };

  const shipping = order?.shippingAddress || order?.shipping || {};
  const billing = order?.billingAddress || order?.billing || shipping;
  const items = order?.items || order?.products || [];
  const subtotal = order?.subtotal ?? order?.items?.reduce?.((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0) ?? 0;
  const tax = order?.taxAmount ?? order?.tax ?? 0;
  const shippingCharge = order?.shippingAmount ?? order?.shippingCost ?? 0;
  const discount = order?.discountAmount ?? order?.discount ?? 0;
  const total = order?.totalAmount ?? order?.grandTotal ?? subtotal + tax + shippingCharge - discount;

  const timeline = useMemo(() => {
    if (!order) return [];
    const current = order.orderStatus || order.status || "pending";
    return supportedStatuses.map((status) => ({
      status,
      active: status === current || supportedStatuses.indexOf(status) < supportedStatuses.indexOf(current),
    }));
  }, [order]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Details"
        description="Review customer, payment, and fulfillment details for a single order."
        actions={[
          <Link
            key="back-to-orders"
            to="/admin/orders"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to orders
          </Link>,
        ]}
      />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-5 w-32 animate-pulse rounded-2xl bg-slate-100" />
              <div className="mt-4 space-y-3">
                <div className="h-4 w-48 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-4 w-36 animate-pulse rounded-2xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : loadError ? (
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">{loadError}</div>
      ) : !order ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Order not found.</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Order</p>
                  <h2 className="text-xl font-semibold text-slate-900">#{order.orderId ?? order.id}</h2>
                </div>
                <Badge label={STATUS_LABELS[order.orderStatus] ?? STATUS_LABELS[order.status] ?? "Unknown"} tone={STATUS_TONES[order.orderStatus] ?? STATUS_TONES[order.status] ?? "info"} />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Order date</p>
                  <p className="mt-2 font-semibold text-slate-900">{orderDate}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Payment</p>
                  <p className="mt-2 font-semibold text-slate-900">{order.paymentMethod ?? order.payment?.method ?? "—"}</p>
                  <p className="text-sm text-slate-500">{order.paymentStatus ?? order.payment?.status ?? "—"}</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Update status</h3>
              <p className="text-sm text-slate-500">Change the order fulfillment state and save the new status.</p>
              <div className="mt-5 space-y-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">New status</span>
                  <select
                    className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                  >
                    {supportedStatuses.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  disabled={updating || selectedStatus === (order.orderStatus || order.status)}
                  onClick={handleStatusUpdate}
                  className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {updating ? "Updating..." : "Update order status"}
                </button>
              </div>
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Customer</h3>
              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <p><span className="font-semibold">Name:</span> {customer.name}</p>
                <p><span className="font-semibold">Email:</span> {customer.email}</p>
                <p><span className="font-semibold">Phone:</span> {customer.phone}</p>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Shipping</h3>
              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <p>{shipping.address || shipping.street || "—"}</p>
                <p>{shipping.city ? `${shipping.city}, ${shipping.state || ""}` : ""}</p>
                <p>{shipping.postalCode || shipping.zip}</p>
                <p>{shipping.country}</p>
              </div>
            </section>
          </div>

          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Products</h3>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-right">Quantity</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.length ? (
                    items.map((item) => (
                      <tr key={item.id || item.productId || `${item.name}-${item.quantity}`}>
                        <td className="px-4 py-4 text-slate-900">{item.name || item.title || item.productName || "Product"}</td>
                        <td className="px-4 py-4 text-right text-slate-700">{item.quantity ?? item.qty ?? 1}</td>
                        <td className="px-4 py-4 text-right text-slate-700">${Number(item.price ?? item.unitPrice ?? 0).toFixed(2)}</td>
                        <td className="px-4 py-4 text-right text-slate-900">${Number((item.price ?? item.unitPrice ?? 0) * (item.quantity ?? item.qty ?? 1)).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-500">No ordered products available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Order summary</h3>
              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${Number(tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${Number(shippingCharge).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-rose-600">-${Number(discount).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between text-base font-semibold text-slate-900">
                  <span>Grand total</span>
                  <span>${Number(total).toFixed(2)}</span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Payment details</h3>
              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span>{order.paymentMethod ?? order.payment?.method ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span>{order.paymentStatus ?? order.payment?.status ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID</span>
                  <span>{order.transactionId ?? order.payment?.transactionId ?? "—"}</span>
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Order timeline</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              {timeline.map((entry) => (
                <div key={entry.status} className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${entry.active ? "bg-primary-600" : "bg-slate-300"}`} />
                  <span>{STATUS_LABELS[entry.status]}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
