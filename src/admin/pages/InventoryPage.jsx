import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../../context/toast-context";
import { getInventory, updateInventoryStock } from "../services/inventoryService";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import FilterGroup from "../components/FilterGroup";
import PageHeader from "../components/PageHeader";

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
  const [savingStock, setSavingStock] = useState({});
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

  const handleSaveStock = async (product) => {
    const newValue = stockUpdates[product.id];
    const nextStock = newValue !== undefined && newValue !== "" ? Number(newValue) : Number(product.stock ?? 0);

    if (Number.isNaN(nextStock) || nextStock < 0) {
      toastError("Stock must be a valid number greater than or equal to 0.");
      return;
    }

    setSavingStock((current) => ({ ...current, [product.id]: true }));
    try {
      await updateInventoryStock(product.id, nextStock);
      success("Stock updated successfully.");
      await loadInventory();
      setStockUpdates((current) => ({ ...current, [product.id]: undefined }));
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
          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
          >
            {STOCK_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
                const stockValue = editedStock !== undefined && editedStock !== "" ? editedStock : currentStock;
                const statusLabel = currentStock === 0 ? "Out of stock" : currentStock < 10 ? "Low stock" : "In stock";
                const statusTone = currentStock === 0 ? "danger" : currentStock < 10 ? "warning" : "success";
                const isSaving = savingStock[product.id];
                const isDirty = String(stockValue) !== String(currentStock);

                return (
                  <tr key={product.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4 align-top">
                      <div className="font-semibold text-slate-900">{product.title || product.name || "Untitled product"}</div>
                      <div className="text-xs text-slate-500">{product.description}</div>
                    </td>
                    <td className="px-5 py-4 align-top text-slate-700">{product.category || "—"}</td>
                    <td className="px-5 py-4 align-top text-slate-700">
                      <input
                        type="number"
                        min="0"
                        value={stockValue}
                        onChange={(event) => handleStockChange(product.id, event.target.value)}
                        className="w-24 rounded-2xl border border-neutral-border bg-slate-50 px-3 py-2 focus:border-primary-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <Badge label={statusLabel} tone={statusTone} />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <button
                        type="button"
                        disabled={!isDirty || isSaving}
                        onClick={() => handleSaveStock(product)}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </td>
                  </tr>
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
