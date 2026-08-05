import { useEffect, useMemo, useState } from "react";
import AdminDialog from "./common/Dialog";
import Select from "./common/Select";
import { resolveAdminProductImage } from "../utils/productImage";

const defaultFormState = {
  title: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  stock: "",
  status: "active",
  tags: "",
  imageUrl: "",
  images: [],
  existingImages: [],
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft", label: "Draft" },
];

const ProductFormModal = ({
  visible,
  onClose,
  onSave,
  initialProduct,
  isSaving,
  error,
  title,
}) => {
  const [form, setForm] = useState(defaultFormState);
  const [validation, setValidation] = useState({});

  useEffect(() => {
    if (!visible) return;

    const normalized = {
      ...defaultFormState,
      ...initialProduct,
      price: initialProduct?.price ?? "",
      stock: initialProduct?.stock ?? initialProduct?.rating?.count ?? "",
      tags: Array.isArray(initialProduct?.tags) ? initialProduct.tags.join(", ") : initialProduct?.tags || "",
      existingImages: Array.isArray(initialProduct?.images) ? initialProduct.images : initialProduct?.existingImages || [],
      imageUrl: initialProduct?.image ?? initialProduct?.imageUrl ?? "",
    };

    setForm(normalized);
    setValidation({});
  }, [visible, initialProduct]);

  const imagePreviews = useMemo(() => {
    const previews = [];
    const normalizedExistingImages = Array.isArray(form.existingImages) ? form.existingImages.filter(Boolean) : [];
    const normalizedImageUrl = form.imageUrl || initialProduct?.image || initialProduct?.imageUrl || "";

    if (normalizedImageUrl) {
      previews.push(normalizedImageUrl);
    }

    if (normalizedExistingImages.length) {
      previews.push(...normalizedExistingImages);
    }

    if (Array.isArray(form.images)) {
      form.images.forEach((file) => {
        if (file instanceof File) {
          previews.push(URL.createObjectURL(file));
        }
      });
    }

    return previews.filter(Boolean);
  }, [form.imageUrl, form.existingImages, form.images, initialProduct]);

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setForm((current) => ({
      ...current,
      images: [...(current.images || []), ...files],
    }));
  };

  const handleRemoveExistingImage = (index) => {
    setForm((current) => ({
      ...current,
      existingImages: current.existingImages.filter((_, idx) => idx !== index),
    }));
  };

  const handleRemoveNewImage = (index) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, idx) => idx !== index),
    }));
  };

  const validate = () => {
    const errors = {};

    if (!form.title.trim()) {
      errors.title = "Title is required.";
    }
    if (!form.price || Number(form.price) <= 0) {
      errors.price = "Price must be greater than zero.";
    }
    if (!form.category.trim()) {
      errors.category = "Category is required.";
    }
    if (!form.stock || Number(form.stock) < 0) {
      errors.stock = "Stock must be zero or higher.";
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      brand: form.brand,
      stock: Number(form.stock),
      status: form.status,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      existingImages: form.existingImages,
      images: form.images,
      imageUrl: form.imageUrl,
    };

    onSave(payload);
  };

  if (!visible) return null;

  return (
    <AdminDialog open={visible} onOpenChange={onClose} title={title} description="Manage product details and inventory.">
      <form className="space-y-6 px-6 py-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full rounded-xl border border-neutral-border px-4 py-3 bg-slate-50 focus:border-primary-500 focus:outline-none"
              />
              {validation.title && <p className="text-sm text-rose-600">{validation.title}</p>}
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Category</span>
              <input
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full rounded-xl border border-neutral-border px-4 py-3 bg-slate-50 focus:border-primary-500 focus:outline-none"
              />
              {validation.category && <p className="text-sm text-rose-600">{validation.category}</p>}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Price</span>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-border bg-slate-50 px-4 py-3">
                <span className="text-slate-500">$</span>
                <input
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full bg-transparent outline-none"
                />
              </div>
              {validation.price && <p className="text-sm text-rose-600">{validation.price}</p>}
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Stock</span>
              <input
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                type="number"
                min="0"
                className="w-full rounded-xl border border-neutral-border px-4 py-3 bg-slate-50 focus:border-primary-500 focus:outline-none"
              />
              {validation.stock && <p className="text-sm text-rose-600">{validation.stock}</p>}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Brand</span>
              <input
                value={form.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                className="w-full rounded-xl border border-neutral-border px-4 py-3 bg-slate-50 focus:border-primary-500 focus:outline-none"
              />
            </label>
            <div className="space-y-2">
              <Select
                label="Status"
                value={form.status}
                onValueChange={(value) => handleChange("status", value)}
                options={statusOptions}
              />
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-neutral-border px-4 py-3 bg-slate-50 focus:border-primary-500 focus:outline-none"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Tags</span>
            <input
              value={form.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="comma-separated tags"
              className="w-full rounded-xl border border-neutral-border px-4 py-3 bg-slate-50 focus:border-primary-500 focus:outline-none"
            />
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Product Images</span>
              <input type="file" multiple accept="image/*" onChange={handleImagesChange} />
            </div>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.length > 0 ? (
                imagePreviews.map((src, index) => (
                  <div key={`${src}-${index}`} className="relative w-24 overflow-hidden rounded-xl border border-neutral-border bg-slate-50">
                    <img
                      src={src.startsWith("blob:") || src.startsWith("data:") ? src : resolveAdminProductImage({ image: src, imageUrl: src, images: [src] })}
                      alt={`preview-${index}`}
                      className="h-24 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = resolveAdminProductImage({ image: null, imageUrl: null, images: [] });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => (index < (form.existingImages?.length ?? 0) ? handleRemoveExistingImage(index) : handleRemoveNewImage(index - (form.existingImages?.length ?? 0)))}
                      className="absolute right-1 top-1 rounded-full bg-white/90 px-2 text-sm text-slate-600 shadow-sm"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                  No image
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex items-center justify-end gap-3 border-t border-neutral-border pt-4">
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSaving ? "Saving..." : "Save product"}
            </button>
          </div>
        </form>
    </AdminDialog>
  );
};

export default ProductFormModal;
