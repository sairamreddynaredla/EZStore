import api from "./api";
import catalogProducts from "../data/products";

// The database records inventory and pricing, while the storefront catalog
// contains the product images that Vite publishes as production asset URLs.
// Some older database rows still reference source-tree paths such as
// `../../assets/...`, which are not public URLs after deployment.
const normalizeProductName = (value) =>
  String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const catalogProductByName = new Map(
  catalogProducts.map((product) => [normalizeProductName(product.name), product])
);

const withStorefrontImages = (product) => {
  const catalogProduct = catalogProductByName.get(normalizeProductName(product?.name || product?.title));
  if (!catalogProduct?.image) return product;

  const catalogImages = Array.isArray(catalogProduct.images) && catalogProduct.images.length
    ? catalogProduct.images
    : [catalogProduct.image];

  return {
    // Keep the live product's ID, price, stock and availability. Only use the
    // matching catalog record for its original product imagery and storefront
    // classification fields absent from older API rows.
    ...catalogProduct,
    ...product,
    image: catalogProduct.image,
    images: catalogImages,
  };
};

const normalizeListResponse = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: 1,
      pageSize: data.length,
    };
  }

  const payload = data?.data ?? data;
  const meta = data?.meta || {};

  if (Array.isArray(payload)) {
    return {
      items: payload,
      total: meta.total ?? payload.length,
      page: meta.page ?? meta.currentPage ?? 1,
      pageSize: meta.pageSize ?? meta.limit ?? payload.length,
    };
  }

  if (payload && Array.isArray(payload.items)) {
    return {
      items: payload.items,
      total: payload.total ?? meta.total ?? payload.items.length,
      page: payload.page ?? meta.page ?? meta.currentPage ?? 1,
      pageSize: payload.pageSize ?? meta.pageSize ?? meta.limit ?? payload.items.length,
    };
  }

  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 0,
  };
};

export const fetchProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  const normalized = normalizeListResponse(response);
  return normalized.items.map(withStorefrontImages);
};

export const fetchProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return withStorefrontImages(response.data?.data ?? response.data);
};

export const fetchRecommendedProducts = async (productId, params = {}) => {
  const response = await api.get(`/products/${productId}/recommended`, { params });
  const normalized = normalizeListResponse(response);
  return normalized.items.map(withStorefrontImages);
};
