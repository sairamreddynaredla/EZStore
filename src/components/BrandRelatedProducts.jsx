import React from "react";
import { resolveProductImage } from "../utils/productImage";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/usecart";

const BrandRelatedProducts = ({ brand, products = [], limit = 4 }) => {
  const { addToCart } = useCart();

  const brandProducts = products
    .filter(
      (p) =>
        String(p.brand || "")
          .trim()
          .toLowerCase() ===
        String(brand || "")
          .trim()
          .toLowerCase()
    )
    .slice(0, limit);

  if (!brandProducts.length) return null;

  return (
    <aside className="w-72 space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-bold mb-2">Related {brand} Products</h4>
        <div className="space-y-3">
          {brandProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded">
              <Link
                to={`/product/${p.id}`}
                className="w-16 h-16 flex-shrink-0 bg-white rounded overflow-hidden flex items-center justify-center"
              >
                <img
                  src={resolveProductImage(p)}
                  alt={p.name}
                  className="w-full h-full object-contain p-1"
                />
              </Link>
              <div className="flex-1">
                <Link
                  to={`/product/${p.id}`}
                  className="text-sm font-semibold text-gray-900 overflow-hidden block"
                  style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                >
                  {p.name}
                </Link>
                <div className="text-sm text-gray-800 font-bold mt-1">
                  ${(p.variants?.[0]?.price ?? p.price ?? 0).toFixed(2)}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart({ ...p, quantity: 1 });
                }}
                className="ml-2 bg-yellow-400 hover:bg-yellow-500 text-sm px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default BrandRelatedProducts;
