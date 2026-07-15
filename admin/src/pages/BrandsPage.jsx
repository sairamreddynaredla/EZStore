import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../context/toast-context";
import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
} from "../services/brandService";
import BrandFormModal from "../components/BrandFormModal";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import FilterGroup from "../components/FilterGroup";
import TableShell from "../components/TableShell";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const STATUS_TAGS = {
  active: "success",
  inactive: "neutral",
};

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
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

  const loadBrands = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getBrands(queryParams);
      setBrands(result.items);
      setTotalItems(result.total);
      setCurrentPage(result.page);
      setPageSize(result.pageSize);
    } catch {
      setError("Unable to load brands. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormError("");
    setModalVisible(true);
  };

  const openEditModal = async (brandId) => {
    setFormError("");
    setModalVisible(true);

    try {
      const fetched = await getBrand(brandId);
      setEditingBrand(fetched);
    } catch {
      setFormError("Failed to load brand details.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingBrand(null);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError("");

    try {
      if (editingBrand?.id) {
        await updateBrand(editingBrand.id, payload);
        success("Brand updated successfully.");
      } else {
        await createBrand(payload);
        success("Brand created successfully.");
      }
      closeModal();
      await loadBrands();
    } catch {
      setFormError("Failed to save brand. Please review the values and try again.");
      toastError("Unable to save brand.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (brandId) => {
    const confirmed = window.confirm("Delete this brand? This action cannot be undone.");
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteBrand(brandId);
      success("Brand deleted successfully.");
      await loadBrands();
    } catch {
      setError("Unable to delete brand. Please try again.");
      toastError("Unable to delete brand.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brands"
        description="Manage brand collections, naming, and visibility for your catalog."
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Add brand
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
            placeholder="Search by brand name or slug"
            label="Search brands"
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

      <TableShell loading={loading} columns={["Brand", "Slug", "Status", "Actions"]} emptyMessage="No brands found.">
        {brands.map((brand) => (
          <tr key={brand.id} className="border-t border-slate-100 hover:bg-slate-50">
            <td className="px-5 py-4 align-top">
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">{brand.name}</p>
                <p className="text-xs text-slate-500 line-clamp-2">{brand.description}</p>
              </div>
            </td>
            <td className="px-5 py-4 align-top text-slate-700">{brand.slug}</td>
            <td className="px-5 py-4 align-top">
              <Badge label={brand.status === "active" ? "Active" : "Inactive"} tone={STATUS_TAGS[brand.status] || "neutral"} />
            </td>
            <td className="px-5 py-4 align-top">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(brand.id)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(brand.id)}
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

      <BrandFormModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSave}
        initialBrand={editingBrand ?? undefined}
        isSaving={saving}
        error={formError}
        title={editingBrand ? "Edit brand" : "Add brand"}
      />
    </div>
  );
};

export default BrandsPage;
