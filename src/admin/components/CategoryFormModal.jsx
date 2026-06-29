import { useEffect, useMemo, useState } from "react";

const defaultFormState = {
  name: "",
  slug: "",
  description: "",
  status: "active",
  bannerUrl: "",
  bannerFile: null,
  existingBanner: "",
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const CategoryFormModal = ({ visible, onClose, onSave, initialCategory, isSaving, error, title }) => {
  const [form, setForm] = useState(defaultFormState);
  const [validation, setValidation] = useState({});

  useEffect(() => {
    if (!visible) return;

    setForm({
      ...defaultFormState,
      ...initialCategory,
      bannerUrl: initialCategory?.banner || initialCategory?.bannerUrl || "",
      existingBanner: initialCategory?.banner || initialCategory?.bannerUrl || "",
      bannerFile: null,
    });
    setValidation({});
  }, [visible, initialCategory]);

  const previewUrl = useMemo(() => {
    if (form.bannerFile instanceof File) {
      return URL.createObjectURL(form.bannerFile);
    }
    if (form.existingBanner) {
      return form.existingBanner;
    }
    return null;
  }, [form.bannerFile, form.existingBanner]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleBannerChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm((current) => ({ ...current, bannerFile: file, existingBanner: current.existingBanner }));
  };

  const handleRemoveBanner = () => {
    setForm((current) => ({ ...current, bannerFile: null, existingBanner: "", bannerUrl: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Category name is required.";
    if (!form.slug.trim()) errors.slug = "Category slug is required.";
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
      bannerUrl: form.bannerUrl.trim(),
      existingBanner: form.existingBanner,
      bannerFile: form.bannerFile,
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">Manage category details, banner image, and status.</p>
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
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
              {validation.name && <p className="text-sm text-rose-600">{validation.name}</p>}
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Slug</span>
              <input
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
              />
              {validation.slug && <p className="text-sm text-rose-600">{validation.slug}</p>}
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

          <div className="grid gap-4 md:grid-cols-2">
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
              {validation.status && <p className="text-sm text-rose-600">{validation.status}</p>}
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Banner image URL</span>
              <input
                value={form.bannerUrl}
                onChange={(e) => handleChange("bannerUrl", e.target.value)}
                className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none"
                placeholder="Optional external image URL"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Upload banner</span>
            <input type="file" accept="image/*" onChange={handleBannerChange} />
          </label>

          {previewUrl && (
            <div className="rounded-3xl border border-neutral-border bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Banner preview</p>
                <button type="button" className="text-sm text-rose-600 hover:text-rose-800" onClick={handleRemoveBanner}>
                  Remove
                </button>
              </div>
              <img src={previewUrl} alt="Category banner preview" className="h-48 w-full rounded-3xl object-cover" />
            </div>
          )}

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" className="rounded-2xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-100" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300">
              {isSaving ? "Saving..." : "Save category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
