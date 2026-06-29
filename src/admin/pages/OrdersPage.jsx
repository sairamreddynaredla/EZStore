import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../context/toast-context";
import { getOrders, getOrder, updateOrderStatus } from "../services/orderService";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import PageHeader from "../components/PageHeader";

const ORDER_STATUS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
const PAYMENT_STATUS = ["paid", "pending", "failed", "refunded"];
const PAYMENT_METHODS = ["card", "paypal", "bank_transfer", "cash_on_delivery"];

const ORDER_STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const PAYMENT_STATUS_LABELS = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

const PAYMENT_METHOD_LABELS = {
  card: "Card",
  paypal: "PayPal",
  bank_transfer: "Bank Transfer",
  cash_on_delivery: "Cash on delivery",
};

const STATUS_TONE = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
  refunded: "danger",
};

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [lastUpdatedOrderId, setLastUpdatedOrderId] = useState(null);
  const { success, error: toastError } = useToast();
  const debouncedSearch = useRef(debounce((value) => setSearch(value), 400)).current;

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      q: search || undefined,
      orderStatus: statusFilter || undefined,
      paymentStatus: paymentStatusFilter || undefined,
      paymentMethod: paymentMethodFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy,
      order: sortOrder,
    }),
    [currentPage, pageSize, search, statusFilter, paymentStatusFilter, paymentMethodFilter, dateFrom, dateTo, sortBy, sortOrder]
  );

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getOrders(queryParams);
      setOrders(result.items);
      setTotalItems(result.total);
      setCurrentPage(result.page);
      setPageSize(result.pageSize);
    } catch (fetchError) {
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [queryParams]);

  const loadOrderDetails = async (orderId) => {
    setDetailsError("");
    setDetailsVisible(true);
    try {
      const data = await getOrder(orderId);
      setOrderDetails(data);
      setSelectedStatus(data.orderStatus || data.status || "pending");
    } catch (err) {
      setDetailsError("Unable to load order details.");
      toastError("Unable to load order details.");
    }
  };

  const closeDetails = () => {
    setDetailsVisible(false);
    setOrderDetails(null);
  };

  const updateStatus = async (orderId, status) => {
    const confirmed = window.confirm(`Update order ${orderId} to ${ORDER_STATUS_LABELS[status]}?`);
    if (!confirmed) return;

    setUpdatingStatus(true);
    try {
      await updateOrderStatus(orderId, status);
      success("Order status updated.");
      setLastUpdatedOrderId(orderId);
      await loadOrders();
      if (detailsVisible && orderDetails?.id === orderId) {
        const refreshed = await getOrder(orderId);
        setOrderDetails(refreshed);
        setSelectedStatus(refreshed.orderStatus || refreshed.status || status);
      }
    } catch (err) {
      toastError(err.response?.data?.message || "Unable to update order status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Search, filter, and update order status across your store."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Search</span>
            <input
              type="text"
              placeholder="Order ID or customer"
              onChange={(event) => debouncedSearch(event.target.value)}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Order status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            >
              <option value="">All statuses</option>
              {ORDER_STATUS.map((status) => (
                <option key={status} value={status}>
                  {ORDER_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Payment status</span>
            <select
              value={paymentStatusFilter}
              onChange={(event) => setPaymentStatusFilter(event.target.value)}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            >
              <option value="">All payment statuses</option>
              {PAYMENT_STATUS.map((status) => (
                <option key={status} value={status}>
                  {PAYMENT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Payment method</span>
            <select
              value={paymentMethodFilter}
              onChange={(event) => setPaymentMethodFilter(event.target.value)}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            >
              <option value="">All methods</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {PAYMENT_METHOD_LABELS[method]}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">From date</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">To date</span>
            <input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Sort</span>
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(event) => {
                const [field, order] = event.target.value.split(":");
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            >
              <option value="orderDate:desc">Date newest</option>
              <option value="orderDate:asc">Date oldest</option>
              <option value="totalAmount:desc">Amount high → low</option>
              <option value="totalAmount:asc">Amount low → high</option>
              <option value="customerName:asc">Customer A → Z</option>
              <option value="customerName:desc">Customer Z → A</option>
            </select>
          </label>
        </div>
      </div>
      </section>

      {error && <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="rounded-3xl border border-neutral-border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
              <th className="px-5 py-4">Order ID</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Items</th>
              <th className="px-5 py-4">Payment</th>
              <th className="px-5 py-4">Payment status</th>
              <th className="px-5 py-4">Order status</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <tr key={index} className="animate-pulse border-t border-slate-100 bg-slate-100">
                  <td colSpan={9} className="h-16 px-5 py-4" />
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const orderId = order.orderId ?? order.id;
                const customerName = order.customerName || order.customer?.name || order.customer?.fullName || "—";
                const amount = order.totalAmount ?? order.grandTotal ?? 0;
                const itemsCount = order.totalItems ?? order.items?.length ?? order.quantity ?? 0;
                const paymentMethod = order.paymentMethod || order.payment?.method || "—";
                const paymentStatus = order.paymentStatus || order.payment?.status || "—";
                const orderStatus = order.orderStatus || order.status || "pending";
                const date = order.orderDate || order.date || order.createdAt || "";
                return (
                  <tr key={orderId} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">#{orderId}</td>
                    <td className="px-5 py-4 text-slate-700">{customerName}</td>
                    <td className="px-5 py-4 text-slate-700">${Number(amount).toFixed(2)}</td>
                    <td className="px-5 py-4 text-slate-700">{itemsCount}</td>
                    <td className="px-5 py-4 text-slate-700">{PAYMENT_METHOD_LABELS[paymentMethod] ?? paymentMethod}</td>
                    <td className="px-5 py-4">
                      <Badge label={PAYMENT_STATUS_LABELS[paymentStatus] ?? paymentStatus} tone={paymentStatus === "paid" ? "success" : paymentStatus === "failed" ? "danger" : "warning"} />
                    </td>
                    <td className="px-5 py-4">
                      <Badge label={ORDER_STATUS_LABELS[orderStatus] ?? orderStatus} tone={STATUS_TONE[orderStatus] || "info"} />
                    </td>
                    <td className="px-5 py-4 text-slate-700">{date ? new Date(date).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => loadOrderDetails(orderId)}
                          className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(orderId, orderStatus === "cancelled" ? "pending" : "confirmed")}
                          className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      {detailsVisible && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
          <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Order Details</h2>
              <button
                type="button"
                onClick={closeDetails}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            {detailsError ? (
              <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">{detailsError}</div>
            ) : !orderDetails ? (
              <div className="grid gap-4 py-10">
                <div className="h-8 w-64 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-48 animate-pulse rounded-3xl bg-slate-100" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-sm text-slate-500">Order</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">#{orderDetails.orderId ?? orderDetails.id}</h3>
                    <p className="mt-2 text-sm text-slate-600">{new Date(orderDetails.orderDate || orderDetails.date || orderDetails.createdAt).toLocaleString()}</p>

                    <div className="mt-6 space-y-2 text-sm text-slate-700">
                      <p><span className="font-semibold">Customer:</span> {orderDetails.customerName || orderDetails.customer?.name}</p>
                      <p><span className="font-semibold">Email:</span> {orderDetails.customerEmail || orderDetails.customer?.email}</p>
                      <p><span className="font-semibold">Phone:</span> {orderDetails.customerPhone || orderDetails.customer?.phone}</p>
                      <p><span className="font-semibold">Payment:</span> {orderDetails.paymentMethod || orderDetails.payment?.method}</p>
                      <p><span className="font-semibold">Payment status:</span> {orderDetails.paymentStatus || orderDetails.payment?.status}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-sm text-slate-500">Shipping address</p>
                    <div className="mt-4 text-sm text-slate-700">
                      <p>{orderDetails.shippingAddress?.line1 || orderDetails.shippingAddress?.address || "—"}</p>
                      <p>{orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.state} {orderDetails.shippingAddress?.postalCode}</p>
                      <p>{orderDetails.shippingAddress?.country}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Items</h3>
                  <div className="mt-5 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th className="px-4 py-3 text-left">Product</th>
                          <th className="px-4 py-3 text-right">Qty</th>
                          <th className="px-4 py-3 text-right">Price</th>
                          <th className="px-4 py-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {(orderDetails.items || orderDetails.products || []).length ? (
                          (orderDetails.items || orderDetails.products).map((item) => (
                            <tr key={item.id || item.productId || `${item.name}-${item.quantity}`}>
                              <td className="px-4 py-4 text-slate-900">{item.name || item.title || item.productName}</td>
                              <td className="px-4 py-4 text-right text-slate-700">{item.quantity ?? item.qty ?? 1}</td>
                              <td className="px-4 py-4 text-right text-slate-700">${Number(item.price ?? item.unitPrice ?? 0).toFixed(2)}</td>
                              <td className="px-4 py-4 text-right text-slate-900">${Number((item.price ?? item.unitPrice ?? 0) * (item.quantity ?? item.qty ?? 1)).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-4 py-10 text-center text-slate-500">No order items available.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
