import { useEffect, useMemo, useState } from "react";
import AdminDialog from "./common/Dialog";
import Select from "./common/Select";

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

const CategoryFormModal = ({ visible, onClose, onSave, initialCategory, isSaving, error, title }) => {
  const [form, setForm] = useState(defaultFormState);
  const [validation, setValidation] = useState({});

  useEffect(() => {
    if (!visible) return;

    setForm({
      ...defaultFormState,
      ...initialCategory,
    });
    setValidation({});
  }, [visible, initialCategory]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
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
    });
  };

  if (!visible) return null;

  return (
    <AdminDialog open={visible} onOpenChange={onClose} title={title} description="Manage category details and status.">
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
              <div className="space-y-2">
              <Select
                label="Status"
                value={form.status}
                onValueChange={(value) => handleChange("status", value)}
                options={statusOptions}
              />
              {validation.status && <p className="text-sm text-rose-600">{validation.status}</p>}
            </div>
          </div>

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
    </AdminDialog>
  );
};

export default CategoryFormModal;
