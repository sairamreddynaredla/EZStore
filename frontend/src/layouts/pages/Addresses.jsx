import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import authApi from "../../services/authApi";
import { useToast } from "../../context/toast-context";

const emptyForm = {
  label: "Home",
  recipientName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { error, success } = useToast();

  const controllerRef = useRef(null);
  const hasSearchMounted = useRef(false);

  const loadAddresses = useCallback(async (nextPage = 1, signal) => {
    try {
      setLoading(true);
      const response = await authApi.get("/addresses", {
        params: { page: nextPage, limit: pageSize, q: search },
        signal,
      });
      setAddresses(response.data.addresses || []);
      setTotal(response.data.total || 0);
      setPage(response.data.page || 1);
    } catch (err) {
      if (err?.name === "CanceledError" || err?.message === "canceled") return;
      error(err.response?.data?.message || "Unable to load saved addresses.");
    } finally {
      setLoading(false);
    }
  }, [pageSize, search, error]);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    const run = async () => {
      await loadAddresses(1, controller.signal);
    };
    run();
    return () => controller.abort();
  }, [loadAddresses]);

  useEffect(() => {
    if (!hasSearchMounted.current) {
      hasSearchMounted.current = true;
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    const debounce = setTimeout(() => {
      const run = async () => {
        await loadAddresses(1, controller.signal);
      };
      run();
    }, 250);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [loadAddresses, search]);

  const filteredAddresses = useMemo(() => addresses.filter((address) => {
    const haystack = `${address.label || ""} ${address.recipientName || ""} ${address.city || ""}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  }), [addresses, search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await authApi.patch(`/addresses/${editingId}`, form);
        success("Address updated.");
      } else {
        await authApi.post("/addresses", form);
        success("Address saved.");
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadAddresses(page);
    } catch (err) {
      error(err.response?.data?.message || "Unable to save address.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setForm({ ...emptyForm, ...address });
  };

  const handleDelete = async (addressId) => {
    try {
      await authApi.delete(`/addresses/${addressId}`);
      success("Address removed.");
      await loadAddresses(page);
    } catch (err) {
      error(err.response?.data?.message || "Unable to remove address.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <div className="bg-white rounded-[40px] shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Saved Addresses</h1>
          <p className="text-gray-500 mb-8">Manage your shipping and billing addresses for faster checkout.</p>

          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search addresses" className="w-full rounded-2xl border border-gray-300 px-4 py-3 md:max-w-xs" />
            <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="rounded-2xl border border-gray-300 px-4 py-3">
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>

          <form onSubmit={handleSubmit} className="mb-8 rounded-3xl border border-gray-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold">{editingId ? "Edit address" : "Add a new address"}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} placeholder="Label" className="rounded-2xl border border-gray-300 px-4 py-3" />
              <input value={form.recipientName} onChange={(event) => setForm({ ...form, recipientName: event.target.value })} placeholder="Recipient name" required className="rounded-2xl border border-gray-300 px-4 py-3" />
              <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone" required className="rounded-2xl border border-gray-300 px-4 py-3" />
              <input value={form.street} onChange={(event) => setForm({ ...form, street: event.target.value })} placeholder="Street" required className="rounded-2xl border border-gray-300 px-4 py-3" />
              <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="City" required className="rounded-2xl border border-gray-300 px-4 py-3" />
              <input value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} placeholder="State" required className="rounded-2xl border border-gray-300 px-4 py-3" />
              <input value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} placeholder="Postal code" required className="rounded-2xl border border-gray-300 px-4 py-3" />
              <input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} placeholder="Country" className="rounded-2xl border border-gray-300 px-4 py-3" />
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm text-slate-600">
              <input type="checkbox" checked={form.isDefault} onChange={(event) => setForm({ ...form, isDefault: event.target.checked })} />
              Set as default address
            </label>
            <div className="mt-4 flex gap-3">
              <button type="submit" disabled={submitting} className="rounded-full bg-orange-500 px-5 py-3 text-white disabled:opacity-60">{submitting ? "Saving..." : editingId ? "Update address" : "Save address"}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-full border border-gray-300 px-5 py-3">Cancel</button>}
            </div>
          </form>

          {loading ? (
            <div className="text-center py-16 text-gray-500">Loading addresses…</div>
          ) : filteredAddresses.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No saved addresses found.</div>
          ) : (
            <div className="grid gap-4">
              {filteredAddresses.map((address) => (
                <div key={address.id} className="rounded-3xl border border-gray-200 p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-lg">{address.label}</p>
                      {address.isDefault && (
                        <span className="text-sm text-white bg-orange-500 rounded-full px-3 py-1">Default</span>
                      )}
                    </div>
                    <p className="text-slate-700">{address.recipientName}</p>
                    <p className="text-slate-500">{address.phone}</p>
                    <p className="text-slate-500">{address.street}</p>
                    <p className="text-slate-500">{address.city}, {address.state} {address.postalCode}</p>
                    <p className="text-slate-500">{address.country}</p>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => handleEdit(address)} className="text-sm text-orange-600">Edit</button>
                      <button type="button" onClick={() => handleDelete(address.id)} className="text-sm text-red-600">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {Math.min(pageSize, filteredAddresses.length)} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => loadAddresses(Math.max(1, page - 1))} disabled={page <= 1} className="rounded-full border border-gray-300 px-4 py-2 text-sm disabled:opacity-50">Previous</button>
              <button onClick={() => loadAddresses(page + 1)} disabled={page * pageSize >= total} className="rounded-full border border-gray-300 px-4 py-2 text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addresses;
