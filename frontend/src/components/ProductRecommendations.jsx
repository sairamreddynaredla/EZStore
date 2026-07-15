import { ShoppingCart, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useRecommendedProducts } from "../hooks/useRecommendedProducts";
import placeholderImage from "../assets/products/placeholder.svg";

/**
 * ProductRecommendations Component
 * Displays "Frequently bought together" recommendations with real-time updates
 * Increases average order value by suggesting complementary products
 */
const ProductRecommendations = ({ currentItemId, onAddToCart }) => {
  const navigate = useNavigate();
  
  // Initialize socket connection
  useSocket();
  
  // Get real-time recommended products
  const { data: recommendations, loading, error, isLive } = useRecommendedProducts(currentItemId, 5);

  if (!currentItemId) return null;
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return null;
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-lg">🛒</span>
        Frequently bought together
        {isLive && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full animate-pulse">Live</span>}
      </h3>

      <div className="space-y-3">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="flex gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-400 transition-colors"
          >
            {/* Product Image */}
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img
                src={product.imageUrl || placeholderImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                {product.name}
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                {product.category || "Product"}
              </p>
              <p className="text-sm font-bold text-red-600">₹{Number(product.price).toFixed(2)}</p>
            </div>

            {/* Add Button */}
            <div className="flex flex-col gap-2 justify-center">
              <button
                onClick={() => onAddToCart && onAddToCart(product)}
                className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded text-xs transition-colors whitespace-nowrap"
              >
                Add
              </button>
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="px-2 py-1 text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1"
              >
                View <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total savings message */}
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-blue-700 font-semibold">
          💡 Tip: Bundle these items to unlock additional discounts!
        </p>
      </div>
    </div>
  );
};

export default ProductRecommendations;
