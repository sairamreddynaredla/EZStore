import AdminDialog from "./common/Dialog";
import Badge from "./Badge";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ORDER_STATUS_LABELS = {
  returned: "Returned",
  refund_requested: "Refund Requested",
  refund_approved: "Refund Approved",
  refund_completed: "Refund Completed",
  refunded: "Refunded",
};

const CustomerDetailsModal = ({
  visible,
  customer,
  loading,
  error,
  onClose,
  onStatusToggle,
  statusUpdating,
}) => {
  if (!visible) return null;

  const name = customer?.name || `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() || "Customer";
  const email = customer?.email || customer?.contactEmail || "—";
  const phone = customer?.phone || customer?.contactPhone || customer?.addresses?.[0]?.phone || "—";
  const status = customer?.status || (customer?.blocked ? "blocked" : "active") || "active";
  const totalOrders = customer?.totalOrders ?? customer?.orderCount ?? customer?.orders?.length ?? 0;
  const totalSpent = customer?.totalSpent ?? customer?.lifetimeValue ?? customer?.spending ?? 0;
  const wishlistCount = customer?.wishlistCount ?? customer?.wishlistItems?.length ?? 0;
  const registered = customer?.registeredAt || customer?.createdAt || "";
  const orderHistory = customer?.orders || customer?.orderHistory || [];
  const returnOrders = orderHistory.filter((order) => {
    const statusValue = order.orderStatus || order.status || "";
    return statusValue === "returned";
  }).length;
  const refundRequests = orderHistory.filter((order) => {
    const statusValue = order.orderStatus || order.status || "";
    return statusValue === "refund_requested" || statusValue === "refund_approved";
  }).length;
  const refundsCompleted = orderHistory.filter((order) => {
    const statusValue = order.orderStatus || order.status || "";
    return statusValue === "refund_completed" || statusValue === "refunded";
  }).length;
  const lastLogin = customer?.lastLoginAt || customer?.lastLogin || "";
  const addresses = customer?.addresses || [];
  const wishlistItems = customer?.wishlistItems || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Customer Profile</p>
            <h2 className="text-xl font-semibold text-slate-900">{name}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              label={status === "blocked" ? "Blocked" : status === "abandoned" ? "Abandoned" : "Active"}
              tone={status === "blocked" ? "danger" : status === "abandoned" ? "warning" : "success"}
            />
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-3xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 rounded-3xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>
        ) : !customer ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Customer details unavailable.</div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Profile</p>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <p><span className="font-semibold">Name:</span> {name}</p>
                  <p><span className="font-semibold">Email:</span> {email}</p>
                  <p><span className="font-semibold">Phone:</span> {phone}</p>
                  <p><span className="font-semibold">Registered:</span> {registered ? new Date(registered).toLocaleDateString() : "—"}</p>
                  <p><span className="font-semibold">Last login:</span> {lastLogin ? new Date(lastLogin).toLocaleString() : "—"}</p>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Total orders</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{totalOrders}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Total spending</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{currencyFormatter.format(Number(totalSpent))}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Wishlist items</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{wishlistCount}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Return / refund</p>
                    <div className="mt-2 space-y-1 text-sm text-slate-700">
                      <p className="break-words">Returned: {returnOrders}</p>
                      <p className="break-words">Refund requests: {refundRequests}</p>
                      <p className="break-words">Refunds complete: {refundsCompleted}</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onStatusToggle}
                  disabled={statusUpdating}
                  className="mt-6 w-full rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {statusUpdating
                    ? "Updating..."
                    : status === "blocked"
                    ? "Unblock customer"
                    : status === "abandoned"
                    ? "Activate customer"
                    : "Mark abandoned"}
                </button>
              </section>
            </div>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Order History</h3>
                  <p className="text-sm text-slate-500">Recent purchases placed by this customer.</p>
                </div>
                <p className="text-sm font-medium text-slate-700">{orderHistory.length} orders</p>
              </div>

              {orderHistory.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No past orders available.
                </div>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left">Order</th>
                        <th className="px-4 py-3 text-right">Date</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {orderHistory.map((order) => {
                        const orderId = order.orderId || order.id;
                        const amount = order.totalAmount ?? order.grandTotal ?? order.amount ?? 0;
                        const date = order.placedAt || order.orderDate || order.date || order.createdAt || "";
                        const rawStatus = order.orderStatus || order.status || "";
                        const statusText = ORDER_STATUS_LABELS[rawStatus] || rawStatus.replace(/_/g, " ") || "—";

                        return (
                          <tr key={orderId}>
                            <td className="px-4 py-4 text-slate-900">#{orderId}</td>
                            <td className="px-4 py-4 text-right text-slate-700">{date ? new Date(date).toLocaleDateString() : "—"}</td>
                            <td className="px-4 py-4 text-right text-slate-700">${Number(amount).toFixed(2)}</td>
                            <td className="px-4 py-4 text-right text-slate-900">{statusText}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Saved Addresses</h3>
                    <p className="text-sm text-slate-500">Any delivery addresses on file.</p>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{addresses.length} saved</p>
                </div>

                {addresses.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    No addresses available.
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {addresses.map((address) => (
                      <div key={address.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-slate-900">{address.label || "Address"}</p>
                          {address.isDefault ? <Badge label="Default" tone="success" /> : null}
                        </div>
                        <p className="mt-2">{address.recipientName}</p>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.postalCode}</p>
                        <p>{address.country}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Wishlist Overview</h3>
                    <p className="text-sm text-slate-500">Products the customer has saved.</p>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{wishlistItems.length} items</p>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    Wishlist is empty.
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {wishlistItems.map((item) => {
                      const product = item.product || {};
                      return (
                        <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                          <div>
                            <p className="font-semibold text-slate-900">{item.productName || product.name || "Product"}</p>
                            <p className="text-slate-500">{product.price ? currencyFormatter.format(Number(product.price)) : "—"}</p>
                          </div>
                          <Badge label="Saved" tone="neutral" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
