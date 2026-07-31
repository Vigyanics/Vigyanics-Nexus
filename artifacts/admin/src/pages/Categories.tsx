import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import api from "@/lib/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  productCount: number;
  createdAt: string;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  async function load() {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.get<Category[]>("/admin/categories");
      setCategories(data);
    } catch (e: unknown) {
      const err = e as { data?: { error?: string }; message?: string };
      setCategories([]);
      setLoadError(err?.data?.error ?? err?.message ?? "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm({ name: "", slug: "", description: "" });
    setError("");
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "" });
    setError("");
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.slug) { setError("Name and slug required"); return; }
    setSaving(true); setError("");
    try {
      if (editId) {
        await api.patch(`/admin/categories/${editId}`, form);
      } else {
        await api.post("/admin/categories", form);
      }
      setShowForm(false);
      load();
    } catch (e: unknown) {
      const err = e as { data?: { error?: string }; message?: string };
      setError(err?.data?.error ?? err?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this category?")) return;
    await api.delete(`/admin/categories/${id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">Categories</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{categories.length} total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground font-display">{editId ? "Edit Category" : "New Category"}</h3>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))}
                className="input-field"
                placeholder="STEM Robotics"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="input-field"
                placeholder="stem-robotics"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="input-field"
              placeholder="Optional description"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              <Check className="w-4 h-4" />{saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {loadError && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
          {loadError}
        </div>
      )}

      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            <div className="text-4xl mb-3 opacity-30">No categories</div>
            <p>Add your first category to get started</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium hidden sm:table-cell">Slug</th>
                <th className="text-center px-5 py-3 text-muted-foreground font-medium">Products</th>
                <th className="text-right px-5 py-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-border/50 table-row-hover">
                  <td className="px-5 py-3 font-medium text-foreground">{cat.name}</td>
                  <td className="px-5 py-3 text-muted-foreground font-mono text-xs hidden sm:table-cell">{cat.slug}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">{cat.productCount}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(cat)} className="btn-ghost p-1.5"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(cat.id)} className="btn-ghost p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
