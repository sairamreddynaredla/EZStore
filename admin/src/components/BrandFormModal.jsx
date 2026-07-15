import { useEffect, useMemo, useState } from "react";

const defaultFormState = {
  name: "",
  slug: "",
  description: "",
  status: "active",
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const BrandFormModal = ({ visible, onClose, onSave, initialBrand, isSaving, error, title }) => {
  const [form, setForm] = useState(defaultFormState);
  const [validation, setValidation] = useState({});

  useEffect(() => {
    if (!visible) return;

    setForm({
      ...defaultFormState,
      ...initialBrand,
    });
    setValidation({});
  }, [visible, initialBrand]);

  const previewName = useMemo(() => form.name.trim() || "New brand", [form.name]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Brand name is required.";
    if (!form.slug.trim()) errors.slug = "Brand slug is required.";
    if (!form.status) errors.status = "Status is required.";
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSave({
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
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
            <p className="text-sm text-slate-500">Manage brand details and status.</p>
          </div>
          <button type="button" className="rounded-2xl px-3 py-2 text-slate-600 hover:bg-slate-100" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="space-y-6 px-6 py-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
              {validation.name && <p className="text-sm text-rose-600">{validation.name}</p>}
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => handleChange("slug", event.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
              {validation.slug && <p className="text-sm text-rose-600">{validation.slug}</p>}
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              value={form.status}
              onChange={(event) => handleChange("status", event.target.value)}
              className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {validation.status && <p className="text-sm text-rose-600">{validation.status}</p>}
          </label>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Preview: <span className="font-semibold text-slate-900">{previewName}</span>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" className="rounded-2xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-100" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300">
              {isSaving ? "Saving..." : "Save brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandFormModal;
