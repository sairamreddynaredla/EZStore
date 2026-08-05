import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Layers,
  ShoppingBag,
  Users,
  PackagePlus,
  Tag,
  Star,
  ShieldCheck,
  Settings2,
  LogOut,
  Menu,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAdminAuth } from "../hooks/useAdminAuth";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", icon: Box },
  { label: "Categories", to: "/admin/categories", icon: Layers },
  { label: "Brands", to: "/admin/brands", icon: Tag },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Inventory", to: "/admin/inventory", icon: PackagePlus },
  { label: "Coupons", to: "/admin/coupons", icon: Tag },
  { label: "Reviews", to: "/admin/reviews", icon: Star },
  { label: "Users", to: "/admin/users", icon: ShieldCheck },
  { label: "Settings", to: "/admin/settings", icon: Settings2 },
];

const SidebarLink = ({ to, label, Icon, onClick, showLabel, collapsed }) => (
  <NavLink
    to={to}
    end={to === "/admin"}
    onClick={onClick}
    className={({ isActive }) =>
      `group flex h-12 items-center gap-3 rounded-2xl py-3 text-base font-medium transition-colors duration-200 ${
        collapsed ? "justify-center px-0" : "px-4"
      } ${
        isActive
          ? "bg-primary-600 text-white shadow-md shadow-primary-950/30"
          : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
      }`
    }
  >
    <Icon className="h-5 w-5 shrink-0" />
    <span className={`transition ${showLabel ? "block" : "hidden"}`}>{label}</span>
  </NavLink>
);

const AdminLayout = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const showSidebarLabels = sidebarOpen || !sidebarCollapsed;

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      <div className="lg:flex lg:min-h-screen">
        <aside
          className={`fixed inset-0 z-40 flex flex-col border-b border-slate-200 bg-slate-950 px-4 text-white shadow-sm transition duration-200 ease-out ${sidebarOpen ? "block h-screen w-full" : "hidden"} lg:fixed lg:left-0 lg:top-0 lg:block lg:h-screen lg:overflow-x-hidden lg:overflow-y-auto ${
            sidebarCollapsed ? "lg:w-20 lg:px-2" : "lg:w-72"
          }`}
          aria-label="Admin sidebar"
        >
          <div className={`flex min-h-24 items-center justify-between gap-3 border-b border-slate-800/80 py-4 ${sidebarCollapsed ? "lg:justify-center" : ""}`}>
            <div className="flex min-w-0 items-center">
              <div className={`flex items-center justify-center ${sidebarCollapsed ? "h-11 w-11" : "h-auto w-48"}`}>
                <span className={`text-white font-bold tracking-tight ${sidebarCollapsed ? "text-base" : "text-xl"}`}>
                  {sidebarCollapsed ? "EZ" : "EZSTORE"}
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-2 ${sidebarCollapsed ? "lg:w-full lg:justify-center" : ""}`}>
              <button
                type="button"
                className="lg:hidden rounded-2xl border border-slate-700 p-3 text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                onClick={() => setSidebarOpen((value) => !value)}
                aria-expanded={sidebarOpen}
                aria-label="Toggle navigation"
              >
                <Menu size={18} />
              </button>
              <button
                type="button"
                onClick={() => setSidebarCollapsed((value) => !value)}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 lg:inline-flex"
              >
                {sidebarCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
              </button>
            </div>
          </div>

          <nav
            className={`overflow-y-auto transition-all ${sidebarOpen ? "block" : "hidden"} lg:block lg:mt-5`}
            aria-label="Primary admin navigation"
          >
            <div className={`space-y-1.5 ${sidebarCollapsed ? "items-center" : "items-stretch"}`}>
              {NAV_ITEMS.map((item) => (
                <SidebarLink
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  Icon={item.icon}
                  onClick={() => setSidebarOpen(false)}
                  showLabel={showSidebarLabels}
                  collapsed={sidebarCollapsed}
                />
              ))}
            </div>
          </nav>
        </aside>

        {sidebarOpen ? (
          <div
            className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        ) : null}

        <main className={`flex-1 min-w-0 lg:min-h-screen lg:pb-10 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-slate-50 px-4 shadow-sm shadow-slate-200/40 lg:hidden">
            <div>
              <p className="text-sm text-slate-500">EZStore Admin</p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm"
            >
              <Menu size={18} />
            </button>
          </header>

          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
            <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Welcome back,</p>
                  <h1 className="text-2xl font-semibold text-slate-900">{user?.name || "Administrator"}</h1>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <p className="text-sm text-slate-500">Signed in as</p>
                  <p className="text-sm font-medium text-slate-900">{user?.email || "admin@ezstore.com"}</p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
