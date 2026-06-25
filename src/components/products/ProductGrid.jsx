import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  products = [],
  onAddToCart,
  onWishlistToggle,
  loading = false,
  emptyMessage = "No products found",
  onVisibleProductChange, // (product) => void
}) => {
  if (!loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 w-full rounded-[28px] border border-dashed border-slate-300 bg-white p-10">
        <p className="text-lg font-medium text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  // Refs for observer
  const itemRefs = React.useRef([]);

  React.useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, products.length);
  }, [products.length]);

  React.useEffect(() => {
    if (!onVisibleProductChange || products.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        // pick the entry with largest intersectionRatio
        let best = null;
        entries.forEach((e) => {
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
        });
        if (best && best.target && best.target.dataset && best.target.dataset.index) {
          const idx = Number(best.target.dataset.index);
          const prod = products[idx];
          if (prod) onVisibleProductChange(prod);
        }
      },
      { root: null, rootMargin: "0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [onVisibleProductChange, products]);

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {loading
        ? Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm animate-pulse"
            >
              <div className="h-72 bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 bg-slate-200 rounded-full" />
                <div className="h-4 bg-slate-200 rounded-full" />
                <div className="h-8 w-1/2 bg-slate-200 rounded-full" />
                <div className="h-12 bg-slate-200 rounded-full" />
              </div>
            </div>
          ))
        : products.map((product, idx) => (
            <div key={product.id} data-index={idx} ref={(el) => (itemRefs.current[idx] = el)}>
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onWishlistToggle={onWishlistToggle}
              />
            </div>
          ))}
    </div>
  );
};

export default ProductGrid;
