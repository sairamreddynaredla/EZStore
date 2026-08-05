import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../context/toast-context";
import { getInventory, getInventoryHistory, updateInventoryStock } from "../services/inventoryService";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import FilterGroup from "../components/FilterGroup";
import PageHeader from "../components/PageHeader";
import Select from "../components/common/Select";

const STOCK_FILTERS = [
  { value: "all", label: "All products" },
  { value: "low", label: "Low stock (< 10)" },
  { value: "out", label: "Out of stock" },
];

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [stockUpdates, setStockUpdates] = useState({});
  const [adjustmentDrafts, setAdjustmentDrafts] = useState({});
  const [savingStock, setSavingStock] = useState({});
  const [historyProductId, setHistoryProductId] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const { success, error: toastError } = useToast();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      q: search || undefined,
      sortBy: "stock",
      order: "asc",
    }),
    [currentPage, pageSize, search]
  );

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getInventory(queryParams);
      setProducts(result.items);
      setTotalItems(result.total);
      setCurrentPage(result.page);
      setPageSize(result.pageSize);
    } catch {
      setError("Unable to load inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const stock = Number(product.stock ?? 0);
      if (stockFilter === "low") return stock > 0 && stock < 10;
      if (stockFilter === "out") return stock === 0;
      return true;
    });
  }, [products, stockFilter]);

  const lowStockCount = useMemo(
    () => products.filter((product) => Number(product.stock ?? 0) > 0 && Number(product.stock ?? 0) < 10).length,
    [products]
  );

  const outOfStockCount = useMemo(
    () => products.filter((product) => Number(product.stock ?? 0) === 0).length,
    [products]
  );

  const handleStockChange = (productId, value) => {
    setStockUpdates((current) => ({ ...current, [productId]: value }));
  };

  const handleAdjustmentChange = (productId, field, value) => {
    setAdjustmentDrafts((current) => ({
      ...current,
      [productId]: {
        type: current[productId]?.type || "set",
        value: current[productId]?.value ?? "",
        reason: current[productId]?.reason ?? "",
        ...(field === "type" ? { type: value } : {}),
        ...(field === "value" ? { value } : {}),
        ...(field === "reason" ? { reason: value } : {}),
      },
    }));
  };

  const handleOpenHistory = async (product) => {
    if (historyProductId === product.id) {
      setHistoryProductId(null);
      setHistoryItems([]);
      setHistoryError("");
      return;
    }

    setHistoryProductId(product.id);
    setHistoryLoading(true);
    setHistoryError("");

    try {
      const result = await getInventoryHistory(product.id, { page: 1, limit: 10 });
      setHistoryItems(result.items || []);
    } catch {
      setHistoryError("Unable to load stock history. Please try again.");
      setHistoryItems([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSaveStock = async (product) => {
    const draft = adjustmentDrafts[product.id] || { type: "set", value: "", reason: "" };
    const currentStock = Number(product.stock ?? 0);

    const payload = (() => {
      if (draft.type === "set") {
        const newValue = stockUpdates[product.id];
        const nextStock = newValue !== undefined && newValue !== "" ? Number(newValue) : currentStock;

        if (Number.isNaN(nextStock) || nextStock < 0) {
          return null;
        }

        return { stock: nextStock, reason: draft.reason.trim() || undefined };
      }

      const delta = Number(draft.value ?? 0);
      if (Number.isNaN(delta) || delta < 0) {
        return null;
      }

      return { stockDelta: delta, type: draft.type, reason: draft.reason.trim() || undefined };
    })();

    if (!payload) {
      toastError("Stock must be a valid number greater than or equal to 0.");
      return;
    }

    setSavingStock((current) => ({ ...current, [product.id]: true }));
    try {
      await updateInventoryStock(product.id, payload);
      success(draft.type === "set" ? "Stock updated successfully." : draft.type === "increase" ? "Stock increased successfully." : "Stock decreased successfully.");
      await loadInventory();
      setStockUpdates((current) => ({ ...current, [product.id]: undefined }));
      setAdjustmentDrafts((current) => ({
        ...current,
        [product.id]: { type: "set", value: "", reason: "" },
      }));
    } catch {
      toastError("Unable to update stock. Please try again.");
    } finally {
      setSavingStock((current) => ({ ...current, [product.id]: false }));
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Track stock levels and update product quantities quickly."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Products</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{totalItems}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Low stock</p>
              <p className="mt-3 text-3xl font-semibold text-amber-700">{lowStockCount}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Out of stock</p>
              <p className="mt-3 text-3xl font-semibold text-rose-700">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_auto]">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search products by name or category"
          label="Search inventory"
        />

        <FilterGroup label="Stock filter">
          <Select
            value={stockFilter}
            onValueChange={(value) => setStockFilter(value)}
            options={STOCK_FILTERS}
            placeholder="Filter stock"
          />
        </FilterGroup>
      </div>

      {error && (
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      )}

      <div className="overflow-x-auto rounded-3xl border border-neutral-border bg-white shadow-sm">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  Loading inventory...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  No inventory items found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const currentStock = Number(product.stock ?? 0);
                const editedStock = stockUpdates[product.id];
                const draft = adjustmentDrafts[product.id] || { type: "set", value: "", reason: "" };
                const stockValue = editedStock !== undefined && editedStock !== "" ? editedStock : currentStock;
                const statusLabel = currentStock === 0 ? "Out of stock" : currentStock < 10 ? "Low stock" : "In stock";
                const statusTone = currentStock === 0 ? "danger" : currentStock < 10 ? "warning" : "success";
                const isSaving = savingStock[product.id];
                const isDirty = draft.type === "set"
                  ? String(stockValue) !== String(currentStock)
                  : draft.value !== "" && Number(draft.value) >= 0;

                return (
                  <Fragment key={product.id}>
                    <tr className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-4 align-top">
                        <div className="font-semibold text-slate-900">{product.title || product.name || "Untitled product"}</div>
                        <div className="text-xs text-slate-500">{product.description}</div>
                      </td>
                      <td className="px-5 py-4 align-top text-slate-700">{product.category || "—"}</td>
                      <td className="px-5 py-4 align-top text-slate-700">
                        <div className="space-y-2">
                          <input
                            type="number"
                            min="0"
                            value={stockValue}
                            onChange={(event) => handleStockChange(product.id, event.target.value)}
                            className="w-24 rounded-2xl border border-neutral-border bg-slate-50 px-3 py-2 appearance-none focus:border-primary-500 focus:outline-none"
                          />
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="w-24">
                              <Select
                                value={draft.type}
                                onValueChange={(value) => handleAdjustmentChange(product.id, "type", value)}
                                options={[
                                  { value: "set", label: "Set" },
                                  { value: "increase", label: "Increase" },
                                  { value: "decrease", label: "Decrease" },
                                ]}
                                placeholder="Set"
                              />
                            </div>
                            <input
                              type="number"
                              min="0"
                              placeholder={draft.type === "set" ? "New stock" : "Amount"}
                              value={draft.value}
                              onChange={(event) => handleAdjustmentChange(product.id, "value", event.target.value)}
                              className="w-28 rounded-2xl border border-neutral-border bg-slate-50 px-3 py-2 appearance-none focus:border-primary-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Reason"
                              value={draft.reason}
                              onChange={(event) => handleAdjustmentChange(product.id, "reason", event.target.value)}
                              style={{ minWidth: 140 }}
                              className="flex-1 rounded-2xl border border-neutral-border bg-slate-50 px-3 py-2 focus:border-primary-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <Badge label={statusLabel} tone={statusTone} />
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={!isDirty || isSaving}
                            onClick={() => handleSaveStock(product)}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenHistory(product)}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
                          >
                            {historyProductId === product.id ? "Hide history" : "History"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {historyProductId === product.id ? (
                      <tr key={`${product.id}-history`}>
                        <td colSpan={5} className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">Stock history</p>
                                <p className="text-xs text-slate-500">Recent inventory adjustments for {product.title || product.name || "this product"}.</p>
                              </div>
                            </div>
                            {historyLoading ? (
                              <p className="text-sm text-slate-500">Loading stock history...</p>
                            ) : historyError ? (
                              <p className="text-sm text-rose-600">{historyError}</p>
                            ) : historyItems.length === 0 ? (
                              <p className="text-sm text-slate-500">No stock activity has been recorded yet.</p>
                            ) : (
                              <ul className="space-y-2">
                                {historyItems.map((entry) => (
                                  <li key={entry.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                                    <span>
                                      <span className="font-semibold">{entry.label}</span>
                                      {entry.reason ? ` · ${entry.reason}` : ""}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {entry.change > 0 ? "+" : ""}{entry.change} · {new Date(entry.createdAt).toLocaleString()}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default InventoryPage;
