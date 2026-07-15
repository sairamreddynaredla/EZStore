import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../context/toast-context";
import { getSettings, updateSettings } from "../services/settingsService";
import SettingsCard from "../components/SettingsCard";
import ToggleSwitch from "../components/ToggleSwitch";
import PageHeader from "../components/PageHeader";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD"];
const TIME_ZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "hi", label: "Hindi" },
];
const PAYMENT_METHODS = [
  { value: "card", label: "Credit / Debit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash_on_delivery", label: "Cash on Delivery" },
];

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [initialSettings, setInitialSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const { success, error } = useToast();

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setFormError("");
    try {
      const data = await getSettings();
      setSettings({
        ...data,
        adminPassword: "",
        confirmAdminPassword: "",
        logoFile: null,
        faviconFile: null,
        removeLogo: data.removeLogo ?? false,
        removeFavicon: data.removeFavicon ?? false,
      });
      setInitialSettings(data);
    } catch (loadError) {
      setFormError("Unable to load settings. Please refresh or try again later.");
      error(loadError?.response?.data?.message || "Unable to load settings.");
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadSettings();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadSettings]);

  const logoPreviewUrl = useMemo(() => {
    if (!settings) return "";
    if (settings.logoFile instanceof File) {
      return URL.createObjectURL(settings.logoFile);
    }
    return settings.logoUrl || "";
  }, [settings]);

  const faviconPreviewUrl = useMemo(() => {
    if (!settings) return "";
    if (settings.faviconFile instanceof File) {
      return URL.createObjectURL(settings.faviconFile);
    }
    return settings.faviconUrl || "";
  }, [settings]);

  const isDirty = useMemo(() => {
    if (!settings || !initialSettings) return false;
    if (settings.logoFile || settings.faviconFile) return true;

    const autoSavedFields = [
      "emailNotificationsEnabled",
      "orderNotificationsEnabled",
      "registrationNotificationsEnabled",
      "cashOnDeliveryEnabled",
      "onlinePaymentEnabled",
      "twoFactorEnabled",
    ];

    const clean = (source) => {
      const cleaned = { ...source };
      delete cleaned.adminPassword;
      delete cleaned.confirmAdminPassword;
      delete cleaned.logoFile;
      delete cleaned.faviconFile;
      // remove fields that are saved instantly so Save/Reset reflect only manual form edits
      autoSavedFields.forEach((f) => delete cleaned[f]);
      return cleaned;
    };

    return JSON.stringify(clean(settings)) !== JSON.stringify(clean(initialSettings));
  }, [settings, initialSettings]);

  const updateField = (field, value) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
      ...(field === "logoFile" ? { removeLogo: false } : {}),
      ...(field === "faviconFile" ? { removeFavicon: false } : {}),
    }));
  };

  const updatePaymentMethod = (method) => {
    setSettings((current) => {
      const methods = Array.isArray(current.paymentMethods) ? current.paymentMethods : [];
      const nextMethods = methods.includes(method)
        ? methods.filter((item) => item !== method)
        : [...methods, method];
      return { ...current, paymentMethods: nextMethods };
    });
  };

  // Save a single setting immediately (optimistic update + API save)
  const saveQuickSetting = async (field, value) => {
    if (!settings) return;

    const next = { ...settings, [field]: value };
    setSettings(next);
    setFormError("");

    try {
      const saved = await updateSettings(next);
      setInitialSettings(saved);
      success("Setting updated.");
    } catch (saveErr) {
      const message = saveErr?.response?.data?.message || "Unable to update setting.";
      setFormError(message);
      error(message);
      // revert to last known saved settings when available
      if (initialSettings) setSettings(initialSettings);
    }
  };

  const clearLogo = () => {
    setSettings((current) => ({
      ...current,
      logoFile: null,
      logoUrl: "",
      removeLogo: Boolean(current.logoUrl),
    }));
  };

  const clearFavicon = () => {
    setSettings((current) => ({
      ...current,
      faviconFile: null,
      faviconUrl: "",
      removeFavicon: Boolean(current.faviconUrl),
    }));
  };

  const validateSettings = () => {
    if (!settings?.storeName?.trim()) return "Store Name is required.";
    if (!settings?.contactEmail?.trim()) return "Contact Email is required.";
    if (!settings?.supportEmail?.trim()) return "Support Email is required.";
    if (!settings?.currencySymbol?.trim()) return "Currency Symbol is required.";
    if (settings?.taxEnabled && (settings.taxPercentage < 0 || settings.taxPercentage > 100)) {
      return "Tax percentage must be between 0 and 100.";
    }
    if (settings?.adminPassword && settings.adminPassword !== settings.confirmAdminPassword) {
      return "Password and confirmation do not match.";
    }
    if (settings?.sessionTimeoutMinutes <= 0) return "Session timeout must be greater than zero.";
    return "";
  };

  const handleReset = () => {
    if (!initialSettings) return;
    const confirmed = window.confirm("Reset settings to the last saved values? Unsaved changes will be lost.");
    if (!confirmed) return;

    setSettings({
      ...initialSettings,
      adminPassword: "",
      confirmAdminPassword: "",
      logoFile: null,
      faviconFile: null,
      removeLogo: initialSettings.removeLogo ?? false,
      removeFavicon: initialSettings.removeFavicon ?? false,
    });
    setFormError("");
  };

  const handleSave = async () => {
    if (!settings) return;
    const validationMessage = validateSettings();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    const criticalChange = Boolean(settings.adminPassword || settings.removeLogo || settings.removeFavicon);
    if (criticalChange) {
      const confirmed = window.confirm("You are applying a password or media change. Continue?");
      if (!confirmed) return;
    }

    setSaving(true);
    setFormError("");

    try {
      const payload = {
        ...settings,
      };

      delete payload.logoPreview;
      delete payload.faviconPreview;
      delete payload.confirmAdminPassword;

      const saved = await updateSettings(payload);
      setSettings({
        ...saved,
        adminPassword: "",
        confirmAdminPassword: "",
        logoFile: null,
        faviconFile: null,
        removeLogo: saved.removeLogo ?? false,
        removeFavicon: saved.removeFavicon ?? false,
      });
      setInitialSettings(saved);
      success("Settings saved successfully.");
    } catch (saveError) {
      const message = saveError.response?.data?.message || "Unable to save settings. Please try again.";
      setFormError(message);
      error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-8 w-48 animate-pulse rounded-2xl bg-slate-100" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded-2xl bg-slate-100" />
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-60 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage store branding, localization, tax, shipping, payments, notifications, and security."
        actions={[
          <button
            key="reset-settings"
            type="button"
            onClick={handleReset}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            disabled={!isDirty || saving}
          >
            Reset
          </button>,
          <button
            key="save-settings"
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!isDirty || saving}
          >
            {saving ? "Saving settings..." : "Save settings"}
          </button>,
        ]}
      />

      {formError && <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{formError}</div>}

      <div className="grid gap-6 xl:grid-cols-2">
        <SettingsCard title="General settings" description="Basic store and contact information.">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Store Name</span>
              <input
                type="text"
                value={settings.storeName}
                onChange={(event) => updateField("storeName", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Contact Email</span>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(event) => updateField("contactEmail", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Support Email</span>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(event) => updateField("supportEmail", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Contact Phone</span>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(event) => updateField("contactPhone", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
            </label>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Store Description</span>
            <textarea
              value={settings.storeDescription}
              rows={4}
              onChange={(event) => updateField("storeDescription", event.target.value)}
              className="w-full rounded-3xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Store Address</span>
            <textarea
              value={settings.storeAddress}
              rows={3}
              onChange={(event) => updateField("storeAddress", event.target.value)}
              className="w-full rounded-3xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </label>
        </SettingsCard>

        <SettingsCard title="Localization" description="Set currency, timezone, and language preferences.">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Default Currency</span>
              <select
                value={settings.defaultCurrency}
                onChange={(event) => updateField("defaultCurrency", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Currency Symbol</span>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(event) => updateField("currencySymbol", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Time Zone</span>
              <select
                value={settings.timeZone}
                onChange={(event) => updateField("timeZone", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              >
                {TIME_ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Language</span>
              <select
                value={settings.language}
                onChange={(event) => updateField("language", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              >
                {LANGUAGES.map((locale) => (
                  <option key={locale.value} value={locale.value}>
                    {locale.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </SettingsCard>

        <SettingsCard title="Tax settings" description="Enable tax and configure GST/VAT settings.">
          <div className="space-y-4">
            <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
              <input
                type="checkbox"
                checked={settings.taxEnabled}
                onChange={(event) => updateField("taxEnabled", event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-slate-700">Enable tax calculation</span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Tax Percentage</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={settings.taxPercentage}
                  onChange={(event) => updateField("taxPercentage", Number(event.target.value))}
                  className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">GST / VAT Number</span>
                <input
                  type="text"
                  value={settings.gstVatNumber}
                  onChange={(event) => updateField("gstVatNumber", event.target.value)}
                  className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
                />
              </label>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Shipping settings" description="Control shipping charges and delivery estimates.">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Free Shipping Threshold</span>
              <input
                type="number"
                min={0}
                value={settings.freeShippingThreshold}
                onChange={(event) => updateField("freeShippingThreshold", Number(event.target.value))}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Flat Shipping Charge</span>
              <input
                type="number"
                min={0}
                value={settings.flatShippingCharge}
                onChange={(event) => updateField("flatShippingCharge", Number(event.target.value))}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Estimated Delivery Days</span>
              <input
                type="number"
                min={1}
                value={settings.estimatedDeliveryDays}
                onChange={(event) => updateField("estimatedDeliveryDays", Number(event.target.value))}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
            </label>
          </div>
        </SettingsCard>

        <SettingsCard title="Payment settings" description="Configure supported payment methods and toggles.">
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
              {PAYMENT_METHODS.map((method) => (
                <label key={method.value} className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={settings.paymentMethods?.includes(method.value)}
                    onChange={() => updatePaymentMethod(method.value)}
                    className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">{method.label}</span>
                </label>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToggleSwitch
                label="Cash on Delivery"
                description="Allow customers to pay with cash when the order is delivered."
                checked={settings.cashOnDeliveryEnabled}
                onChange={(value) => saveQuickSetting("cashOnDeliveryEnabled", value)}
              />
              <ToggleSwitch
                label="Online payment"
                description="Accept card, PayPal, and bank transfer payments."
                checked={settings.onlinePaymentEnabled}
                onChange={(value) => saveQuickSetting("onlinePaymentEnabled", value)}
              />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Notification settings" description="Toggle essential store notifications.">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            <ToggleSwitch
              label="Email notifications"
              description="Send administrative email alerts for store activity."
              checked={settings.emailNotificationsEnabled}
              onChange={(value) => saveQuickSetting("emailNotificationsEnabled", value)}
            />
            <ToggleSwitch
              label="Order notifications"
              description="Notify your team when a new order is placed."
              checked={settings.orderNotificationsEnabled}
              onChange={(value) => saveQuickSetting("orderNotificationsEnabled", value)}
            />
            <ToggleSwitch
              label="Customer registration notifications"
              description="Receive alerts when new customers register."
              checked={settings.registrationNotificationsEnabled}
              onChange={(value) => saveQuickSetting("registrationNotificationsEnabled", value)}
            />
          </div>
        </SettingsCard>

        <SettingsCard title="Security settings" description="Update admin security and session rules.">
          <div className="grid gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">New admin password</span>
              <input
                type="password"
                value={settings.adminPassword}
                onChange={(event) => updateField("adminPassword", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
                placeholder="Enter new password"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Confirm password</span>
              <input
                type="password"
                value={settings.confirmAdminPassword}
                onChange={(event) => updateField("confirmAdminPassword", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
                placeholder="Repeat password"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Session timeout (minutes)</span>
                <input
                  type="number"
                  min={1}
                  value={settings.sessionTimeoutMinutes}
                  onChange={(event) => updateField("sessionTimeoutMinutes", Number(event.target.value))}
                  className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
                />
              </label>
              <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Two-factor authentication</p>
                  <p className="mt-1 text-sm text-slate-500">Enable UI readiness for admin two-factor authentication.</p>
                </div>
                <button
                  type="button"
                  onClick={() => saveQuickSetting("twoFactorEnabled", !settings.twoFactorEnabled)}
                    className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold transition ${settings.twoFactorEnabled ? "bg-primary-600 text-white" : "bg-slate-200 text-slate-800"}`}
                >
                  {settings.twoFactorEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Media settings" description="Upload and preview store logo and favicon.">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">Store logo</p>
                <div className="mt-4 flex h-28 items-center justify-center overflow-hidden rounded-3xl bg-white border border-dashed border-slate-200">
                  {logoPreviewUrl ? (
                    <img src={logoPreviewUrl} alt="Logo preview" className="max-h-full object-contain" />
                  ) : (
                    <span className="text-sm text-slate-400">No logo uploaded</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-2xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
                    Upload logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => updateField("logoFile", event.target.files?.[0] ?? null)}
                      className="sr-only"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">Favicon</p>
                <div className="mt-4 flex h-20 items-center justify-center overflow-hidden rounded-3xl bg-white border border-dashed border-slate-200">
                  {faviconPreviewUrl ? (
                    <img src={faviconPreviewUrl} alt="Favicon preview" className="max-h-full object-contain" />
                  ) : (
                    <span className="text-sm text-slate-400">No favicon uploaded</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-2xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
                    Upload favicon
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => updateField("faviconFile", event.target.files?.[0] ?? null)}
                      className="sr-only"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={clearFavicon}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

export default SettingsPage;
