import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../services/productService";
import ProductFormModal from "../components/ProductFormModal";
import PageHeader from "../components/PageHeader";
import Select from "../components/common/Select";
import { resolveAdminProductImage, getAdminImageCandidates } from "../utils/productImage";
import { initSocket, subscribeToProductUpdates } from "../services/socket";

const STATUS_MAP = {
  active: "Active",
  inactive: "Inactive",
  draft: "Draft",
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

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

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getProducts(queryParams);
      setProducts(result.items);
      setTotalItems(result.total);
      setCurrentPage(result.page);
      setPageSize(result.pageSize);
    } catch (fetchError) {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Accept optional overrides to fetch a specific page immediately
  const loadProductsImmediate = async (overrides = {}) => {
    setLoading(true);
    setError("");
    try {
      const params = {
        ...queryParams,
        ...(overrides.page !== undefined ? { page: overrides.page } : {}),
        ...(overrides.limit !== undefined ? { limit: overrides.limit } : {}),
      };
      const result = await getProducts(params);
      setProducts(result.items);
      setTotalItems(result.total);
      setCurrentPage(result.page);
      setPageSize(result.pageSize);
    } catch (fetchError) {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [queryParams]);

  useEffect(() => {
    // init socket and subscribe to product updates
    initSocket();
    const unsub = subscribeToProductUpdates((payload) => {
      try {
        const updated = payload?.product || payload;
        if (!updated || !updated.productId) return;
        setProducts((prev) => prev.map((p) => (p.id === updated.productId ? { ...p, ...updated } : p)));
      } catch (e) {
        // ignore
      }
    });
    return () => unsub && unsub();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormError("");
    setModalVisible(true);
  };

  const openEditModal = async (productId) => {
    setFormError("");
    setModalVisible(true);
    try {
      const fetched = await getProduct(productId);
      setEditingProduct(fetched);
    } catch (fetchError) {
      setFormError("Failed to load product details.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingProduct(null);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError("");
    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      closeModal();
      await loadProducts();
    } catch (saveError) {
      const message = saveError?.response?.data?.message || saveError?.message || "Failed to save product. Please review the values and try again.";
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Delete this product? This action cannot be undone.");
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteProduct(productId);
      await loadProducts();
    } catch (deleteError) {
      setError("Unable to remove product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog, inventory, pricing, and status."
        actions={[
          <button
            key="add-product"
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Add product
          </button>,
        ]}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, brand"
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </label>
          <Select
            label="Status"
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
            options={[
              { value: "", label: "All statuses" },
              ...Object.entries(STATUS_MAP).map(([value, label]) => ({ value, label }))
            ]}
          />
          <Select
            label="Sort"
            value={`${sortBy}:${sortOrder}`}
            onValueChange={(value) => {
              const [field, order] = value.split(":");
              setSortBy(field);
              setSortOrder(order);
            }}
            options={[
              { value: "title:asc", label: "Name A → Z" },
              { value: "title:desc", label: "Name Z → A" },
              { value: "price:asc", label: "Price low → high" },
              { value: "price:desc", label: "Price high → low" },
              { value: "stock:asc", label: "Stock low → high" },
              { value: "stock:desc", label: "Stock high → low" }
            ]}
          />
        </div>
      </div>
      </section>

      {error && <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="overflow-x-auto rounded-3xl border border-neutral-border bg-white shadow-sm">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-3">
                        <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                          {(() => {
                            const src = resolveAdminProductImage(product);
                            const candidates = getAdminImageCandidates(product) || [];
                            if (!src) {
                              return <div className="h-full w-full bg-slate-100" />;
                            }

                            return (
                              <img
                                src={src}
                                alt={product.title || product.name}
                                className="h-full w-full object-cover"
                                data-image-candidates={JSON.stringify(candidates)}
                                data-image-index={0}
                                onError={(event) => {
                                  try {
                                    event.currentTarget.onerror = null;
                                    const raw = event.currentTarget.getAttribute("data-image-candidates");
                                    const idxAttr = event.currentTarget.getAttribute("data-image-index");
                                    const candidatesList = raw ? JSON.parse(raw) : [];
                                    const idx = idxAttr ? Number(idxAttr) : 0;
                                    const next = (idx || 0) + 1;
                                    if (candidatesList && next < candidatesList.length) {
                                      event.currentTarget.setAttribute("data-image-index", String(next));
                                      event.currentTarget.src = candidatesList[next];
                                    } else {
                                      // No more candidates — hide image element (no placeholder)
                                      try { event.currentTarget.style.display = 'none'; } catch(e){}
                                    }
                                  } catch (err) {
                                    try { event.currentTarget.style.display = 'none'; } catch(e){}
                                  }
                                }}
                              />
                            );
                          })()}
                        </div>
                      <div>
                        <p className="font-semibold text-slate-900">{product.title || product.name}</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top text-slate-700">{product.category}</td>
                  <td className="px-5 py-4 align-top text-slate-700">${Number(product.price ?? 0).toFixed(2)}</td>
                  <td className="px-5 py-4 align-top text-slate-700">{product.stock ?? product.rating?.count ?? 0}</td>
                  <td className="px-5 py-4 align-top text-slate-700">{STATUS_MAP[product.status] ?? STATUS_MAP.active}</td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(product.id)}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span>{totalItems} products</span>
          <span className="h-4 w-px bg-slate-200" />
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Show
            <Select
              value={String(pageSize)}
              onValueChange={(value) => setPageSize(Number(value))}
              options={PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: String(size) }))}
              className="h-11 w-24"
              placeholder="Page size"
            />
            per page
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={async () => {
                const newPage = Math.max(1, currentPage - 1);
                setCurrentPage(newPage);
                await loadProductsImmediate({ page: newPage });
              }}
              className="rounded-2xl border border-neutral-border bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={async () => {
                const newPage = Math.min(totalPages, currentPage + 1);
                setCurrentPage(newPage);
                await loadProductsImmediate({ page: newPage });
              }}
              className="rounded-2xl border border-neutral-border bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ProductFormModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSave}
        initialProduct={editingProduct ?? undefined}
        isSaving={saving}
        error={formError}
        title={editingProduct ? "Edit product" : "Add product"}
      />
    </div>
  );
};

export default ProductsPage;
