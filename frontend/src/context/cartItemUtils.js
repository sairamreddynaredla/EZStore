import { extractImageSrc, sanitizeImageForPersistence } from "../utils/productImage.js";

const getCartItemImage = (item) => {
  if (!item || typeof item !== "object") return null;

  const candidates = [
    item.productImage,
    item.image,
    item.imageUrl,
    item.product?.imageUrl,
    item.product?.image,
    Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null,
  ];

  for (const c of candidates) {
    const src = extractImageSrc(c);
    if (src) return src;
  }

  return null;
};

const normalizeCartItem = (item) => {
  const selectedVariant = item.selectedVariant || item.variant || item.variants?.[0] || {
    weight: "1kg",
    price: Number(item.unitPrice ?? item.price ?? 0),
  };

  const unitPrice = Number(item.unitPrice ?? item.price ?? selectedVariant.price ?? 0);
  const normalizedVariant = {
    ...(selectedVariant || {}),
    price: Number(selectedVariant?.price ?? unitPrice ?? 0),
    weight: selectedVariant?.weight || selectedVariant?.variantKey || "1kg",
  };

  const imageSource = getCartItemImage(item);

  const safeImage = sanitizeImageForPersistence(imageSource) || null;

  return {
    ...item,
    id: item.productId ?? item.id,
    productId: item.productId ?? item.id,
    cartItemId: item.cartItemId ?? item.id,
    name: item.productName ?? item.name ?? "Product",
    image: safeImage,
    productImage: sanitizeImageForPersistence(item.productImage) || safeImage,
    price: unitPrice,
    quantity: Number(item.quantity ?? 1),
    selectedVariant: normalizedVariant,
    stock: item.stock ?? 100,
  };
};

const buildCartItemPayload = (item) => {
  const selectedVariant = item.selectedVariant || item.variant || item.variants?.[0] || {
    weight: "1kg",
    price: Number(item.unitPrice ?? item.price ?? 0),
  };

  const imageSource = getCartItemImage(item);
  const sendableImage = sanitizeImageForPersistence(imageSource) || undefined;

  return {
    productId: Number(item.productId ?? item.id) || undefined,
    productSlug: item.productSlug || undefined,
    productName: item.productName ?? item.name ?? item.title ?? "Product",
    productImage: sendableImage,
    image: sendableImage,
    price: Number(item.price ?? selectedVariant.price ?? 0),
    unitPrice: Number(item.unitPrice ?? item.price ?? selectedVariant.price ?? 0),
    quantity: Number(item.quantity ?? 1),
    variantKey: selectedVariant.weight || selectedVariant.variantKey || "1kg",
    selectedVariant,
    stock: Number(item.stock ?? item.selectedVariant?.stock ?? 0) || 0,
  };
};

export { getCartItemImage, normalizeCartItem, buildCartItemPayload };
