import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/usecart";
import AddToCartButton from "../products/AddToCartButton";
import BuyNowButton from "../BuyNowButton";
import { getBrandLogo } from "../../data/brands";
import ReviewSummary from "./ReviewSummary";
import OffersList from "./OffersList";

const ProductInfo = ({
  product,
  handleBuyNow,
  selectedVariant,
  setSelectedVariant,
  quantity,
  setQuantity,
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);

  const brandSlug =
    getBrandLogo(product.brand) ||
    String(product.brand ?? "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  const brandStoreLink = brandSlug ? `/brands/${brandSlug}` : "/brands";

  const handleVisitBrandStore = () => {
    navigate(brandStoreLink);
  };

  const discountPercentage = selectedVariant?.originalPrice
    ? Math.round(
        ((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) *
          100
      )
    : 0;

  const productBadge = product.rating >= 4.8 ? "Top Rated" : null;

  const productTitleTop = [
    `${product.brand} ${product.productType || "Dry Dog Food"}`,
    selectedVariant?.weight || product.weight?.[0] || product.size,
    `${product.flavor || "Chicken"} & Rice`,
    `with Real ${product.flavor || "Chicken"} Meat`,
  ]
    .filter(Boolean)
    .join(" | ");

  const productTitleBottom = [
    product.lifeStage && `${product.lifeStage} ${product.petType || product.pet || "Dog"} Formula`,
    product.specialDiet || (product.flavor && `${product.flavor} Flavor`),
    product.breedSize && !/all/i.test(product.breedSize) ? `For ${product.breedSize} Breeds` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const variantOptions = product.variants?.length
    ? product.variants
    : product.weight?.map((weight) => ({
        weight,
        price: product.price || 0,
        originalPrice: product.originalPrice || product.price || 0,
      })) || [];

  const selectedVariantWeight = selectedVariant?.weight || product.weight?.[0] || product.size;

  const productShareTitle = [
    `${product.brand} ${product.productType || "Dry Dog Food"}`,
    selectedVariantWeight,
    product.flavor ? `${product.flavor} & Rice` : null,
    product.lifeStage ? `${product.lifeStage} dog formula` : null,
  ]
    .filter(Boolean)
    .join(" - ");

  const productShareUrl = typeof window !== "undefined" ? window.location.href : "";
  const formatCategoryLabel = (category) => {
    if (!category) return "Unknown";
    return category
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const productCategoryLabel = product.productCategory || formatCategoryLabel(product.category);

  const productShareText = `Check out ${productShareTitle} on EZStore${productTitleBottom ? ` — ${productTitleBottom}` : ""}`;

  const handleShare = async () => {
    const shareData = {
      title: productShareTitle,
      text: productShareText,
      url: productShareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.warn("Share canceled or failed", error);
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert("Product link copied to clipboard.");
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header: Brand, Title, Ratings */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <p className="text-sm uppercase tracking-[2px] text-gray-500 font-medium">
              {product.brand}
            </p>
            {productBadge && (
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                {productBadge}
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-3 sm:items-center">
            <div className="w-full flex justify-center sm:justify-start">
              <div className="w-full max-w-2xl mb-2">
                <h1
                  className="font-bold text-black font-sans text-left wrap-break-word leading-tight line-clamp-4"
                  style={{
                    fontSize: "20px",
                  }}
                >
                  <span className="block text-[20px] sm:text-[24px] md:text-[28px] lg:text-[30px] font-bold font-sans">
                    {productTitleTop} | {productTitleBottom}
                  </span>
                </h1>
                {variantOptions.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-3 text-sm font-semibold text-slate-600">Size</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {variantOptions.map((variant) => {
                        const isActive = variant.weight === selectedVariantWeight;
                        return (
                          <button
                            key={variant.weight}
                            type="button"
                            onClick={() => setSelectedVariant(variant)}
                            className={`rounded-2xl border px-3 py-2 text-left transition ${isActive ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                          >
                            <div className="text-sm font-semibold text-slate-900">
                              {variant.weight}
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-900">
                              ${variant.price?.toFixed(2)}
                            </div>
                            {variant.originalPrice > variant.price && (
                              <div className="text-[10px] text-slate-400 line-through">
                                ${variant.originalPrice?.toFixed(2)}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              aria-label={`Share ${productShareTitle}`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="16" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={handleVisitBrandStore}
            className="mb-3 text-sm text-blue-600 hover:underline"
          >
            Visit the {product.brand} Store
          </button>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <button
              type="button"
              onClick={() => setShowRatingDropdown((open) => !open)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 shadow-sm transition hover:border-slate-300"
            >
              <span className="text-yellow-500 text-lg">★</span>
              <span className="font-semibold text-slate-900">{product.rating}</span>
              <span className="text-slate-500">({product.reviews} reviews)</span>
              <span className="text-slate-400">{showRatingDropdown ? "▲" : "▼"}</span>
            </button>

            {product.soldCount != null && (
              <>
                <span className="text-slate-700">{product.soldCount}+ sold</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
              </>
            )}

            <span className="capitalize">
              {productCategoryLabel} • {product.brand}
            </span>
          </div>

          {discountPercentage > 0 && (
            <div className="mt-3 inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
              {discountPercentage}% off this pack
            </div>
          )}

          {showRatingDropdown && (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <ReviewSummary
                rating={product.rating}
                reviews={product.reviews}
                breakdown={product.reviewsBreakdown}
              />
            </div>
          )}
        </div>

        <div className="prose text-slate-700">
          <div className="mt-4">
            <OffersList offers={product.offers} />
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Product Highlights</h3>
            <ul className="list-disc pl-5 space-y-2">
              {product.features?.slice(0, 5).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <div className="mt-4">
              <h4 className="font-semibold">About this item</h4>
              <p className="mt-2 text-sm text-slate-600">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Removed duplicate compact Product Details here — full details live in the accordion below. */}
      </div>

      {/* Mobile sticky buy bar (visible on small screens) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t shadow-lg sm:hidden">
        <div className="max-w-362.5 mx-auto px-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-bold text-green-600">
                {"$" + (selectedVariant?.price || product.price)}
              </div>
              <div className="text-xs text-slate-600">
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="px-3 py-2"
                >
                  -
                </button>
                <div className="px-3 py-2 font-medium">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2">
                  +
                </button>
              </div>

              <div className="flex gap-2 items-center">
                <div className="w-30">
                  <AddToCartButton
                    product={{ ...product, selectedVariant, quantity }}
                    isOutOfStock={product.stock <= 0}
                    onAddToCart={addToCart}
                    quantity={quantity}
                  />
                </div>

                <BuyNowButton
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-24 py-2 text-sm"
                  analyticsPayload={{ ...product, selectedVariant, quantity }}
                >
                  Buy
                </BuyNowButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductInfo;
