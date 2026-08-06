import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useCart from "../../hooks/usecart";
import { initSocket, joinCustomerRoom, subscribeToCustomerOrderEvents } from "../../services/socket";
import customerCommerceApi from "../../services/customerCommerceApi";

const OrderSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderNumber = searchParams.get("orderNumber") || location.state?.orderNumber || "";
  const paymentIntentClientSecret =
    searchParams.get("payment_intent_client_secret") || searchParams.get("paymentIntentClientSecret") || "";
  const redirectStatus = searchParams.get("redirect_status") || "";

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const { user } = useAuth();
  const { clearCart } = useCart();
  const storageKey = orderNumber ? `ezstore_recent_order_${orderNumber}` : null;

  const formatCurrency = (amount, currency = "USD") => {
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(amount) || 0);
    } catch {
      return `${currency} ${Number(amount || 0).toFixed(2)}`;
    }
  };

  const hasInitializedRef = useRef(false);
  const clearedOrderRef = useRef("");

  useEffect(() => {
    const paymentStatus = String(order?.paymentStatus || order?.payment?.status || "").toLowerCase();
    const paymentConfirmed = paymentStatus === "paid" || paymentStatus === "succeeded" || redirectStatus === "succeeded";
    const orderKey = order?.id || order?.orderNumber || orderNumber;

    if (!paymentConfirmed || !orderKey || clearedOrderRef.current === String(orderKey)) {
      return;
    }

    let active = true;

    const clearCompletedOrderCart = async () => {
      const cleared = await clearCart();
      if (active && cleared) {
        clearedOrderRef.current = String(orderKey);
      }
    };

    clearCompletedOrderCart();

    return () => {
      active = false;
    };
  }, [clearCart, order?.id, order?.orderNumber, order?.payment?.status, order?.paymentStatus, orderNumber, redirectStatus]);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }
    hasInitializedRef.current = true;

    let isMounted = true;

    const parseStoredOrder = () => {
      if (!storageKey) return null;
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return null;
        const stored = JSON.parse(raw);
        return stored?.order || null;
      } catch {
        return null;
      }
    };

    const storeOrder = (orderData) => {
      if (!storageKey || !orderData) return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ orderNumber: orderData.orderNumber, orderId: orderData.id, order: orderData }));
      } catch {
        // Ignore storage failures.
      }
    };

    const fetchOrder = async () => {
      if (!orderNumber) {
        throw new Error("Missing order reference");
      }

      const response = await customerCommerceApi.getOrder(orderNumber);
      return response.data.order;
    };

    const showWebhookConfirmationPending = async (targetOrder, clientSecret) => {
      if (!targetOrder?.id || !clientSecret) {
        return;
      }

      if (targetOrder.paymentStatus === "paid" || targetOrder.payment?.status === "paid") {
        setVerificationMessage("Payment is already confirmed.");
        return;
      }

      if (isMounted) setVerificationMessage("Your payment was submitted. Order status will update after Stripe's secure webhook confirmation.");
    };

    const initialize = async () => {
      setError("");
      setStatusMessage("");

      if (!orderNumber) {
        setError("Missing order number. Please return to checkout.");
        setLoading(false);
        return;
      }

      let loadedOrder = order ?? parseStoredOrder();

      // The checkout page stores the newly-created order before navigating here.
      // Render that information immediately; a slow API request should not leave
      // a completed purchase indefinitely on the loading screen.
      if (isMounted && loadedOrder) {
        setOrder(loadedOrder);
        storeOrder(loadedOrder);
        setLoading(false);
      }

      const needsFullOrder = !loadedOrder || !loadedOrder.shippingAddress || !loadedOrder.payment || !Array.isArray(loadedOrder.items) || !loadedOrder.paymentIntentId;
      if (needsFullOrder) {
        setLoading(true);
        try {
          const serverOrder = await fetchOrder();
          loadedOrder = serverOrder;
          storeOrder(serverOrder);
        } catch (err) {
          if (isMounted) {
            const message = err?.response?.data?.message || err.message || "Unable to load order details.";
            setError(message);
          }
        }
      }

      if (isMounted && loadedOrder) {
        setOrder(loadedOrder);
        storeOrder(loadedOrder);
      }

      if (isMounted && loadedOrder && paymentIntentClientSecret) {
        await showWebhookConfirmationPending(loadedOrder, paymentIntentClientSecret);
      }

      if (isMounted && loadedOrder?.id) {
        try {
          const socket = initSocket();
          if (user?.id) {
            joinCustomerRoom(user.id);
          }
          socket.emit("joinOrderRoom", loadedOrder.id);
        } catch {
          // Realtime updates are optional; the order details should still render.
          setStatusMessage("Order details loaded. Live status updates are temporarily unavailable.");
        }
      }

      if (isMounted) {
        if (!paymentIntentClientSecret && redirectStatus) {
          setStatusMessage(`Returned from Stripe with status: ${redirectStatus}`);
        }
        setLoading(false);
      }
    };

    initialize();

    let unsubscribe;
    if (order?.id) {
      unsubscribe = subscribeToCustomerOrderEvents((event) => {
        if (event.order?.id === order.id) {
          setOrder((current) => ({ ...current, ...event.order }));
          if (event.payment) {
            setOrder((current) => ({ ...current, payment: event.payment }));
          }
          setStatusMessage("Order status has been updated in real time.");
        }
      });
    }

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [orderNumber, paymentIntentClientSecret, redirectStatus, storageKey, user?.id]);

  const orderDate = order?.placedAt ? new Date(order.placedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "-";
  const deliveryEstimate = order?.metadata?.deliveryMethod === "express" ? "1-2 Business Days" : "3-5 Business Days";
  const paymentMethod = order?.paymentMethod || order?.payment?.method || "Online Payment";
  const shipping = order?.shippingAddress;
  const orderItems = Array.isArray(order?.items) ? order.items : [];

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-[40px] shadow-md p-8 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <span className="text-green-600 text-4xl">✓</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#071c3d] mb-2">Order Confirmed</h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Thank you for shopping with <span className="text-red-500 font-semibold">EZStore</span>. Your order is now being processed.
              </p>
            </div>
            <div className="space-y-3 text-right">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-[#004d40] px-8 py-3 text-white font-semibold transition hover:bg-[#00352d]"
              >
                Continue Shopping
              </Link>
              <Link
                to="/orders"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-8 py-3 text-gray-700 font-semibold transition hover:bg-gray-50"
              >
                View Orders
              </Link>
            </div>
          </div>

          {loading ? null : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
              <p className="font-semibold">Unable to load order details</p>
              <p className="mt-2">{error}</p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <Link to="/" className="rounded-full bg-[#004d40] px-6 py-3 text-white font-semibold">
                  Return to Home
                </Link>
                <Link to="/checkout" className="rounded-full border border-gray-300 px-6 py-3 text-gray-700 font-semibold">
                  Retry Checkout
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-gray-200 bg-[#fafafa] p-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Order Number</p>
                      <p className="mt-2 text-xl font-semibold text-[#071c3d]">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Order Date</p>
                      <p className="mt-2 text-lg text-gray-700">{orderDate}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Order Status</p>
                      <p className="mt-2 text-lg text-gray-700 capitalize">{order.status || "Pending"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Payment Status</p>
                      <p className="mt-2 text-lg text-gray-700 capitalize">{order.paymentStatus || order.payment?.status || "Pending"}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment & Delivery</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Amount</p>
                      <p className="mt-2 text-2xl font-bold text-[#071c3d]">{formatCurrency(order.totalAmount, order.currency)}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Payment Method</p>
                      <p className="mt-2 text-lg text-gray-700">{paymentMethod}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Estimated Delivery</p>
                      <p className="mt-2 text-lg text-gray-700">{deliveryEstimate}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Status</p>
                      <p className="mt-2 text-lg text-gray-700">{verificationMessage || statusMessage || "Order is being processed."}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                  {shipping ? (
                    <div className="space-y-2 text-gray-700">
                      <p className="font-semibold">{shipping.recipientName || shipping.fullName || "Customer"}</p>
                      <p>{shipping.street}</p>
                      <p>
                        {shipping.city}, {shipping.state} {shipping.postalCode}
                      </p>
                      <p>{shipping.country || "United States"}</p>
                      {shipping.phone && <p>Phone: {shipping.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-gray-500">Shipping address is not available.</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-gray-200 bg-white p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Products Purchased</h2>
                      <p className="text-sm text-gray-500">{orderItems.length} item{orderItems.length === 1 ? "" : "s"}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">{formatCurrency(order.totalAmount, order.currency)}</p>
                  </div>
                  <div className="space-y-4">
                    {orderItems.length > 0 ? (
                      orderItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-800">{item.name || item.title || "Product"}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                          </div>
                          <p className="font-semibold text-gray-700">{formatCurrency(item.price * (item.quantity || 1), order.currency)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No product details are available for this order.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-[#f8fafc] p-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">Need help?</h2>
                  <p className="text-sm text-gray-600">
                    If you have questions about your order, please visit your orders page or contact support.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to="/orders"
                      className="inline-flex items-center justify-center rounded-full bg-[#004d40] px-6 py-3 text-white font-semibold"
                    >
                      Go to Orders
                    </Link>
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-gray-700 font-semibold"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
