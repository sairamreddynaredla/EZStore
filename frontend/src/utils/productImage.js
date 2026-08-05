import { getBrandLogo } from "../data/brands";
import banners from "../assets/brand-banners";
import placeholderImage from "../assets/products/placeholder.svg";

const brandImages = import.meta.glob("../assets/brands/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
});

const brandImageMap = Object.fromEntries(
  Object.entries(brandImages).map(([path, src]) => {
    const fileName = path
      .split("/")
      .pop()
      .replace(/\.[^/.]+$/, "")
      .toLowerCase();
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
    brandImageMap[logoKey] || banners[logoKey] || banners[String(logoKey).replace(/-/g, "")] || null
  );
};

export const extractImageSrc = (value) => {
  if (!value && value !== 0) return null;
  if (typeof value === "string") return value;
  // Common CMS/image-object shapes
  if (typeof value === "object") {
    if (typeof value.url === "string") return value.url;
    if (typeof value.src === "string") return value.src;
    if (typeof value.path === "string") return value.path;
    if (typeof value.image === "string") return value.image;
  }
  return null;
};

export const isPersistableImage = (value) => {
  if (!value) return false;
  if (typeof value !== "string") return false;
  const s = value.trim();
  if (!s) return false;
  if (s.startsWith("/src/")) return false; // dev-only bundler path
  if (/^(file|blob|data):/.test(s)) return false; // unsafe protocols
  return true;
};

export const sanitizeImageForPersistence = (value) => {
  const src = extractImageSrc(value);
  return isPersistableImage(src) ? src : null;
};

const getPrimaryImage = (product) => {
  if (!product) return null;

  const candidates = [
    product.image,
    product.productImage,
    product.imageUrl,
    product.images && product.images.length > 0 ? product.images[0] : null,
    product.product?.imageUrl,
    product.product?.image,
  ];

  for (const c of candidates) {
    const src = extractImageSrc(c);
    if (src) return src;
  }

  return null;
};

export const resolveProductImage = (product) => {
  if (!product) return placeholderImage;

  const primaryImage = getPrimaryImage(product);
  if (primaryImage) {
    try {
      const url = new URL(primaryImage, window.location.href);
      const hostname = String(url.hostname || "").toLowerCase();
      if (hostname.includes("amazon.") || hostname.includes("images-na.ssl-images-amazon")) {
        return getBrandImage(product.brand) || placeholderImage;
      }
    } catch (err) {
      return primaryImage;
    }
    return primaryImage;
  }

  return getBrandImage(product.brand) || placeholderImage;
};

export const resolveProductGalleryImages = (product) => {
  if (!product) return [placeholderImage];

  const primaryImage = getPrimaryImage(product);
  const images = product.images && product.images.length > 0 ? product.images : [primaryImage];
  if (images && images.length > 0 && images.some(Boolean)) {
    return images.map((src) => {
      if (!src) return getBrandImage(product.brand) || placeholderImage;
      try {
        const url = new URL(src, window.location.href);
        const hostname = String(url.hostname || "").toLowerCase();
        if (hostname.includes("amazon.")) return getBrandImage(product.brand) || placeholderImage;
      } catch (err) {
        // not an absolute URL — return as-is
      }
      return src;
    });
  }

  return [getBrandImage(product.brand) || placeholderImage];
};

export const resolveProductImageFallback = (product) =>
  getBrandImage(product.brand) || placeholderImage;
