import bcrypt from "bcrypt";

const initialState = {
  admins: [],
  products: [
    {
      id: "prod-1",
      title: "Premium Cat Litter",
      description: "Odor-control litter for modern homes.",
      price: 24.99,
      category: "Pet Supplies",
      brand: "EZStore",
      stock: 18,
      status: "active",
      tags: ["litter", "pet"],
      imageUrl: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=800&q=80",
      images: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-2",
      title: "Luxury Dog Bed",
      description: "Orthopedic comfort for your best friend.",
      price: 79.5,
      category: "Pet Supplies",
      brand: "EZStore",
      stock: 6,
      status: "active",
      tags: ["dog", "bed"],
      imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
      images: [],
      createdAt: new Date().toISOString(),
    },
  ],
  categories: [
    {
      id: "cat-1",
      name: "Pet Supplies",
      slug: "pet-supplies",
      description: "Everyday essentials for pet parents.",
      status: "active",
      banner: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
      createdAt: new Date().toISOString(),
    },
  ],
  orders: [
    {
      id: "order-1",
      orderId: "ORD-1001",
      customerName: "Ava Martinez",
      customerEmail: "ava@example.com",
      customerPhone: "+1 555 0100",
      totalAmount: 124.95,
      totalItems: 2,
      paymentMethod: "card",
      paymentStatus: "paid",
      orderStatus: "processing",
      orderDate: new Date().toISOString(),
      shippingAddress: {
        line1: "123 Market Street",
        city: "Austin",
        state: "TX",
        postalCode: "73301",
        country: "USA",
      },
      items: [
        { id: "item-1", name: "Premium Cat Litter", quantity: 1, price: 24.99 },
        { id: "item-2", name: "Luxury Dog Bed", quantity: 1, price: 79.5 },
      ],
    },
  ],
  customers: [
    {
      id: "customer-1",
      name: "Ava Martinez",
      email: "ava@example.com",
      phone: "+1 555 0100",
      status: "active",
      totalOrders: 2,
      totalSpent: 249.9,
      registeredAt: new Date().toISOString(),
    },
  ],
  coupons: [
    {
      id: "coupon-1",
      code: "WELCOME10",
      description: "10% off for first-time shoppers",
      discountType: "percent",
      discount: 10,
      status: "active",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      usageLimit: 100,
    },
  ],
  reviews: [
    {
      id: "review-1",
      reviewer: "Ava Martinez",
      productName: "Premium Cat Litter",
      rating: 5,
      comment: "Excellent product and fast delivery.",
      status: "approved",
      createdAt: new Date().toISOString(),
    },
  ],
  settings: {
    storeName: "EZStore",
    storeDescription: "Modern ecommerce for pets and lifestyle essentials.",
    contactEmail: "support@ezstore.com",
    contactPhone: "+1 555 0101",
    supportEmail: "support@ezstore.com",
    storeAddress: "123 Market Street, Austin, TX",
    defaultCurrency: "USD",
    currencySymbol: "$",
    timeZone: "UTC",
    language: "en",
    taxEnabled: true,
    taxPercentage: 8,
    gstVatNumber: "VAT-1234",
    freeShippingThreshold: 75,
    flatShippingCharge: 4.99,
    estimatedDeliveryDays: 3,
    paymentMethods: ["card", "paypal", "cash_on_delivery"],
    cashOnDeliveryEnabled: true,
    onlinePaymentEnabled: true,
    emailNotificationsEnabled: true,
    orderNotificationsEnabled: true,
    registrationNotificationsEnabled: true,
    sessionTimeoutMinutes: 30,
    twoFactorEnabled: false,
    logoUrl: "",
    faviconUrl: "",
    removeLogo: false,
    removeFavicon: false,
  },
};

let state = structuredClone(initialState);

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeQuery = (value) => (typeof value === "string" ? value.trim() : "");

const applyPagination = (items, query = {}) => {
  const page = parseNumber(query.page, 1);
  const limit = parseNumber(query.limit, 10);
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const start = (safePage - 1) * safeLimit;
  const sliced = items.slice(start, start + safeLimit);

  return {
    items: sliced,
    total: items.length,
    page: safePage,
    pageSize: safeLimit,
  };
};

const sortItems = (items, sortBy, order = "asc") => {
  const direction = order === "desc" ? -1 : 1;
  const sorted = [...items];

  sorted.sort((left, right) => {
    const leftValue = left?.[sortBy];
    const rightValue = right?.[sortBy];

    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return (leftValue - rightValue) * direction;
    }

    const leftText = String(leftValue ?? "").toLowerCase();
    const rightText = String(rightValue ?? "").toLowerCase();
    return leftText.localeCompare(rightText) * direction;
  });

  return sorted;
};

export const resetAdminStore = () => {
  state = structuredClone(initialState);
};

export const getAdminByEmail = (email) => {
  const normalizedEmail = normalizeQuery(email).toLowerCase();
  return state.admins.find((admin) => admin.email.toLowerCase() === normalizedEmail) || null;
};

