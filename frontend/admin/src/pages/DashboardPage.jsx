import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, ArrowUpRight, Bell, Box, CheckCircle2, CircleAlert, CreditCard, Gift, Layers3, MessageCircle,
  Moon, PackageCheck, PackagePlus, Search, ShoppingBag, Sparkles, Sun, Tag, Truck, UserCheck, Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import useDashboardSummary from "../hooks/useDashboardSummary";
import Badge from "../components/Badge";
import { formatCurrency, getStatusLabel, getStatusTone } from "../utils/dashboardAnalytics";

const cardMotion = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const initials = (name = "Customer") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const DashboardPage = () => {
  const { summary, loading, refresh } = useDashboardSummary();
  const [darkMode, setDarkMode] = useState(false);

  const stats = useMemo(() => ({
    revenue: summary?.revenue !== null && summary?.revenue !== undefined ? formatCurrency(summary.revenue) : "--",
    todayRevenue: formatCurrency(summary?.todayRevenue ?? 0),
    totalOrders: summary?.totalOrders ?? "--",
    pendingOrders: summary?.pendingOrders ?? "--",
    deliveredOrders: summary?.deliveredOrders ?? "--",
    totalCustomers: summary?.totalCustomers ?? "--",
    totalProducts: summary?.totalProducts ?? "--",
    lowStockCount: summary?.lowStockCount ?? "--",
  }), [summary]);

  const recentOrders = summary?.recentOrders || [];
  const lowStockProducts = summary?.lowStockProducts || [];
  const recentCustomers = summary?.recentCustomers || [];
  const orderStatusBreakdown = summary?.orderStatusBreakdown || [];
  const customerBreakdown = summary?.customerBreakdown || {};
  const topProducts = summary?.topProducts || [];
  const revenueSeries = summary?.revenueSeries || [];
  const recentActivities = summary?.recentActivities || [];
  const growthPercentage = summary?.growthPercentage ?? 0;
  const averageOrderValue = summary?.averageOrderValue ?? 0;
  const monthlyRevenue = summary?.monthlyRevenue ?? 0;
  const conversionRate = summary?.conversionRate ?? 0;
  const totalStatusOrders = orderStatusBreakdown.reduce((total, entry) => total + Number(entry.count || 0), 0);
  const maxRevenue = Math.max(...revenueSeries.map((entry) => Number(entry.value) || 0), 1);
  const today = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  const kpis = [
    { label: "Total Revenue", value: stats.revenue, icon: Activity, gradient: "from-orange-500 to-amber-400", note: `${growthPercentage >= 0 ? "+" : ""}${growthPercentage.toFixed(1)}% this month` },
    { label: "Today's Sales", value: stats.todayRevenue, icon: CreditCard, gradient: "from-teal-600 to-cyan-400", note: "Live sales total" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, gradient: "from-blue-600 to-cyan-400", note: "All-time orders" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Truck, gradient: "from-amber-500 to-orange-400", note: "Needs attention" },
    { label: "Delivered Orders", value: stats.deliveredOrders, icon: CheckCircle2, gradient: "from-emerald-600 to-teal-400", note: "Successfully fulfilled" },
    { label: "Total Customers", value: stats.totalCustomers, icon: Users, gradient: "from-violet-600 to-pink-400", note: `${customerBreakdown.repeatCustomers ?? 0} repeat buyers` },
    { label: "Total Products", value: stats.totalProducts, icon: PackageCheck, gradient: "from-slate-700 to-slate-500", note: "Active catalog" },
    { label: "Low Stock", value: stats.lowStockCount, icon: Box, gradient: "from-rose-500 to-orange-400", note: "Review inventory" },
  ];

  return (
    <div className={`min-h-full space-y-6 rounded-3xl p-1 transition-colors duration-300 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <header className={`sticky top-0 z-20 flex flex-col gap-4 rounded-2xl border px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between ${darkMode ? "border-slate-700/70 bg-slate-900/85" : "border-white/80 bg-white/85 shadow-sm"}`}>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${darkMode ? "text-teal-300" : "text-teal-700"}`}>{today}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Welcome back, Admin</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 sm:max-w-2xl">
          <label className={`hidden max-w-sm flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 lg:flex ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`}>
            <Search className="h-4 w-4 text-slate-400" /><input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Search orders, customers, products..." />
          </label>
          <button type="button" onClick={() => setDarkMode((value) => !value)} aria-label="Toggle dashboard theme" className={`rounded-xl border p-2.5 transition hover:scale-105 ${darkMode ? "border-slate-700 bg-slate-800 text-amber-300" : "border-slate-200 bg-white text-slate-600"}`}>{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
          <button type="button" aria-label="Messages" className={`relative rounded-xl border p-2.5 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}><MessageCircle className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-500" /></button>
          <button type="button" aria-label="Notifications" className={`relative rounded-xl border p-2.5 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-teal-500" /></button>
          <div className="flex items-center gap-2 pl-1"><span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-xs font-bold text-white">AD</span><span className="hidden text-sm font-semibold lg:block">Admin</span></div>
        </div>
      </header>

      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#102A43] to-teal-900 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100"><Sparkles className="h-3.5 w-3.5 text-amber-300" /> Store performance</span>
            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Make every pet parent’s visit count.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">You have {summary?.pendingOrders ?? 0} orders to process and {lowStockProducts.length} inventory items that may need a closer look.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/admin/products" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5"><PackagePlus className="h-4 w-4" /> Add product</Link>
              <Link to="/admin/orders" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/15">View orders <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"><p className="text-xs text-slate-300">Monthly revenue</p><p className="mt-2 text-2xl font-bold">{formatCurrency(monthlyRevenue)}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"><p className="text-xs text-slate-300">Avg. order value</p><p className="mt-2 text-2xl font-bold">{formatCurrency(averageOrderValue)}</p></div>
            <div className="col-span-2 rounded-2xl border border-teal-300/20 bg-teal-400/10 p-4"><p className="text-xs text-teal-100">Order conversion</p><p className="mt-1 text-3xl font-bold">{conversionRate.toFixed(1)}%</p><p className="mt-1 text-xs text-teal-100/80">Orders per 100 customers</p></div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, gradient, note }, index) => (
          <motion.div key={label} {...cardMotion} transition={{ delay: index * 0.035 }} whileHover={{ y: -5 }} className={`group overflow-hidden rounded-2xl border p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg ${darkMode ? "border-slate-700 bg-slate-900" : "border-white bg-white"}`}>
            <div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}><Icon className="h-5 w-5" /></div><span className={`text-xs font-semibold ${label === "Low Stock" || label === "Pending Orders" ? "text-amber-600" : "text-emerald-600"}`}>{note}</span></div>
            <p className="mt-5 text-sm font-medium text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
            <div className={`mt-4 h-1.5 overflow-hidden rounded-full ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}><div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 group-hover:w-5/6`} /></div>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
        <motion.div {...cardMotion} className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "border-slate-700 bg-slate-900" : "border-white bg-white"}`}>
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Revenue analytics</p><h2 className="mt-1 text-xl font-bold">Revenue trend</h2><p className="mt-1 text-sm text-slate-500">Monthly sales performance from completed orders.</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${growthPercentage >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{growthPercentage >= 0 ? "+" : ""}{growthPercentage.toFixed(1)}% vs last month</span></div>
          <div className="mt-8 grid h-56 grid-cols-6 items-end gap-3 border-b border-slate-200 pb-1">
            {revenueSeries.length ? revenueSeries.map((entry) => <div key={entry.month} className="group flex h-full flex-col justify-end gap-2"><span className="text-center text-xs font-semibold text-slate-600 opacity-0 transition group-hover:opacity-100">{formatCurrency(entry.value)}</span><div title={`${entry.month}: ${formatCurrency(entry.value)}`} className="rounded-t-lg bg-gradient-to-t from-orange-500 via-amber-400 to-amber-200 transition-all duration-300 group-hover:brightness-110" style={{ height: `${Math.max(((Number(entry.value) || 0) / maxRevenue) * 165, 5)}px` }} /><span className="text-center text-xs font-medium text-slate-500">{entry.month}</span></div>) : <div className="col-span-full self-center text-center text-sm text-slate-500">Revenue history will appear as orders are placed.</div>}
          </div>
        </motion.div>
        <motion.div {...cardMotion} transition={{ delay: 0.1 }} className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "border-slate-700 bg-slate-900" : "border-white bg-white"}`}>
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Fulfillment</p><h2 className="mt-1 text-xl font-bold">Order status</h2></div><Layers3 className="h-5 w-5 text-teal-600" /></div>
          <div className="mt-6 space-y-4">{orderStatusBreakdown.length ? orderStatusBreakdown.map((entry) => { const percentage = totalStatusOrders ? Math.round((Number(entry.count) / totalStatusOrders) * 100) : 0; return <div key={entry.status}><div className="flex justify-between text-sm"><span className="font-medium">{getStatusLabel(entry.status)}</span><span className="text-slate-500">{entry.count} · {percentage}%</span></div><div className={`mt-2 h-2 overflow-hidden rounded-full ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}><div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-400" style={{ width: `${percentage}%` }} /></div></div>; }) : <p className="text-sm text-slate-500">No order status data yet.</p>}</div>
        </motion.div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className={`overflow-hidden rounded-2xl border shadow-sm ${darkMode ? "border-slate-700 bg-slate-900" : "border-white bg-white"}`}>
          <div className="flex items-center justify-between p-6 pb-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Order management</p><h2 className="mt-1 text-xl font-bold">Recent orders</h2></div><button type="button" onClick={refresh} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Refresh</button></div>
          <div className="overflow-x-auto"><table className="min-w-[760px] w-full text-left text-sm"><thead className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-500"}`}><tr><th className="px-6 py-3">Customer</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{loading ? Array.from({ length: 4 }).map((_, index) => <tr key={index} className="animate-pulse"><td className="px-6 py-5"><div className="h-5 w-36 rounded bg-slate-100" /></td><td colSpan="5" /></tr>) : recentOrders.length ? recentOrders.map((order) => <tr key={order.id} className={`transition ${darkMode ? "hover:bg-slate-800/70" : "hover:bg-orange-50/40"}`}><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 text-xs font-bold text-white">{initials(order.customerName)}</span><div><p className="font-semibold">{order.customerName || "Customer"}</p><p className="text-xs text-slate-500">{order.customerEmail || "No email"}</p></div></div></td><td className="px-4 py-4 font-medium text-slate-600">{order.orderNumber || order.id}</td><td className="px-4 py-4 text-slate-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</td><td className="px-4 py-4 font-semibold">{formatCurrency(order.totalAmount)}</td><td className="px-4 py-4"><Badge label={order.paymentStatus || "Pending"} tone={order.paymentStatus === "paid" ? "success" : "warning"} /></td><td className="px-4 py-4"><Badge label={getStatusLabel(order.orderStatus)} tone={getStatusTone(order.orderStatus)} /></td></tr>) : <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">No recent orders available.</td></tr>}</tbody></table></div>
        </div>
        <div className="space-y-6">
          <div className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "border-slate-700 bg-slate-900" : "border-white bg-white"}`}><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Inventory health</p><h2 className="mt-1 text-xl font-bold">Stock alerts</h2></div><CircleAlert className="h-5 w-5 text-amber-500" /></div><div className="mt-4 space-y-3">{lowStockProducts.length ? lowStockProducts.map((product) => <div key={product.id} className={`rounded-xl border p-3 ${darkMode ? "border-slate-700 bg-slate-800" : "border-amber-100 bg-amber-50/50"}`}><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{product.name || product.title}</p><p className="text-xs text-slate-500">{product.sku || "No SKU"}</p></div><Badge label={`${product.stock} left`} tone="warning" /></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-amber-100"><div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${Math.min(Math.max(Number(product.stock || 0) * 10, 8), 100)}%` }} /></div></div>) : <p className="py-4 text-sm text-slate-500">All products are currently stocked.</p>}</div><Link to="/admin/inventory" className="mt-5 inline-flex text-sm font-bold text-teal-700 hover:text-teal-800">Review inventory <ArrowUpRight className="ml-1 h-4 w-4" /></Link></div>
          <div className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "border-slate-700 bg-slate-900" : "border-white bg-white"}`}><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Quick actions</p><div className="mt-4 grid grid-cols-2 gap-3">{[["Add Product", "/admin/products", PackagePlus], ["Add Category", "/admin/categories", Tag], ["View Orders", "/admin/orders", Truck], ["Inventory", "/admin/inventory", Box], ["Coupons", "/admin/coupons", Gift]].map(([label, to, Icon]) => <Link key={label} to={to} className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-sm ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}><Icon className="h-4 w-4 text-orange-500" />{label}</Link>)}</div></div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "border-slate-700 bg-slate-900" : "border-white bg-white"}`}><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Best sellers</p><h2 className="mt-1 text-xl font-bold">Top selling products</h2><div className="mt-5 space-y-4">{topProducts.length ? topProducts.slice(0, 4).map((product, index) => <div key={`${product.name}-${index}`} className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-300 text-sm font-bold text-white">{initials(product.name)}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{product.name}</p><p className="text-xs text-slate-500">{product.quantity ?? 0} units sold</p></div><span className="text-sm font-bold text-teal-700">#{index + 1}</span></div>) : <p className="py-5 text-sm text-slate-500">Sales rankings will appear after orders are placed.</p>}</div></div>
        <div className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "border-slate-700 bg-slate-900" : "border-white bg-white"}`}><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Customer growth</p><h2 className="mt-1 text-xl font-bold">Recent customers</h2><div className="mt-5 space-y-4">{recentCustomers.length ? recentCustomers.slice(0, 4).map((customer) => <div key={customer.id} className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-pink-400 text-xs font-bold text-white">{initials(customer.name)}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{customer.name || "Customer"}</p><p className="truncate text-xs text-slate-500">{customer.email || "No email"}</p></div><UserCheck className="h-4 w-4 text-emerald-500" /></div>) : <p className="py-5 text-sm text-slate-500">New customer activity will appear here.</p>}</div></div>
        <div className={`rounded-2xl border p-6 shadow-sm ${darkMode ? "border-slate-700 bg-slate-900" : "border-white bg-white"}`}><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Live feed</p><h2 className="mt-1 text-xl font-bold">Recent activity</h2><div className="mt-5 space-y-4 border-l border-slate-200 pl-5">{recentActivities.length ? recentActivities.slice(0, 4).map((activity) => <div key={activity.id} className="relative"><span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-teal-500 ring-4 ring-teal-50" /><p className="text-sm font-semibold">{activity.title}</p><p className="mt-1 text-xs text-slate-500">{activity.detail} · {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : "Just now"}</p></div>) : <p className="py-5 text-sm text-slate-500">Store events will appear here.</p>}</div></div>
      </section>
    </div>
  );
};

export default DashboardPage;
