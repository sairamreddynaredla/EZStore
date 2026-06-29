import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../../context/toast-context";
import {
  getCustomer,
  getCustomers,
  updateCustomerStatus,
} from "../services/customerService";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import CustomerDetailsModal from "../components/CustomerDetailsModal";
import PageHeader from "../components/PageHeader";

const CUSTOMER_STATUSES = ["active", "blocked"];
const STATUS_LABELS = {
  active: "Active",
  blocked: "Blocked",
};
const STATUS_TONES = {
  active: "success",
  blocked: "danger",
};
const SORT_OPTIONS = [
  { value: "name:asc", label: "Name A → Z" },
  { value: "name:desc", label: "Name Z → A" },
  { value: "totalOrders:desc", label: "Most orders" },
  { value: "totalOrders:asc", label: "Fewest orders" },
  { value: "totalSpent:desc", label: "Highest spend" },
  { value: "totalSpent:asc", label: "Lowest spend" },
  { value: "registeredAt:desc", label: "Newest" },
  { value: "registeredAt:asc", label: "Oldest" },
];

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const { success, error: toastError } = useToast();
  const debouncedSearch = useRef(debounce((value) => setSearch(value), 400)).current;

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      q: search || undefined,
      status: statusFilter || undefined,
      sortBy,
      order: sortOrder,
    }),
    [currentPage, pageSize, search, statusFilter, sortBy, sortOrder]
  );

  const loadCustomers = useCallback(async () => {
    setPageLoading(true);
    setError("");
    try {
      const result = await getCustomers(queryParams);
      setCustomers(result.items);
      setTotalItems(result.total);
      setCurrentPage(result.page);
      setPageSize(result.pageSize);
    } catch {
      setError("Unable to load customers. Please try again.");
    } finally {
      setPageLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const executeLoad = async () => {
      await loadCustomers();
    };

    executeLoad();
  }, [loadCustomers]);

  const openCustomerDetails = async (customerId) => {
    setDetailsError("");
    setModalVisible(true);
    setDetailsLoading(true);
    try {
      const customer = await getCustomer(customerId);
      setSelectedCustomer(customer);
    } catch {
      setDetailsError("Unable to load customer details.");
      toastError("Unable to load customer details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeCustomerDetails = () => {
    setModalVisible(false);
    setSelectedCustomer(null);
    setDetailsError("");
  };

  const handleStatusUpdate = async (customerId, currentStatus) => {
    const nextStatus = currentStatus === "blocked" ? "active" : "blocked";
    const confirmed = window.confirm(
      `Are you sure you want to ${nextStatus === "blocked" ? "block" : "unblock"} this customer?`
    );
    if (!confirmed) return;

    setStatusUpdating(true);
    try {
      await updateCustomerStatus(customerId, nextStatus);
      success(`Customer ${nextStatus === "blocked" ? "blocked" : "unblocked"} successfully.`);
      await loadCustomers();
      if (selectedCustomer?.id === customerId || selectedCustomer?.customerId === customerId) {
        setSelectedCustomer((current) => ({ ...current, status: nextStatus }));
      }
    } catch (updateError) {
      toastError(updateError.response?.data?.message || "Unable to update customer status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const formatCurrency = (value) => `$${Number(value ?? 0).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Search customer profiles, view recent orders, and manage account status."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Search</span>
            <input
              type="text"
              placeholder="Name, email, or phone"
              onChange={(event) => debouncedSearch(event.target.value)}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            >
              <option value="">All statuses</option>
              {CUSTOMER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
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
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Phone</th>
              <th className="px-5 py-4">Orders</th>
              <th className="px-5 py-4">Spend</th>
              <th className="px-5 py-4">Registered</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <tr key={index} className="animate-pulse border-t border-slate-100 bg-slate-100">
                  <td colSpan={8} className="h-16 px-5 py-4" />
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-slate-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const id = customer.id ?? customer.customerId;
                const name = customer.name || `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "—";
                const email = customer.email || customer.contactEmail || "—";
                const phone = customer.phone || customer.contactPhone || "—";
                const totalOrders = customer.totalOrders ?? customer.orderCount ?? customer.orders?.length ?? 0;
                const totalSpent = customer.totalSpent ?? customer.lifetimeValue ?? customer.spending ?? 0;
                const registered = customer.registeredAt || customer.createdAt || "";
                const status = customer.status || (customer.blocked ? "blocked" : "active") || "active";

                return (
                  <tr key={id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">{name}</td>
                    <td className="px-5 py-4 text-slate-700">{email}</td>
                    <td className="px-5 py-4 text-slate-700">{phone}</td>
                    <td className="px-5 py-4 text-slate-700">{totalOrders}</td>
                    <td className="px-5 py-4 text-slate-700">{formatCurrency(totalSpent)}</td>
                    <td className="px-5 py-4 text-slate-700">{registered ? new Date(registered).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-4">
                      <Badge label={STATUS_LABELS[status]} tone={STATUS_TONES[status] || "neutral"} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openCustomerDetails(id)}
                          className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(id, status)}
                          className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
                        >
                          {status === "blocked" ? "Unblock" : "Block"}
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

      <CustomerDetailsModal
        visible={modalVisible}
        customer={selectedCustomer}
        loading={detailsLoading}
        error={detailsError}
        onClose={closeCustomerDetails}
        onStatusToggle={() =>
          selectedCustomer && handleStatusUpdate(selectedCustomer.id ?? selectedCustomer.customerId, selectedCustomer.status || (selectedCustomer.blocked ? "blocked" : "active"))
        }
        statusUpdating={statusUpdating}
      />
    </div>
  );
};

export default CustomersPage;
