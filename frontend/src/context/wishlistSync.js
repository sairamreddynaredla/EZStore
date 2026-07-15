export const mergeWishlistItems = (guestItems = [], remoteItems = []) => {
  const merged = [];
  const seen = new Set();

  const getProductId = (item) => {
    const rawId = item?.productId ?? item?.id ?? item?.product?.id;
    const parsed = Number(rawId);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const register = (item) => {
    const productId = getProductId(item);
    if (!productId || seen.has(productId)) {
      return;
    }

    seen.add(productId);
    const normalized = {
      ...item,
      id: productId,
      productId,
      wishlistItemId: item?.id,
      name: item?.name ?? item?.productName ?? item?.product?.name ?? "Product",
      price: item?.price ?? item?.unitPrice ?? item?.product?.price ?? 0,
      image: item?.image ?? item?.productImage ?? item?.product?.imageUrl ?? null,
      selectedVariant: item?.selectedVariant ?? null,
      productName: item?.productName ?? item?.name ?? item?.product?.name ?? "Product",
      productImage: item?.productImage ?? item?.image ?? item?.product?.imageUrl ?? null,
      unitPrice: item?.unitPrice ?? item?.price ?? item?.product?.price ?? 0,
    };

    merged.push(normalized);
  };

  guestItems.forEach(register);
  remoteItems.forEach((item) => {
    register(item);
  });

  return merged;
};
