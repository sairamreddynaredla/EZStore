import { products } from "../data/products";

export const normalizeWishlistItem = (product) => {
  const safeProduct = product && typeof product === "object" ? product : {};
  const productData = safeProduct.product && typeof safeProduct.product === "object" ? safeProduct.product : {};
  const savedName = safeProduct.name ?? safeProduct.productName ?? productData.name ?? "";
  const savedSlug = safeProduct.slug ?? safeProduct.productSlug ?? productData.slug ?? "";
  const catalogProduct =
    products.find((item) => savedSlug && item.slug === savedSlug) ??
    products.find((item) => savedName && item.name === savedName) ??
    products.find((item) => Number(item.id) === Number(safeProduct.productId ?? safeProduct.id ?? productData.id));

  const savedVariant = safeProduct.selectedVariant ?? safeProduct.variants?.[0] ?? null;
  const catalogVariant =
    catalogProduct?.variants?.find((variant) => variant.weight === savedVariant?.weight) ??
    catalogProduct?.variants?.[0] ??
    null;
  const activeVariant = savedVariant ? { ...catalogVariant, ...savedVariant } : catalogVariant;

  const productId = Number(safeProduct.productId ?? safeProduct.id ?? productData.id ?? null);
  const price = Number(activeVariant?.price ?? safeProduct.price ?? safeProduct.unitPrice ?? productData.price ?? 0);
  const originalPrice = Number(
    activeVariant?.originalPrice ??
      safeProduct.originalPrice ??
      safeProduct.price ??
      safeProduct.unitPrice ??
      productData.price ??
      0
  );

  return {
    ...safeProduct,
    id: Number.isFinite(productId) && productId > 0 ? productId : null,
    productId: Number.isFinite(productId) && productId > 0 ? productId : null,
    name: savedName || catalogProduct?.name || "Product",
    image: safeProduct.image ?? safeProduct.productImage ?? productData.imageUrl ?? catalogProduct?.image ?? null,
    brand: safeProduct.brand || productData.brand || catalogProduct?.brand || "",
    rating: Number(safeProduct.rating ?? productData.rating) || catalogProduct?.rating || 0,
    reviews: Number(safeProduct.reviews ?? productData.reviews) || catalogProduct?.reviews || 0,
    stock: safeProduct.stock ?? productData.stock ?? catalogProduct?.stock ?? 0,
    variants: safeProduct.variants?.length ? safeProduct.variants : catalogProduct?.variants ?? [],
    catalogProduct,
    selectedVariant: activeVariant,
    price,
    originalPrice,
    unitPrice: price,
  };
};
