import { getBrandLogo } from "../data/brands";

const brandImages = import.meta.glob("../assets/brands/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
});

const brandImageMap = Object.fromEntries(
  Object.entries(brandImages).map(([path, src]) => {
    const fileName = path.split("/").pop().replace(/\.[^/.]+$/, "").toLowerCase();
    return [fileName, src];
  })
);

const normalizeBrandName = (brandName) =>
  String(brandName ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9-]/g, "");

export const getBrandImage = (brandName) => {
  const logoKey = getBrandLogo(brandName) || normalizeBrandName(brandName);
  return brandImageMap[logoKey] || null;
};

export const resolveProductImage = (product) => {
  if (!product) return "/assets/placeholder-product.svg";

  const primaryImage = product.image || (product.images && product.images.length > 0 && product.images[0]);
  if (primaryImage) return primaryImage;

  return getBrandImage(product.brand) || "/assets/placeholder-product.svg";
};

export const resolveProductGalleryImages = (product) => {
  if (!product) return ["/assets/placeholder-product.svg"];

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  if (images && images.length > 0 && images.some(Boolean)) {
    return images.map((src) => src || getBrandImage(product.brand) || "/assets/placeholder-product.svg");
  }

  return [getBrandImage(product.brand) || "/assets/placeholder-product.svg"];
};

export const resolveProductImageFallback = (product) => getBrandImage(product.brand) || "/assets/placeholder-product.svg";
