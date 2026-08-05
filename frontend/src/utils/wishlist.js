import { products } from "../data/products";

export const normalizeWishlistItem = (product) => {
  const safeProduct = product && typeof product === "object" ? product : {};
  const productData = safeProduct.product && typeof safeProduct.product === "object" ? safeProduct.product : {};
  // Older wishlist rows can contain the fallback title "Product". Prefer the
  // linked catalogue record in that case so separate products are not shown
  // as identical cards.
  const isPlaceholderName = (value) => String(value ?? "").trim().toLowerCase() === "product";
  const storedName = safeProduct.name ?? safeProduct.productName;
  const savedName = !isPlaceholderName(storedName) ? storedName : productData.name ?? storedName ?? "";
  const savedSlug = safeProduct.slug ?? safeProduct.productSlug ?? productData.slug ?? "";
  const savedPrice = Number(safeProduct.price ?? safeProduct.unitPrice ?? productData.price ?? 0);
  const savedBrand = safeProduct.brand ?? productData.brand ?? "";
  const catalogProductByIdentity =
    products.find((item) => savedSlug && item.slug === savedSlug) ??
    products.find((item) => savedName && item.name === savedName) ??
    products.find((item) => Number(item.id) === Number(safeProduct.productId ?? safeProduct.id ?? productData.id));
  // Legacy rows may only retain their brand and price. This identifies the
  // original local catalogue product without treating different products as
  // duplicates.
  const catalogProduct =
    catalogProductByIdentity ??
    products.find((item) => {
      const itemPrice = Number(item.price ?? item.variants?.[0]?.price ?? 0);
      return Boolean(savedBrand) && item.brand === savedBrand && itemPrice === savedPrice;
    });

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
    // The catalogue image is the same image used on product pages. Saved
    // thumbnails can be old placeholders or brand logos, so use them only as
    // a fallback when the original catalogue product cannot be identified.
    image: catalogProduct?.image ?? catalogProduct?.imageUrl ?? catalogProduct?.images?.[0] ?? safeProduct.image ?? safeProduct.productImage ?? productData.imageUrl ?? null,
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
