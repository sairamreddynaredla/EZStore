import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../../context/toast-context";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";
import CategoryFormModal from "../components/CategoryFormModal";
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

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
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

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getCategories(queryParams);
      setCategories(result.items);
      setTotalItems(result.total);
      setCurrentPage(result.page);
      setPageSize(result.pageSize);
    } catch {
      setError("Unable to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormError("");
    setModalVisible(true);
  };

  const openEditModal = async (categoryId) => {
    setFormError("");
    setModalVisible(true);

    try {
      const fetched = await getCategory(categoryId);
      setEditingCategory(fetched);
    } catch {
      setFormError("Failed to load category details.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCategory(null);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError("");

    try {
      if (editingCategory?.id) {
        await updateCategory(editingCategory.id, payload);
        success("Category updated successfully.");
      } else {
        await createCategory(payload);
        success("Category created successfully.");
      }
      closeModal();
      await loadCategories();
    } catch {
      setFormError("Failed to save category. Please review the values and try again.");
      toastError("Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm("Delete this category? This action cannot be undone.");
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteCategory(categoryId);
      success("Category deleted successfully.");
      await loadCategories();
    } catch {
      setError("Unable to delete category. Please try again.");
      toastError("Unable to delete category.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage category collections, banner assets, and active status."
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Add category
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
          placeholder="Search by category name or slug"
          label="Search categories"
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
        columns={["Category", "Slug", "Status", "Banner", "Actions"]}
        emptyMessage="No categories found."
      >
        {categories.map((category) => (
          <tr key={category.id} className="border-t border-slate-100 hover:bg-slate-50">
            <td className="px-5 py-4 align-top">
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">{category.name}</p>
                <p className="text-xs text-slate-500 line-clamp-2">{category.description}</p>
              </div>
            </td>
            <td className="px-5 py-4 align-top text-slate-700">{category.slug}</td>
            <td className="px-5 py-4 align-top">
              <Badge label={category.status === "active" ? "Active" : "Inactive"} tone={STATUS_TAGS[category.status] || "neutral"} />
            </td>
            <td className="px-5 py-4 align-top">
              {category.banner || category.bannerUrl ? (
                <img src={category.banner || category.bannerUrl} alt={category.name} className="h-16 w-24 rounded-2xl object-cover" />
              ) : (
                <span className="text-xs text-slate-400">No banner</span>
              )}
            </td>
            <td className="px-5 py-4 align-top">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(category.id)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category.id)}
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

      <CategoryFormModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSave}
        initialCategory={editingCategory ?? undefined}
        isSaving={saving}
        error={formError}
        title={editingCategory ? "Edit category" : "Add category"}
      />
    </div>
  );
};

export default CategoriesPage;
