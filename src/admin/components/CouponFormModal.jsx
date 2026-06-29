import { useEffect, useState } from "react";

const defaultFormState = {
  code: "",
  description: "",
  discount: "",
  discountType: "percentage",
  shippingDiscount: false,
  usageLimit: "",
  expiresAt: "",
  status: "active",
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const discountTypeOptions = [
  { value: "percentage", label: "% Off" },
  { value: "amount", label: "$ Off" },
];

const CouponFormModal = ({ visible, onClose, onSave, initialCoupon, isSaving, error, title }) => {
  const [form, setForm] = useState(defaultFormState);
  const [validation, setValidation] = useState({});

  useEffect(() => {
    if (!visible) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      ...defaultFormState,
      ...initialCoupon,
      discount: initialCoupon?.discount ?? "",
      usageLimit: initialCoupon?.usageLimit ?? "",
      expiresAt: initialCoupon?.expiresAt?.split("T")[0] ?? "",
      shippingDiscount: Boolean(initialCoupon?.shippingDiscount),
    });
    setValidation({});
  }, [visible, initialCoupon]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!form.code.trim()) errors.code = "Coupon code is required.";
    if (!form.discount && !form.shippingDiscount) errors.discount = "Discount amount or shipping discount is required.";
    if (form.discount && Number(form.discount) < 0) errors.discount = "Discount must be zero or higher.";
    if (form.usageLimit && Number(form.usageLimit) < 0) errors.usageLimit = "Usage limit must be zero or higher.";
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSave({
      code: form.code.trim(),
      description: form.description.trim(),
      discount: form.discount ? Number(form.discount) : 0,
      discountType: form.discountType,
      shippingDiscount: form.shippingDiscount,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      expiresAt: form.expiresAt || null,
      status: form.status,
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">Configure coupon details, usage limits, and expiration.</p>
          </div>
          <button type="button" className="rounded-2xl px-3 py-2 text-slate-600 hover:bg-slate-100" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="space-y-6 px-6 py-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Code</span>
              <input
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
              {validation.code && <p className="text-sm text-rose-600">{validation.code}</p>}
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Discount type</span>
              <select
                value={form.discountType}
                onChange={(e) => handleChange("discountType", e.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              >
                {discountTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Discount value</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.discount}
                onChange={(e) => handleChange("discount", e.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
                disabled={form.shippingDiscount}
              />
              {validation.discount && <p className="text-sm text-rose-600">{validation.discount}</p>}
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Usage limit</span>
              <input
                type="number"
                min="0"
                value={form.usageLimit}
                onChange={(e) => handleChange("usageLimit", e.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
              {validation.usageLimit && <p className="text-sm text-rose-600">{validation.usageLimit}</p>}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2 items-end">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Expires at</span>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => handleChange("expiresAt", e.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
            </label>
            <ToggleSwitch
              label="Free shipping coupon"
              checked={form.shippingDiscount}
              onChange={(value) => handleChange("shippingDiscount", value)}
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSaving ? "Saving..." : "Save coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponFormModal;
