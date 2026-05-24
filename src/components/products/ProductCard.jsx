import { FaBalanceScale, FaTruck } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProductBadges from "./ProductBadges";
import RatingStars from "./RatingStars";
import PriceSection from "./PriceSection";
import WishlistButton from "./WishlistButton";
import AddToCartButton from "./AddToCartButton";
import { useWishlist } from "../../context/usewishlist";

const ProductCard = ({ product, onAddToCart, onWishlistToggle }) => {
  const { isInWishlist } = useWishlist();
  const firstVariant = product.variants?.[0] || {};
  const currentPrice = firstVariant.price ?? product.price ?? 0;
  const originalPrice = firstVariant.originalPrice ?? product.originalPrice ?? 0;
  const soldCount = product.soldCount ?? product.sales ?? 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  const cardBadge =
    product.rating >= 4.7
      ? "Top Rated"
      : (product.soldCount ?? product.sales ?? 0) > 250
      ? "Best Seller"
      : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
    >
      <div className="relative border-b border-slate-200 bg-slate-50 px-4 pt-4">
        <div className="aspect-square w-full overflow-hidden rounded-[22px] bg-white">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {cardBadge && (
            <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              {cardBadge}
            </span>
          )}
          {product.fastDelivery && (
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-semibold text-[#1f3bb3]">
              Fast shipping
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-[#fff5e6] px-3 py-1 text-[11px] font-semibold text-[#d97706]">
              New
            </span>
          )}
        </div>

        <WishlistButton
          isWishlisted={isInWishlist(product.id)}
          product={product}
          onWishlistToggle={onWishlistToggle}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 py-5 text-sm text-slate-700">
        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
          {product.brand}
        </p>

        <h3 className="min-h-[3rem] text-base font-semibold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-orange-600">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <RatingStars rating={product.rating || 0} reviewCount={product.reviews || 0} size="sm" />
          <span className="text-slate-400">•</span>
          <span>{soldCount.toLocaleString()} sold</span>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <span className="block text-2xl font-semibold text-slate-900">
              ${currentPrice}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-sm text-slate-400 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
          {originalPrice > currentPrice && (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
              {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% off
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {isLowStock && <span className="rounded-full bg-red-50 px-2 py-1 text-red-600">Only {product.stock} left</span>}
          {product.deliveryDate && <span>Delivery by {product.deliveryDate}</span>}
        </div>

        <div className="mt-auto">
          <AddToCartButton
            product={product}
            isOutOfStock={isOutOfStock}
            onAddToCart={onAddToCart}
            quantity={1}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;