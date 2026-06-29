import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../../context/toast-context";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import FilterGroup from "../components/FilterGroup";
import Pagination from "../components/Pagination";
import TableShell from "../components/TableShell";
import Badge from "../components/Badge";
import { createAdminUser, deleteAdminUser, getAdminUsers, updateAdminUser } from "../services/adminUserService";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super admin" },
];

const STATUS_BADGES = {
  active: "success",
  inactive: "neutral",
};

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "name:asc", label: "Name A-Z" },
  { value: "name:desc", label: "Name Z-A" },
  { value: "email:asc", label: "Email A-Z" },
  { value: "email:desc", label: "Email Z-A" },
  { value: "role:asc", label: "Role A-Z" },
  { value: "role:desc", label: "Role Z-A" },
  { value: "status:asc", label: "Status A-Z" },
  { value: "status:desc", label: "Status Z-A" },
];

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortValue, setSortValue] = useState("createdAt:desc");
  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formState, setFormState] = useState({ name: "", email: "", password: "", role: "admin", status: "active" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const { success, error: toastError } = useToast();

  const queryParams = useMemo(() => {
    const [sortBy, order] = sortValue.split(":");
    return {
      page: currentPage,
      limit: pageSize,
      q: search || undefined,
      status: statusFilter || undefined,
      role: roleFilter || undefined,
      sortBy: sortBy || "createdAt",
      order: order || "desc",
    };
  }, [currentPage, pageSize, search, statusFilter, roleFilter, sortValue]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAdminUsers(queryParams);
      setUsers(result.items);
      setTotalItems(result.total);
      setCurrentPage(result.page);
      setPageSize(result.pageSize);
    } catch {
      setError("Unable to load admin users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormState({ name: "", email: "", password: "", role: "admin", status: "active" });
    setFormError("");
    setFormVisible(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormState({ name: user.name || "", email: user.email || "", password: "", role: user.role || "admin", status: user.status || "active" });
    setFormError("");
    setFormVisible(true);
  };

  const closeModal = () => {
    setFormVisible(false);
    setEditingUser(null);
    setFormError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      const payload = {
        name: formState.name.trim(),
        email: formState.email.trim(),
        password: formState.password.trim(),
        role: formState.role,
        status: formState.status,
      };

      if (editingUser?.id) {
        await updateAdminUser(editingUser.id, payload);
        success("Admin user updated successfully.");
      } else {
        await createAdminUser(payload);
        success("Admin user created successfully.");
      }

      closeModal();
      await loadUsers();
    } catch (saveError) {
      const message = saveError?.response?.data?.message || "Unable to save admin user.";
      setFormError(message);
      toastError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Archive this admin user?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteAdminUser(userId);
      success("Admin user archived successfully.");
      await loadUsers();
    } catch (deleteError) {
      const message = deleteError?.response?.data?.message || "Unable to archive admin user.";
      setError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin users"
        description="Manage admin accounts, role access, and activation state."
        actions={
          <button type="button" onClick={openCreateModal} className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
            Add admin user
          </button>
        }
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_auto]">
          <SearchBar value={search} onChange={(value) => { setSearch(value); setCurrentPage(1); }} placeholder="Search name or email" label="Search admin users" />

          <FilterGroup label="Status">
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }} className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none">
              {STATUS_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
            </select>
          </FilterGroup>

          <FilterGroup label="Role">
            <select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setCurrentPage(1); }} className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none">
              {ROLE_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
            </select>
          </FilterGroup>

          <FilterGroup label="Sort">
            <select value={sortValue} onChange={(event) => { setSortValue(event.target.value); setCurrentPage(1); }} className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none">
              {SORT_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
            </select>
          </FilterGroup>
        </div>
      </section>

      {error && <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <TableShell loading={loading} columns={["Admin", "Email", "Role", "Status", "Last login", "Actions"]} emptyMessage="No admin users found.">
        {users.map((user) => (
          <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50">
            <td className="px-5 py-4 align-top">
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">{user.name || "Unnamed admin"}</p>
                <p className="text-xs text-slate-500">Created {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</p>
              </div>
            </td>
            <td className="px-5 py-4 align-top text-slate-700">{user.email}</td>
            <td className="px-5 py-4 align-top text-slate-700">{user.role === "super_admin" ? "Super admin" : "Admin"}</td>
            <td className="px-5 py-4 align-top"><Badge label={user.status === "active" ? "Active" : "Inactive"} tone={STATUS_BADGES[user.status] || "neutral"} /></td>
            <td className="px-5 py-4 align-top text-slate-700">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "—"}</td>
            <td className="px-5 py-4 align-top">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => openEditModal(user)} className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600">Edit</button>
                <button type="button" onClick={() => handleDelete(user.id)} className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100">Archive</button>
              </div>
            </td>
          </tr>
        ))}
      </TableShell>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={setPageSize} />

      {formVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{editingUser ? "Edit admin user" : "Add admin user"}</h2>
                <p className="text-sm text-slate-500">Set access level and account state for the admin panel.</p>
              </div>
              <button type="button" className="rounded-2xl px-3 py-2 text-slate-600 hover:bg-slate-100" onClick={closeModal}>Close</button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSave}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Name</span>
                  <input value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none" placeholder="Full name" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <input type="email" value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none" placeholder="admin@example.com" required />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Password</span>
                  <input type="password" value={formState.password} onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))} className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none" placeholder={editingUser ? "Leave blank to keep current password" : "Set a secure password"} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Role</span>
                  <select value={formState.role} onChange={(event) => setFormState((current) => ({ ...current, role: event.target.value }))} className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none">
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super admin</option>
                  </select>
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Status</span>
                <select value={formState.status} onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-2xl border border-neutral-border bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

              {formError && <p className="rounded-2xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{formError}</p>}

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button type="button" onClick={closeModal} className="rounded-2xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-100">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300">{saving ? "Saving..." : editingUser ? "Save changes" : "Create admin user"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
