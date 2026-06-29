import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../../context/toast-context";
import { createCoupon, deleteCoupon, getCoupon, getCoupons, updateCoupon } from "../services/couponService";
import CouponFormModal from "../components/CouponFormModal";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import FilterGroup from "../components/FilterGroup";
import Pagination from "../components/Pagination";
import TableShell from "../components/TableShell";
import Badge from "../components/Badge";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const STATUS_TAGS = {
  active: "success",
  inactive: "neutral",
};

const STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
};

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const { success, error: toastError } = useToast();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      q: search || undefined,
      status: statusFilter || undefined,
    }),
    [currentPage, pageSize, search, statusFilter]
  );

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getCoupons(queryParams);
      setCoupons(result.items);
      setTotalItems(result.total);
      setCurrentPage(result.page);
      setPageSize(result.pageSize);
    } catch {
      setError("Unable to load coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormError("");
    setModalVisible(true);
  };

  const openEditModal = async (couponId) => {
    setFormError("");
    setModalVisible(true);
    try {
      const coupon = await getCoupon(couponId);
      setEditingCoupon(coupon);
    } catch {
      setFormError("Unable to load coupon details.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCoupon(null);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError("");

    try {
      if (editingCoupon?.id) {
        await updateCoupon(editingCoupon.id, payload);
        success("Coupon updated successfully.");
      } else {
        await createCoupon(payload);
        success("Coupon created successfully.");
      }
      closeModal();
      await loadCoupons();
    } catch {
      setFormError("Failed to save coupon. Please review the values and try again.");
      toastError("Unable to save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (couponId) => {
    const confirmed = window.confirm("Delete this coupon? This action cannot be undone.");
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteCoupon(couponId);
      success("Coupon deleted successfully.");
      await loadCoupons();
    } catch {
      setError("Unable to delete coupon. Please try again.");
      toastError("Unable to delete coupon.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Create and manage coupon codes, discounts, and expiration settings."
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Add coupon
          </button>
        }
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto]">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search by code or description"
          label="Search coupons"
        />

        <FilterGroup label="Status">
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterGroup>
      </div>
      </section>

      {error && <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <TableShell
        loading={loading}
        columns={["Code", "Discount", "Expires", "Usage", "Status", "Actions"]}
        emptyMessage="No coupons found."
      >
        {coupons.map((coupon) => (
          <tr key={coupon.id} className="border-t border-slate-100 hover:bg-slate-50">
            <td className="px-5 py-4 align-top font-semibold text-slate-900">{coupon.code}</td>
            <td className="px-5 py-4 align-top text-slate-700">
              {coupon.shippingDiscount
                ? "Free shipping"
                : coupon.discountType === "amount"
                ? `$${Number(coupon.discount ?? 0).toFixed(2)} off`
                : `${Number(coupon.discount ?? 0).toFixed(0)}% off`}
            </td>
            <td className="px-5 py-4 align-top text-slate-700">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}</td>
            <td className="px-5 py-4 align-top text-slate-700">{coupon.usageLimit ?? "Unlimited"}</td>
            <td className="px-5 py-4 align-top">
              <Badge label={STATUS_LABELS[coupon.status] ?? "Unknown"} tone={STATUS_TAGS[coupon.status] || "neutral"} />
            </td>
            <td className="px-5 py-4 align-top">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(coupon.id)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(coupon.id)}
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </TableShell>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <CouponFormModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSave}
        initialCoupon={editingCoupon ?? undefined}
        isSaving={saving}
        error={formError}
        title={editingCoupon ? "Edit coupon" : "Add coupon"}
      />
    </div>
  );
};

export default CouponsPage;
