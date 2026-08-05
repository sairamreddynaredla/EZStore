import placeholderImage from "../assets/products/placeholder.svg";
import { resolveAdminAssetUrl } from "../services/api";

// The product seed data retains its storefront source asset paths. Bundle those
// originals into the admin too, so those paths do not turn into broken URLs.
const storefrontProductAssets = import.meta.glob("../../../frontend/src/assets/products/**/*.{png,jpg,jpeg,webp,gif,svg}", {
  eager: true,
  import: "default",
});

const normalizeAssetKey = (value) => {
  if (!value || typeof value !== "string") return "";
  return String(value)
    .replace(/\\/g, "/")
    .replace(/^\.+\//, "")
    .replace(/^.*(?:frontend\/src\/)?/, "")
    .replace(/^\//, "")
    .toLowerCase();
};

const assetByFileName = new Map(
  Object.entries(storefrontProductAssets).map(([path, src]) => [path.split("/").pop().toLowerCase(), src])
);

const assetByNormalizedPath = new Map(
  Object.entries(storefrontProductAssets).map(([path, src]) => [normalizeAssetKey(path), src])
);

const toImageValue = (value) => {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") return String(value.url || value.src || value.path || "").trim();
  return "";
};

const resolveImageSource = (value) => {
  const image = toImageValue(value);
  if (!image) return "";

  // Imported storefront assets are stored in the database as relative source
  // paths (for example, ../../assets/products/.../product.webp). We'll
  // perform a bundled-asset lookup later after normalizing the candidate
  // path so we keep a single filename/bundledAsset declaration.

  // Derive filename and prefer bundled asset when available
  const filenameFromImage = image.split(/[\\/]/).pop().split(/[?#]/)[0].toLowerCase();
  const earlyBundled = assetByFileName.get(filenameFromImage);
  if (earlyBundled) return earlyBundled;

  const normalizedByPath = assetByNormalizedPath.get(normalizeAssetKey(image));
  if (normalizedByPath) return normalizedByPath;

  // Normalize candidate. If the image is an absolute URL, use its pathname
  let candidate = String(image || "");
  if (/^(?:https?:)?\/\//i.test(image)) {
    try {
      const url = new URL(image);
      candidate = (url.pathname + (url.search || "")).replace(/^\//, "");
    } catch {
      candidate = image;
    }
  }
  candidate = candidate.replace(/^\.\//, "").replace(/^\.\.\//, "");

  // Determine backend origin so we can construct fully-qualified upload URLs
  let backendOrigin = "";
  try {
    const apiBase = resolveAdminAssetUrl("/__dummy__").replace(/\/__dummy__$/, "");
    if (apiBase) {
      try {
        backendOrigin = new URL(apiBase).origin;
      } catch {
        // resolveAdminAssetUrl may return a same-origin relative path; fallback to window origin
        if (typeof window !== "undefined" && window.location && window.location.origin) {
          backendOrigin = window.location.origin;
        }
      }
    }
  } catch (e) {
    // ignore
  }

  // If the value references an uploads path, ensure it points to the API uploads endpoint
  if (/^uploads\//i.test(candidate) || candidate.indexOf("/uploads/") !== -1) {
    const pathPart = candidate.replace(/^\/*/, "");
    if (backendOrigin) return `${backendOrigin}/${pathPart}`;
    return `/${pathPart}`;
  }

  // If candidate is absolute-root (/...), prefix with backend origin when available
  if (candidate.startsWith("/")) {
    if (backendOrigin) return `${backendOrigin}${candidate}`;
    return candidate;
  }

  // Try bundling lookup by normalized path first, then filename.
  const normalizedCandidate = normalizeAssetKey(candidate);
  const normalizedBundled = assetByNormalizedPath.get(normalizedCandidate);
  if (normalizedBundled) return normalizedBundled;

  const filename = normalizedCandidate.split(/[\/]/).pop().split(/[?#]/)[0].toLowerCase();
  const bundledAsset = assetByFileName.get(filename);
  if (bundledAsset) return bundledAsset;
  // Debug: log when no bundled asset found so we can inspect candidate/filename
  try {
    // eslint-disable-next-line no-console
    console.debug("productImage: resolved candidate", { candidate, filename });
  } catch (e) {
    // ignore
  }

  // Last resort: let resolveAdminAssetUrl attempt to resolve (it will prefix origin when appropriate)
  return resolveAdminAssetUrl(candidate);
};

const getImageValues = (product) => {
  if (!product) return [];

  return [
    product.image,
    product.productImage,
    product.imageUrl,
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean);
};

export const getAdminImageCandidates = (product) => {
  const seen = new Set();
  const candidates = getImageValues(product)
    .map(resolveImageSource)
    .filter(Boolean)
    .filter((image) => {
      if (seen.has(image)) return false;
      seen.add(image);
      return true;
    });
  // Do not return a placeholder; return an empty array when no candidates
  if (candidates.length) return candidates;

  // No direct candidates found — try sensible fallbacks:
  // 1) bundled assets by filename (frontend assets)
  // 2) backend uploads path (/uploads/<filename>) resolved via resolveAdminAssetUrl
  const fallback = [];
  const values = getImageValues(product);
  for (const v of values) {
    const raw = toImageValue(v);
    if (!raw) continue;
    const fname = raw.split(/[\\/]/).pop().split(/[?#]/)[0];
    if (!fname) continue;
    const lower = fname.toLowerCase();
    const bundled = assetByFileName.get(lower);
    if (bundled) {
      fallback.push(bundled);
      continue;
    }

    // Try backend uploads path
    try {
      const uploadPath = `/uploads/${fname}`;
      const resolved = resolveAdminAssetUrl(uploadPath) || uploadPath;
      fallback.push(resolved);
    } catch (e) {
      fallback.push(`/uploads/${fname}`);
    }
  }

  // Deduplicate and return
  return Array.from(new Set(fallback.filter(Boolean)));
};

export const resolveAdminProductImage = (product) => getAdminImageCandidates(product)[0] || "";

export const resolveAdminProductImageFallback = () => "";
