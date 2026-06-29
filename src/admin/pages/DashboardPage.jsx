import { useMemo } from "react";
import { Activity, Box, PlusCircle, PackageCheck, PackagePlus, ShoppingBag, Star, Tag, Truck, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import useDashboardSummary from "../hooks/useDashboardSummary";
import Badge from "../components/Badge";
import PageHeader from "../components/PageHeader";

const metricCards = [
  { title: "Total Products", key: "totalProducts", icon: PackageCheck, accent: "bg-emerald-100 text-emerald-700" },
  { title: "Total Categories", key: "totalCategories", icon: Tag, accent: "bg-sky-100 text-sky-700" },
  { title: "Total Customers", key: "totalCustomers", icon: UserCheck, accent: "bg-violet-100 text-violet-700" },
  { title: "Total Orders", key: "totalOrders", icon: Truck, accent: "bg-orange-100 text-orange-700" },
  { title: "Total Revenue", key: "revenue", icon: Activity, accent: "bg-emerald-100 text-emerald-700" },
  { title: "Pending Orders", key: "pendingOrders", icon: ShoppingBag, accent: "bg-amber-100 text-amber-700" },
  { title: "Low Stock", key: "lowStockCount", icon: Box, accent: "bg-amber-100 text-amber-700" },
  { title: "Out of Stock", key: "outOfStockCount", icon: Box, accent: "bg-rose-100 text-rose-700" },
];

const DashboardPage = () => {
  const { summary, loading, refresh } = useDashboardSummary();

  const stats = useMemo(
    () => ({
      totalProducts: summary?.totalProducts ?? "--",
      totalCategories: summary?.totalCategories ?? "--",
      totalOrders: summary?.totalOrders ?? "--",
      totalCustomers: summary?.totalCustomers ?? "--",
      revenue: summary?.revenue !== null && summary?.revenue !== undefined ? `$${Number(summary.revenue).toFixed(2)}` : "--",
      pendingOrders: summary?.pendingOrders ?? "--",
      lowStockCount: summary?.lowStockCount ?? "--",
      outOfStockCount: summary?.outOfStockCount ?? "--",
    }),
    [summary]
  );

  const recentOrders = summary?.recentOrders || [];
  const lowStockProducts = summary?.lowStockProducts || [];
  const recentCustomers = summary?.recentCustomers || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="A real-time overview of your store performance and inventory health."
        actions={[
          <Link
            key="add-product"
            to="/admin/products"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100"
          >
            <PlusCircle className="h-4 w-4" /> Add Product
          </Link>,
          <Link
            key="add-category"
            to="/admin/categories"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100"
          >
            <Tag className="h-4 w-4" /> Add Category
          </Link>,
          <Link
            key="view-orders"
            to="/admin/orders"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100"
          >
            <Truck className="h-4 w-4" /> View Orders
          </Link>,
          <Link
            key="view-customers"
            to="/admin/customers"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100"
          >
            <Users className="h-4 w-4" /> View Customers
          </Link>,
          <Link
            key="view-inventory"
            to="/admin/inventory"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100"
          >
            <PackagePlus className="h-4 w-4" /> Inventory
          </Link>,
          <Link
            key="view-coupons"
            to="/admin/coupons"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100"
          >
            <Tag className="h-4 w-4" /> Coupons
          </Link>,
          <Link
            key="view-reviews"
            to="/admin/reviews"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100"
          >
            <Star className="h-4 w-4" /> Reviews
          </Link>,
        ]}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({ title, key, icon: Icon, accent }) => (
          <div key={key} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{stats[key]}</p>
              </div>
              <div className={`rounded-3xl p-3 ${accent}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent Orders</h2>
              <p className="text-sm text-slate-500">Latest orders from the store.</p>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <div className="grid grid-cols-6 gap-4 bg-slate-50 px-4 py-3 text-xs uppercase tracking-[0.16em] text-slate-500">
              <span className="col-span-2">Order</span>
              <span>Customer</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            <div className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 px-4 py-5 animate-pulse bg-white">
                    <span className="h-5 rounded bg-slate-100 col-span-2" />
                    <span className="h-5 rounded bg-slate-100" />
                    <span className="h-5 rounded bg-slate-100" />
                    <span className="h-5 rounded bg-slate-100" />
                    <span className="h-5 rounded bg-slate-100" />
                  </div>
                ))
              ) : recentOrders.length === 0 ? (
                <div className="px-4 py-10 text-center text-slate-500">No recent orders available.</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id || order.orderId} className="grid grid-cols-6 gap-4 px-4 py-4 bg-white sm:grid-cols-6">
                    <div className="col-span-2">
                      <p className="font-semibold text-slate-900">#{order.orderId || order.id}</p>
                      <p className="text-sm text-slate-500">{order.orderNumber || order.orderId || order.id}</p>
                    </div>
                    <div className="text-slate-700">{order.customerName || order.customer?.name || order.customerEmail || "—"}</div>
                    <div className="text-slate-700">{typeof order.totalAmount === "number" ? `$${order.totalAmount.toFixed(2)}` : order.totalAmount || "—"}</div>
                    <div>
                      <Badge label={order.orderStatus || order.status || "Pending"} tone={order.orderStatus === "pending" ? "warning" : order.orderStatus === "delivered" ? "success" : order.orderStatus === "cancelled" ? "danger" : "info"} />
                    </div>
                    <div className="text-slate-500">{order.date ? new Date(order.date).toLocaleDateString() : order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Low Stock Products</h2>
              <p className="text-sm text-slate-500">Products that require inventory attention.</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{stats.lowStockCount} items</span>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-3xl bg-slate-100" />
              ))
            ) : lowStockProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-slate-500">No low stock alerts right now.</div>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{product.name || product.title || "Untitled product"}</p>
                      <p className="text-sm text-slate-500">{product.sku ? `SKU: ${product.sku}` : product.skuCode || "No SKU"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge label={product.stock <= 0 ? "Out of Stock" : `Stock: ${product.stock}`} tone={product.stock <= 0 ? "danger" : "warning"} />
                      <Link to={`/admin/products`} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">Quick Edit</Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Recent Customers</h2>
            <p className="text-sm text-slate-500">Newest customers and their activity summary.</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse bg-white">
                    <td className="h-16 px-5 py-4" />
                    <td className="h-16 px-5 py-4" />
                    <td className="h-16 px-5 py-4" />
                    <td className="h-16 px-5 py-4" />
                  </tr>
                ))
              ) : recentCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-500">No recent customers available.</td>
                </tr>
              ) : (
                recentCustomers.map((customer) => {
                  const id = customer.id || customer.customerId || customer.email;
                  const name = customer.name || [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "—";
                  const email = customer.email || customer.contactEmail || "—";
                  const registered = customer.registeredAt || customer.createdAt || customer.createdOn;
                  const totalOrders = customer.totalOrders ?? customer.orderCount ?? 0;

                  return (
                    <tr key={id} className="bg-white hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-900">{name}</td>
                      <td className="px-5 py-4 text-slate-700">{email}</td>
                      <td className="px-5 py-4 text-slate-700">{registered ? new Date(registered).toLocaleDateString() : "—"}</td>
                      <td className="px-5 py-4 text-slate-700">{totalOrders}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
