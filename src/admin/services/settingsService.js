import adminApi from "./api";

const SETTINGS_STORAGE_KEY = "ezstore_admin_settings";

const DEFAULT_SETTINGS = {
  storeName: "EZStore",
  storeDescription: "",
  contactEmail: "support@ezstore.com",
  contactPhone: "",
  supportEmail: "support@ezstore.com",
  storeAddress: "",
  defaultCurrency: "USD",
  currencySymbol: "$",
  timeZone: "UTC",
  language: "en",
  taxEnabled: false,
  taxPercentage: 5,
  gstVatNumber: "",
  freeShippingThreshold: 0,
  flatShippingCharge: 0,
  estimatedDeliveryDays: 3,
  paymentMethods: ["card", "paypal", "bank_transfer", "cash_on_delivery"],
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
};

const getStoredSettings = () => {
  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredSettings = (settings) => {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Silence localStorage failures
  }
};

const normalizeSettings = (data = {}) => ({
  ...DEFAULT_SETTINGS,
  ...data,
  paymentMethods: Array.isArray(data.paymentMethods) ? data.paymentMethods : DEFAULT_SETTINGS.paymentMethods,
  logoUrl: data.logoUrl ?? data.storeLogoUrl ?? "",
  faviconUrl: data.faviconUrl ?? data.storeFaviconUrl ?? "",
  gstVatNumber: data.gstVatNumber ?? data.gstNumber ?? data.vatNumber ?? "",
});

const buildSettingsPayload = (settings) => {
  const payload = {
    storeName: settings.storeName,
    storeDescription: settings.storeDescription,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    supportEmail: settings.supportEmail,
    storeAddress: settings.storeAddress,
    defaultCurrency: settings.defaultCurrency,
    currencySymbol: settings.currencySymbol,
    timeZone: settings.timeZone,
    language: settings.language,
    taxEnabled: settings.taxEnabled,
    taxPercentage: settings.taxPercentage,
    gstVatNumber: settings.gstVatNumber,
    freeShippingThreshold: settings.freeShippingThreshold,
    flatShippingCharge: settings.flatShippingCharge,
    estimatedDeliveryDays: settings.estimatedDeliveryDays,
    paymentMethods: settings.paymentMethods,
    cashOnDeliveryEnabled: settings.cashOnDeliveryEnabled,
    onlinePaymentEnabled: settings.onlinePaymentEnabled,
    emailNotificationsEnabled: settings.emailNotificationsEnabled,
    orderNotificationsEnabled: settings.orderNotificationsEnabled,
    registrationNotificationsEnabled: settings.registrationNotificationsEnabled,
    sessionTimeoutMinutes: settings.sessionTimeoutMinutes,
    twoFactorEnabled: settings.twoFactorEnabled,
    removeLogo: settings.removeLogo,
    removeFavicon: settings.removeFavicon,
  };

  if (settings.adminPassword) {
    payload.adminPassword = settings.adminPassword;
  }

  const containsFile = settings.logoFile instanceof File || settings.faviconFile instanceof File;

  if (!containsFile) {
    return payload;
  }

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  if (settings.logoFile instanceof File) {
    formData.append("logo", settings.logoFile);
  }

  if (settings.faviconFile instanceof File) {
    formData.append("favicon", settings.faviconFile);
  }

  return formData;
};

export const getSettings = async () => {
  try {
    const response = await adminApi.get("/settings");
    const data = normalizeSettings(response.data);
    setStoredSettings(data);
    return data;
  } catch {
    const storedSettings = getStoredSettings();
    if (storedSettings) {
      return normalizeSettings(storedSettings);
    }
    return DEFAULT_SETTINGS;
  }
};

export const updateSettings = async (settings) => {
  const payload = buildSettingsPayload(settings);
  const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;

  try {
    const response = await adminApi.put("/settings", payload, config);
    const data = normalizeSettings(response.data);
    setStoredSettings(data);
    return data;
  } catch (updateError) {
    setStoredSettings(normalizeSettings(settings));
    throw updateError;
  }
};
