import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { useWishlist } from "../../context/usewishlist";
import { resolveProductImage, resolveProductImageFallback } from "../../utils/productImage";

const ProductCard = ({ product, onAddToCart, onWishlistToggle, compact = false }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [imageSrc, setImageSrc] = useState(resolveProductImage(product));
  const navigate = useNavigate();

  useEffect(() => {
    setImageSrc(resolveProductImage(product));
  }, [product]);

  useEffect(() => {
    setSelectedVariantIdx(0);
  }, [product?.id]);

  const variants = product.variants || [];
  const selectedVariant = variants[selectedVariantIdx] || variants[0] || {};
  const currentPrice = Number(selectedVariant.price ?? product.price ?? 0);
  const originalPrice = Number(selectedVariant.originalPrice ?? product.originalPrice ?? 0);
  const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const isOutOfStock = (product.stock ?? 1) <= 0;
  const wishlisted = isInWishlist(product.id);

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

  const productWithVariant = { ...product, selectedVariant };

  const baseClass = compact
    ? "group relative flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
    : "group relative flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 w-full";

  return (
    <Link to={`/product/${product.id}`} state={{ product }} className={baseClass}>
      {!compact && (
        <div className="hidden sm:block bg-[#1B3A6B] text-white text-[11px] font-medium text-center py-2 px-3 tracking-wide">Enjoy offers on Checkout!</div>
      )}

      {compact ? (
        <div className="flex flex-col h-full">
            <div className="relative flex-1 flex items-center justify-center bg-white">
            <button onClick={handleWishlist} className="absolute top-2 right-2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:scale-105 shadow-sm" aria-label="Wishlist">
              <Heart size={18} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"} />
            </button>
            <img src={imageSrc} alt={product.name} className="max-w-[72%] sm:max-w-[92%] max-h-[72%] sm:max-h-[92%] object-contain transform transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-lg p-0 sm:p-1" />
          </div>
          <div className="p-3 bg-[#f7f3ee] sm:bg-white">
            <div className="text-sm font-semibold line-clamp-2 mb-2 bg-[#f7f3ee] sm:bg-transparent px-2 py-1 rounded-sm sm:rounded-none">{product.name}</div>
            <div className="mb-3">
              {originalPrice > currentPrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>
                  <span className="text-base font-bold text-gray-900">₹{currentPrice.toFixed(2)}</span>
                </div>
              ) : (
                <div className="text-base font-bold text-gray-900">₹{currentPrice.toFixed(2)}</div>
              )}
            </div>
            <div>
              <AddToCartButton product={productWithVariant} isOutOfStock={isOutOfStock} onAddToCart={onAddToCart} btnClass="w-full py-3 rounded-xl text-base font-semibold bg-[#F59E0B] hover:bg-[#D97706] text-white" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative bg-white px-2 sm:px-3 pt-1 sm:pt-2 pb-1 sm:pb-1">
            <button onClick={handleWishlist} className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-sm hover:scale-110 hover:bg-white shadow-md hover:shadow-lg transition-all" aria-label="Wishlist">
              <Heart size={20} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"} />
            </button>

            <div className="absolute top-3 left-3 z-10">
              {product.vegType === "Veg" ? (
                <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-green-600" /></div>
              ) : (
                <div className="w-4 h-4 border-2 border-red-600 flex items-center justify-center"><div className="w-0 h-0" style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: "7px solid #dc2626" }} /></div>
              )}
            </div>

            <div className="relative w-full aspect-square sm:aspect-[5/4] overflow-hidden">
              <img src={imageSrc} alt={product.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-lg p-1 sm:p-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`, { state: { product } }); }} onError={(e) => { e.currentTarget.onerror = null; const fallbackImage = resolveProductImageFallback(product); if (imageSrc !== fallbackImage) setImageSrc(fallbackImage); }} />

              {product.rating > 0 && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-100 z-10"><span className="text-[11px] font-bold text-gray-800">{product.rating.toFixed(2)}</span><span className="text-yellow-400 text-[11px]">★</span></div>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 px-3 sm:px-3 pb-3 sm:pb-3 pt-1 sm:pt-1">
            <div className="flex items-center justify-between mb-1"><span className="text-[11px] sm:text-[12px] text-gray-500 font-medium truncate">{product.brand}</span></div>
            <h3 className="text-sm sm:text-[12px] font-semibold text-gray-900 leading-snug line-clamp-2 min-h-10 mb-1 sm:mb-2">{product.name}</h3>

            {variants.length > 0 && (
              <div className="hidden sm:flex flex-wrap gap-1 sm:gap-1 mb-1 sm:mb-2 relative">
                {variants.slice(0, 4).map((v, idx) => {
                  const vDiscount = v.originalPrice > v.price ? Math.round(((v.originalPrice - v.price) / v.originalPrice) * 100) : 0;
                  const isActive = idx === selectedVariantIdx;
                  return (
                    <button key={idx} onClick={(e) => handleVariantClick(e, idx)} className={`relative flex flex-col items-center px-1.5 sm:px-2 py-1 sm:py-1 rounded border text-[10px] sm:text-[10px] font-semibold transition-all min-w-10 sm:min-w-11 ${isActive ? "border-[#1B3A6B] bg-[#1B3A6B] text-white" : "border-gray-300 text-gray-700 bg-white hover:border-[#1B3A6B]"}`}>
                      <span>{v.weight}</span>
                      {vDiscount > 0 && (<span className={`text-[8px] font-bold ${isActive ? "text-orange-300" : "text-orange-500"}`}>{vDiscount}%</span>)}
                    </button>
                  );
                })}
                {variants.length > 4 && (<button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="flex items-center justify-center w-6 h-6 rounded border border-gray-300 text-gray-400 self-center text-xs">›</button>)}
              </div>
            )}

            {product.deliveryDate && (<div className="flex items-center gap-1 sm:gap-1.5 bg-blue-50 rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 mb-2 sm:mb-3"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-blue-500 shrink-0"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="#3b82f6" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="#3b82f6" strokeWidth="1.8"/><circle cx="18.5" cy="18.5" r="2.5" stroke="#3b82f6" strokeWidth="1.8"/></svg><span className="text-[10px] sm:text-[11px] text-blue-700 font-medium truncate">{product.deliveryDate}</span></div>)}

            <div className="flex items-center justify-between mb-0 sm:mb-3"><div className="flex items-baseline gap-1 sm:gap-2">{originalPrice > currentPrice && (<span className="text-[11px] sm:text-[12px] text-gray-400 line-through hidden sm:inline">${originalPrice.toFixed(2)}</span>)}<span className="text-lg sm:text-xl font-bold text-gray-900">${currentPrice.toFixed(2)}</span></div>{discount > 0 && (<span className="hidden sm:inline-block bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded">{discount}% Off</span>)}</div>

            <div className="mt-auto sm:mt-0"><AddToCartButton product={productWithVariant} isOutOfStock={isOutOfStock} onAddToCart={onAddToCart} quantity={1} /></div>
          </div>
        </>
      )}
    </Link>
  );
};

export default ProductCard;
