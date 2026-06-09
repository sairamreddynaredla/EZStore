import { getBrandLogo } from "../data/brands";
import banners from "../assets/brand-banners";

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
  return (
    brandImageMap[logoKey] || banners[logoKey] || banners[String(logoKey).replace(/-/g, '')] || null
  );
};

export const resolveProductImage = (product) => {
  if (!product) return "/assets/placeholder-product.svg";

  const primaryImage = product.image || (product.images && product.images.length > 0 && product.images[0]);
  // Avoid relying on certain third-party hosts that may 404 during local dev or be blocked.
  if (primaryImage) {
    try {
      const url = new URL(primaryImage, window.location.href);
      const hostname = String(url.hostname || '').toLowerCase();
      if (hostname.includes('amazon.') || hostname.includes('images-na.ssl-images-amazon')) {
        // prefer brand/local images instead of potentially unavailable Amazon CDN images
        return getBrandImage(product.brand) || "/assets/placeholder-product.svg";
      }
    } catch (err) {
      // not a valid absolute URL — still return it
      return primaryImage;
    }
    return primaryImage;
  }

  return getBrandImage(product.brand) || "/assets/placeholder-product.svg";
};

export const resolveProductGalleryImages = (product) => {
  if (!product) return ["/assets/placeholder-product.svg"];

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  if (images && images.length > 0 && images.some(Boolean)) {
    return images.map((src) => {
      if (!src) return getBrandImage(product.brand) || "/assets/placeholder-product.svg";
      try {
        const url = new URL(src, window.location.href);
        const hostname = String(url.hostname || '').toLowerCase();
        if (hostname.includes('amazon.')) return getBrandImage(product.brand) || "/assets/placeholder-product.svg";
      } catch (err) {
        // not an absolute URL — return as-is
      }
      return src;
    });
  }

  return [getBrandImage(product.brand) || "/assets/placeholder-product.svg"];
};

export const resolveProductImageFallback = (product) => getBrandImage(product.brand) || "/assets/placeholder-product.svg";