export const getAdminById = (id) => state.admins.find((admin) => admin.id === id) || null;

export const verifyAdminPassword = async (password, hash) => bcrypt.compare(password, hash);

export const getProducts = (query = {}) => {
  const normalizedQuery = normalizeQuery(query.q);
  const statusFilter = normalizeQuery(query.status);
  let items = state.products.filter((product) => {
    if (statusFilter && product.status !== statusFilter) return false;
    if (!normalizedQuery) return true;
    const haystack = `${product.title} ${product.description} ${product.category} ${product.brand}`.toLowerCase();
    return haystack.includes(normalizedQuery.toLowerCase());
  });

  if (query.sortBy) {
    items = sortItems(items, query.sortBy, query.order);
  }

  return applyPagination(items, query);
};

export const getProduct = (productId) => state.products.find((product) => product.id === productId) || null;

export const createProduct = (payload = {}) => {
  const created = {
    id: createId("prod"),
    title: payload.title || "Untitled Product",
    description: payload.description || "",
    price: parseNumber(payload.price, 0),
    category: payload.category || "General",
    brand: payload.brand || "EZStore",
    stock: parseNumber(payload.stock, 0),
    status: payload.status || "active",
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    imageUrl: payload.imageUrl || payload.images?.[0] || "",
    images: Array.isArray(payload.images) ? payload.images : [],
    createdAt: new Date().toISOString(),
  };
  state.products.unshift(created);
  return created;
};

export const updateProduct = (productId, payload = {}) => {
  const index = state.products.findIndex((product) => product.id === productId);
  if (index === -1) return null;

  state.products[index] = {
    ...state.products[index],
    ...payload,
    price: parseNumber(payload.price, state.products[index].price),
    stock: parseNumber(payload.stock, state.products[index].stock),
    tags: Array.isArray(payload.tags) ? payload.tags : state.products[index].tags,
    imageUrl: payload.imageUrl || state.products[index].imageUrl,
    images: Array.isArray(payload.images) ? payload.images : state.products[index].images,
  };
  return state.products[index];
};

export const updateProductStock = (productId, stock) => {
  const index = state.products.findIndex((product) => product.id === productId);
  if (index === -1) return null;
  state.products[index].stock = parseNumber(stock, 0);
  return state.products[index];
};

export const deleteProduct = (productId) => {
  const index = state.products.findIndex((product) => product.id === productId);
  if (index === -1) return null;
  const [removed] = state.products.splice(index, 1);
  return removed;
};

export const getCategories = (query = {}) => {
  const normalizedQuery = normalizeQuery(query.q);
  const statusFilter = normalizeQuery(query.status);
  let items = state.categories.filter((category) => {
    if (statusFilter && category.status !== statusFilter) return false;
    if (!normalizedQuery) return true;
    const haystack = `${category.name} ${category.slug} ${category.description}`.toLowerCase();
    return haystack.includes(normalizedQuery.toLowerCase());
  });

  return applyPagination(items, query);
};

export const getCategory = (categoryId) => state.categories.find((category) => category.id === categoryId) || null;

export const createCategory = (payload = {}) => {
  const created = {
    id: createId("cat"),
    name: payload.name || "Unnamed Category",
    slug: payload.slug || (payload.name || "unnamed-category").toLowerCase().replace(/\s+/g, "-"),
    description: payload.description || "",
    status: payload.status || "active",
    banner: payload.banner || payload.bannerUrl || "",
    createdAt: new Date().toISOString(),
  };
  state.categories.unshift(created);
  return created;
};

export const updateCategory = (categoryId, payload = {}) => {
  const index = state.categories.findIndex((category) => category.id === categoryId);
  if (index === -1) return null;
  state.categories[index] = { ...state.categories[index], ...payload };
  return state.categories[index];
};

export const deleteCategory = (categoryId) => {
  const index = state.categories.findIndex((category) => category.id === categoryId);
  if (index === -1) return null;
  const [removed] = state.categories.splice(index, 1);
  return removed;
};

export const getOrders = (query = {}) => {
  const normalizedQuery = normalizeQuery(query.q);
  let items = state.orders.filter((order) => {
    if (query.orderStatus && order.orderStatus !== query.orderStatus) return false;
    if (query.paymentStatus && order.paymentStatus !== query.paymentStatus) return false;
    if (query.paymentMethod && order.paymentMethod !== query.paymentMethod) return false;
    if (query.dateFrom && new Date(order.orderDate) < new Date(query.dateFrom)) return false;
    if (query.dateTo && new Date(order.orderDate) > new Date(query.dateTo)) return false;
    if (!normalizedQuery) return true;
    const haystack = `${order.orderId} ${order.customerName} ${order.customerEmail}`.toLowerCase();
    return haystack.includes(normalizedQuery.toLowerCase());
  });

  const sortBy = query.sortBy || "orderDate";
  const sortOrder = query.order || "desc";
  items = sortItems(items, sortBy, sortOrder);
  return applyPagination(items, query);
};

export const getOrder = (orderId) => state.orders.find((order) => order.id === orderId || order.orderId === orderId) || null;

