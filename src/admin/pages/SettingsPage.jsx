import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../../context/toast-context";
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
  const [formTouched, setFormTouched] = useState(false);
  const [formError, setFormError] = useState("");
  const { success, error } = useToast();

  const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
    if (!err) return fallback;
    if (typeof err === "string") return err;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
    return fallback;
  };

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setFormError("");
    setFormTouched(false);
    try {
      const data = await getSettings();
      const { removeLogo, removeFavicon, ...cleanedData } = data;
      setSettings({
        ...cleanedData,
        adminPassword: "",
        confirmAdminPassword: "",
      });
      setInitialSettings(cleanedData);
    } catch (loadError) {
      const message = getErrorMessage(loadError, "Unable to load settings. Please refresh or try again later.");
      setFormError(message);
      error(message);
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


  const isDirty = useMemo(() => {
    if (!settings || !initialSettings) return false;

    const clean = (source) => {
      const cleaned = { ...source };
      delete cleaned.adminPassword;
      delete cleaned.confirmAdminPassword;
      return cleaned;
    };

    return JSON.stringify(clean(settings)) !== JSON.stringify(clean(initialSettings));
  }, [settings, initialSettings]);

  const hasUnsavedChanges = isDirty || formTouched;
  const saveButtonText = saving
    ? "Saving settings..."
    : hasUnsavedChanges
    ? "Save settings"
    : "No changes to save";
  const resetButtonText = hasUnsavedChanges ? "Reset changes" : "Reset";

  const updateField = (field, value) => {
    setFormTouched(true);
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updatePaymentMethod = (method) => {
    setFormTouched(true);
    setSettings((current) => {
      const methods = Array.isArray(current.paymentMethods) ? current.paymentMethods : [];
      const nextMethods = methods.includes(method)
        ? methods.filter((item) => item !== method)
        : [...methods, method];
      return { ...current, paymentMethods: nextMethods };
    });
  };

  // Save a single setting immediately (optimistic update + API save)
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

    const { removeLogo, removeFavicon, ...cleanedInitialSettings } = initialSettings;
    setSettings({
      ...cleanedInitialSettings,
      adminPassword: "",
      confirmAdminPassword: "",
    });
    setFormError("");
    setFormTouched(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    const validationMessage = validateSettings();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    const criticalChange = Boolean(settings.adminPassword);
    if (criticalChange) {
      const confirmed = window.confirm("You are applying a password change. Continue?");
      if (!confirmed) return;
    }

    setSaving(true);
    setFormError("");

    try {
      const payload = {
        ...settings,
      };

      delete payload.confirmAdminPassword;
      delete payload.removeLogo;
      delete payload.removeFavicon;

      const saved = await updateSettings(payload);
      const { removeLogo, removeFavicon, ...cleanedSaved } = saved;
      setSettings({
        ...cleanedSaved,
        adminPassword: "",
        confirmAdminPassword: "",
      });
      setInitialSettings(saved);
      setFormTouched(false);
      success("Settings saved successfully.");
    } catch (saveError) {
      const message = getErrorMessage(saveError, "Unable to save settings. Please try again.");
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
            className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:border-slate-200 disabled:text-slate-500 disabled:bg-slate-100"
            disabled={!hasUnsavedChanges || saving}
          >
            {resetButtonText}
          </button>,
          <button
            key="save-settings"
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            disabled={!hasUnsavedChanges || saving}
          >
            {saveButtonText}
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
            <ToggleSwitch
              label="Enable tax calculation"
              description="Calculate tax on checkout totals."
              checked={settings.taxEnabled}
              onChange={(value) => updateField("taxEnabled", value)}
            />

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
                <ToggleSwitch
                  key={method.value}
                  label={method.label}
                  checked={settings.paymentMethods?.includes(method.value)}
                  onChange={() => updatePaymentMethod(method.value)}
                />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToggleSwitch
                label="Cash on Delivery"
                description="Allow customers to pay with cash when the order is delivered."
                checked={settings.cashOnDeliveryEnabled}
                onChange={(value) => updateField("cashOnDeliveryEnabled", value)}
              />
              <ToggleSwitch
                label="Online payment"
                description="Accept card, PayPal, and bank transfer payments."
                checked={settings.onlinePaymentEnabled}
                onChange={(value) => updateField("onlinePaymentEnabled", value)}
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
              onChange={(value) => updateField("emailNotificationsEnabled", value)}
            />
            <ToggleSwitch
              label="Order notifications"
              description="Notify your team when a new order is placed."
              checked={settings.orderNotificationsEnabled}
              onChange={(value) => updateField("orderNotificationsEnabled", value)}
            />
            <ToggleSwitch
              label="Customer registration notifications"
              description="Receive alerts when new customers register."
              checked={settings.registrationNotificationsEnabled}
              onChange={(value) => updateField("registrationNotificationsEnabled", value)}
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
              <ToggleSwitch
                label="Two-factor authentication"
                description="Enable UI readiness for admin two-factor authentication."
                checked={settings.twoFactorEnabled}
                onChange={(value) => updateField("twoFactorEnabled", value)}
              />
            </div>
          </div>
        </SettingsCard>

      </div>
    </div>
  );
};

export default SettingsPage;
