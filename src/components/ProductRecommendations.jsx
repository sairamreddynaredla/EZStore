import { ShoppingCart, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * ProductRecommendations Component
 * Displays "Frequently bought together" recommendations
 * Increases average order value by suggesting complementary products
 */
const ProductRecommendations = ({ currentItemId, onAddToCart }) => {
  const navigate = useNavigate();

  // Sample recommendations - in production this would come from an API based on currentItemId
  const recommendations = [
    {
      id: 101,
      name: "Premium Pet Grooming Brush",
      price: 24.99,
      image: "/assets/products/grooming-brush.jpg",
      purchased_with: 89, // % of customers who bought this with similar items
    },
    {
      id: 102,
      name: "Pet Food Storage Container",
      price: 34.99,
      image: "/assets/products/storage.jpg",
      purchased_with: 76,
    },
    {
      id: 103,
      name: "Dental Chew Treats",
      price: 14.99,
      image: "/assets/products/dental-treats.jpg",
      purchased_with: 65,
    },
  ];

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-lg">🛒</span>
        Frequently bought together
      </h3>

      <div className="space-y-3">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="flex gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-400 transition-colors"
          >
            {/* Product Image */}
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-1"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                {product.name}
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                {product.purchased_with}% bought with similar items
              </p>
              <p className="text-sm font-bold text-red-600">${product.price.toFixed(0)}</p>
            </div>

            {/* Add Button */}
            <div className="flex flex-col gap-2 justify-center">
              <button
                onClick={() => onAddToCart(product)}
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