export const updateOrderStatus = (orderId, status) => {
  const index = state.orders.findIndex((order) => order.id === orderId || order.orderId === orderId);
  if (index === -1) return null;
  state.orders[index].orderStatus = status;
  state.orders[index].updatedAt = new Date().toISOString();
  return state.orders[index];
};

export const getCustomers = (query = {}) => {
  const normalizedQuery = normalizeQuery(query.q);
  const statusFilter = normalizeQuery(query.status);
  let items = state.customers.filter((customer) => {
    if (statusFilter && customer.status !== statusFilter) return false;
    if (!normalizedQuery) return true;
    const haystack = `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase();
    return haystack.includes(normalizedQuery.toLowerCase());
  });

  const sortBy = query.sortBy || "name";
  const sortOrder = query.order || "asc";
  items = sortItems(items, sortBy, sortOrder);
  return applyPagination(items, query);
};

export const getCustomer = (customerId) => state.customers.find((customer) => customer.id === customerId) || null;

export const updateCustomerStatus = (customerId, status) => {
  const index = state.customers.findIndex((customer) => customer.id === customerId);
  if (index === -1) return null;
  state.customers[index].status = status;
  return state.customers[index];
};

export const getCoupons = (query = {}) => {
  const normalizedQuery = normalizeQuery(query.q);
  const statusFilter = normalizeQuery(query.status);
  let items = state.coupons.filter((coupon) => {
    if (statusFilter && coupon.status !== statusFilter) return false;
    if (!normalizedQuery) return true;
    const haystack = `${coupon.code} ${coupon.description}`.toLowerCase();
    return haystack.includes(normalizedQuery.toLowerCase());
  });

  return applyPagination(items, query);
};

export const getCoupon = (couponId) => state.coupons.find((coupon) => coupon.id === couponId) || null;

export const createCoupon = (payload = {}) => {
  const created = {
    id: createId("coupon"),
    code: payload.code || "NEWCOUPON",
    description: payload.description || "",
    discountType: payload.discountType || "percent",
    discount: parseNumber(payload.discount, 0),
    status: payload.status || "active",
    expiresAt: payload.expiresAt || null,
    usageLimit: payload.usageLimit ?? null,
  };
  state.coupons.unshift(created);
  return created;
};

export const updateCoupon = (couponId, payload = {}) => {
  const index = state.coupons.findIndex((coupon) => coupon.id === couponId);
  if (index === -1) return null;
  state.coupons[index] = { ...state.coupons[index], ...payload };
  return state.coupons[index];
};

export const deleteCoupon = (couponId) => {
  const index = state.coupons.findIndex((coupon) => coupon.id === couponId);
  if (index === -1) return null;
  const [removed] = state.coupons.splice(index, 1);
  return removed;
};

export const getReviews = (query = {}) => {
  const normalizedQuery = normalizeQuery(query.q);
  const statusFilter = normalizeQuery(query.status);
  let items = state.reviews.filter((review) => {
    if (statusFilter && review.status !== statusFilter) return false;
    if (!normalizedQuery) return true;
    const haystack = `${review.reviewer} ${review.productName} ${review.comment}`.toLowerCase();
    return haystack.includes(normalizedQuery.toLowerCase());
  });

  return applyPagination(items, query);
};

export const updateReviewStatus = (reviewId, status) => {
  const index = state.reviews.findIndex((review) => review.id === reviewId);
  if (index === -1) return null;
  state.reviews[index].status = status;
  return state.reviews[index];
};

export const deleteReview = (reviewId) => {
  const index = state.reviews.findIndex((review) => review.id === reviewId);
  if (index === -1) return null;
  const [removed] = state.reviews.splice(index, 1);
  return removed;
};

export const getSettings = () => ({ ...state.settings });

export const updateSettings = (payload = {}) => {
  state.settings = {
    ...state.settings,
    ...payload,
    paymentMethods: Array.isArray(payload.paymentMethods) ? payload.paymentMethods : state.settings.paymentMethods,
  };
  return { ...state.settings };
};

export const getDashboardSummary = () => {
  const totalProducts = state.products.length;
  const totalCategories = state.categories.length;
  const totalCustomers = state.customers.length;
  const totalOrders = state.orders.length;
  const revenue = state.orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const pendingOrders = state.orders.filter((order) => order.orderStatus === "pending" || order.orderStatus === "processing").length;
  const lowStockProducts = state.products.filter((item) => Number(item.stock || 0) > 0 && Number(item.stock || 0) <= 10);
  const outOfStockProducts = state.products.filter((item) => Number(item.stock || 0) === 0);

  return {
    totalProducts,
    totalCategories,
    totalCustomers,
    totalOrders,
    revenue,
    pendingOrders,
    lowStockCount: lowStockProducts.length,
    outOfStockCount: outOfStockProducts.length,
    lowStockProducts: lowStockProducts.slice(0, 5),
    recentOrders: state.orders.slice(0, 5),
    recentCustomers: state.customers.slice(0, 5),
  };
};
