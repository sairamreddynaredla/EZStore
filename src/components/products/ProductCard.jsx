import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { useWishlist } from "../../context/usewishlist";
import {
  resolveProductImage,
  resolveProductImageFallback,
} from "../../utils/productImage";

const ProductCard = ({ product, onAddToCart, onWishlistToggle }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Selected variant state — default to first variant
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [imageSrc, setImageSrc] = useState(resolveProductImage(product));

  useEffect(() => {
    setImageSrc(resolveProductImage(product));
  }, [product]);

  // Reset selected variant when product changes (e.g., new listing data)
  useEffect(() => {
    setSelectedVariantIdx(0);
  }, [product?.id]);

  const variants = product.variants || [];
  const selectedVariant = variants[selectedVariantIdx] || variants[0] || {};

  const currentPrice   = Number(selectedVariant.price ?? product.price ?? 0);
  const originalPrice  = Number(selectedVariant.originalPrice ?? product.originalPrice ?? 0);
  const discount       = originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const isOutOfStock = (product.stock ?? 1) <= 0;
  const wishlisted   = isInWishlist(product.id);

  const navigate = useNavigate();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) removeFromWishlist(product.id);
    else addToWishlist(product);
    if (onWishlistToggle) onWishlistToggle(product, !wishlisted);
  };

  const handleVariantClick = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariantIdx(idx);
  };

  // For AddToCartButton — pass the selected variant on the product
  const productWithVariant = { ...product, selectedVariant };

  return (
    <Link
      to={`/product/${product.id}`}
      state={{ product }}
      className="group relative flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* ── TOP BANNER ── */}
      <div className="bg-[#1B3A6B] text-white text-[11px] font-medium text-center py-2 px-3 tracking-wide">
        Enjoy offers on Checkout!
      </div>

      {/* ── IMAGE AREA — fixed 1:1 aspect ratio so all cards align ── */}
      <div className="relative bg-white px-2 sm:px-4 pt-2 sm:pt-4 pb-1 sm:pb-2">
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-sm hover:scale-110 hover:bg-white shadow-md hover:shadow-lg transition-all"
          aria-label="Wishlist"
        >
          <Heart
            size={20}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"}
          />
        </button>

        {/* Veg/Non-veg indicator — top left */}
        <div className="absolute top-3 left-3 z-10">
          {product.vegType === "Veg" ? (
            <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-600" />
            </div>
          ) : (
            <div className="w-4 h-4 border-2 border-red-600 flex items-center justify-center">
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: "4px solid transparent",
                  borderRight: "4px solid transparent",
                  borderBottom: "7px solid #dc2626",
                }}
              />
            </div>
          )}
        </div>

        {/* Fixed 1:1 aspect ratio container */}
        <div className="relative w-full aspect-square overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 p-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`, { state: { product } });
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              const fallbackImage = resolveProductImageFallback(product);
              if (imageSrc !== fallbackImage) {
                setImageSrc(fallbackImage);
              }
            }}
          />

          {/* Rating badge — bottom-left over image */}
          {product.rating > 0 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-100 z-10">
              <span className="text-[11px] font-bold text-gray-800">{product.rating.toFixed(2)}</span>
              <span className="text-yellow-400 text-[11px]">★</span>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex flex-col flex-1 px-2 sm:px-4 pb-3 sm:pb-4 pt-1 sm:pt-2">

        {/* Brand + veg-icon row */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] sm:text-[12px] text-gray-500 font-medium truncate">{product.brand}</span>
        </div>

        {/* Product name */}
        <h3 className="text-sm sm:text-[13.5px] font-semibold text-gray-900 leading-snug line-clamp-2 min-h-10 mb-2 sm:mb-3">
          {product.name}
        </h3>

        {/* ── VARIANT SELECTOR ── */}
        {variants.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3 relative">
            {variants.slice(0, 4).map((v, idx) => {
              const vDiscount = v.originalPrice > v.price
                ? Math.round(((v.originalPrice - v.price) / v.originalPrice) * 100)
                : 0;
              const isActive = idx === selectedVariantIdx;
              return (
                <button
                  key={idx}
                  onClick={(e) => handleVariantClick(e, idx)}
                  className={`relative flex flex-col items-center px-2 sm:px-2.5 py-1 sm:py-1.5 rounded border text-[10px] sm:text-[11px] font-semibold transition-all min-w-11 sm:min-w-12 ${
                    isActive
                      ? "border-[#1B3A6B] bg-[#1B3A6B] text-white"
                      : "border-gray-300 text-gray-700 bg-white hover:border-[#1B3A6B]"
                  }`}
                >
                  <span>{v.weight}</span>
                  {vDiscount > 0 && (
                    <span
                      className={`text-[8px] font-bold ${
                        isActive ? "text-orange-300" : "text-orange-500"
                      }`}
                    >
                      {vDiscount}%
                    </span>
                  )}
                </button>
              );
            })}
            {/* scroll arrow if more variants */}
            {variants.length > 4 && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="flex items-center justify-center w-7 h-7 rounded border border-gray-300 text-gray-400 self-center text-xs"
              >
                ›
              </button>
            )}
          </div>
        )}

        {/* ── DELIVERY DATE ── */}
        {product.deliveryDate && (
          <div className="flex items-center gap-1 sm:gap-1.5 bg-blue-50 rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 mb-2 sm:mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-blue-500 shrink-0">
              <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="#3b82f6" strokeWidth="1.8" strokeLinejoin="round"/>
              <circle cx="5.5" cy="18.5" r="2.5" stroke="#3b82f6" strokeWidth="1.8"/>
              <circle cx="18.5" cy="18.5" r="2.5" stroke="#3b82f6" strokeWidth="1.8"/>
            </svg>
            <span className="text-[10px] sm:text-[11px] text-blue-700 font-medium truncate">{product.deliveryDate}</span>
          </div>
        )}

        {/* ── PRICE ROW ── */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-baseline gap-1 sm:gap-2">
            {originalPrice > currentPrice && (
              <span className="text-[11px] sm:text-[12px] text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
            )}
            <span className="text-lg sm:text-xl font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded">
              {discount}% Off
            </span>
          )}
        </div>

        {/* ── ADD TO BAG BUTTON ── */}
        <AddToCartButton
          product={productWithVariant}
          isOutOfStock={isOutOfStock}
          onAddToCart={onAddToCart}
          quantity={1}
        />
      </div>
    </Link>
  );
};

export default ProductCard;
