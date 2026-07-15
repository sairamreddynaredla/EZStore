import React, { useMemo } from "react";
import { resolveProductImage } from "../utils/productImage";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/usecart";
import { useSocket } from "../hooks/useSocket";
import { useRealtimeProductPrice } from "../hooks/useRealtimeProductPrice";

const BrandRelatedProducts = ({ brand, products = [], limit = 4 }) => {
  const { addToCart } = useCart();
  
  // Initialize socket connection
  useSocket();

  const brandProducts = useMemo(
    () =>
      products
        .filter(
          (p) =>
            String(p.brand || "")
              .trim()
              .toLowerCase() ===
            String(brand || "")
              .trim()
              .toLowerCase()
        )
        .slice(0, limit),
    [products, brand, limit]
  );

  if (!brandProducts.length) return null;

  return (
    <aside className="w-72 space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="font-bold mb-2">Related {brand} Products</h4>
        <div className="space-y-3">
          {brandProducts.map((p) => (
            <BrandProductItem key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>
      </div>
    </aside>
  );
};

/**
 * Individual product item with real-time price updates
 */
const BrandProductItem = ({ product, onAddToCart }) => {
  // Get real-time price for this product
  const realtimePrice = useRealtimeProductPrice(product.id, {
    price: product.price,
    originalPrice: product.originalPrice,
  });

  const displayPrice = realtimePrice.price !== 0 ? realtimePrice.price : (product.variants?.[0]?.price ?? product.price ?? 0);

  return (
    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors">
      <Link
        to={`/product/${product.id}`}
        className="w-16 h-16 flex-shrink-0 bg-white rounded overflow-hidden flex items-center justify-center"
      >
        <img
          src={resolveProductImage(product)}
          alt={product.name}
          className="w-full h-full object-contain p-1"
        />
      </Link>
      <div className="flex-1">
        <Link
          to={`/product/${product.id}`}
          className="text-sm font-semibold text-gray-900 overflow-hidden block"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
        >
          {product.name}
        </Link>
        <div className={`text-sm text-gray-800 font-bold mt-1 ${realtimePrice.isUpdating ? "animate-pulse" : ""}`}>
          ₹{displayPrice.toFixed(2)}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddToCart({ ...product, quantity: 1 });
        }}
        className="ml-2 bg-yellow-400 hover:bg-yellow-500 text-sm px-3 py-1 rounded"
      >
        Add
      </button>
    </div>
  );
};

export default BrandRelatedProducts;
