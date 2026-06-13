import { X, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import RatingStars from "./RatingStars";
import PriceSection from "./PriceSection";
import AddToCartButton from "./AddToCartButton";
import {
  resolveProductImage,
  resolveProductImageFallback,
} from "../../utils/productImage";

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageSrc, setImageSrc] = useState(resolveProductImage(product));

  useEffect(() => {
    setImageSrc(resolveProductImage(product));
  }, [product]);

  if (!isOpen || !product) return null;

  const variant = product.variants?.[selectedVariant] || {};
  const price = variant.price || 0;
  const originalPrice = variant.originalPrice || 0;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Quick View
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-6 p-4 md:p-8">
          {/* IMAGE */}
          <div className="flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6">
            <img
              src={imageSrc}
              alt={product.name}
              className="max-h-96 object-contain"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                const fallbackImage = resolveProductImageFallback(product);
                if (imageSrc !== fallbackImage) {
                  setImageSrc(fallbackImage);
                }
              }}
            />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col gap-4">
            {/* BRAND */}
            <div>
              <p className="text-sm text-gray-500 uppercase font-semibold">
                {product.brand}
              </p>
            </div>

            {/* TITLE */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              {product.name}
            </h3>

            {/* RATING */}
            <RatingStars
              rating={product.rating || 0}
              reviewCount={product.reviews || 0}
            />

            {/* PRICE */}
            <PriceSection price={price} originalPrice={originalPrice} />

            {/* VARIANTS */}
            {product.variants && product.variants.length > 1 && (
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-gray-900">
                  Select Size/Weight
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(idx)}
                      className={`py-2 px-3 rounded-lg border-2 transition-all ${
                        selectedVariant === idx
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-medium">{v.weight}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-900">
                Quantity
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* STOCK STATUS */}
            {product.stock <= 0 ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
                Out of Stock
              </div>
            ) : product.stock < 10 ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm font-medium">
                Only {product.stock} left in stock
              </div>
            ) : null}

            {/* BUTTONS */}
            <div className="flex gap-3 pt-4">
              <AddToCartButton
                product={product}
                isOutOfStock={product.stock <= 0}
                onAddToCart={onAddToCart}
                quantity={quantity}
              />
              <button className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:border-red-500 hover:text-red-500 transition-all flex items-center justify-center gap-2">
                <Heart size={20} />
                Wishlist
              </button>
            </div>

            {/* FEATURES */}
            {product.features && product.features.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Key Features
                </p>
                <ul className="space-y-2">
                  {product.features.slice(0, 3).map((feature, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-orange-500 mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
