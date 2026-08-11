import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, Copy, X, Check, ChevronDown } from "lucide-react";
import api from "@/lib/api";

interface Product {
  id: number;
  name: string;
  price: string;
  salePrice: string | null;
  sku: string | null;
  quantity: number;
  status: string;
  stockStatus: string;
  thumbnail: string | null;
  isFeatured: boolean;
  categoryId: number | null;
  categoryName: string | null;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

interface ProductForm {
  name: string;
  price: string;
  salePrice: string;
  sku: string;
  quantity: string;
  status: string;
  stockStatus: string;
  categoryId: string;
  brand: string;
  shortDescription: string;
  thumbnail: string;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
}

const EMPTY_FORM: ProductForm = {
  name: "", price: "", salePrice: "", sku: "", quantity: "0",
  status: "draft", stockStatus: "in_stock", categoryId: "",
  brand: "", shortDescription: "", thumbnail: "",
  isFeatured: false, isTrending: false, isBestSeller: false, isNewArrival: false,
};

const STATUS_BADGE: Record<string, string> = {
  draft: "badge-draft",
  published: "badge-published",
  archived: "badge-archived",
};

const STOCK_BADGE: Record<string, string> = {
  in_stock: "badge-published",
  low_stock: "badge-pending",
  out_of_stock: "badge-cancelled",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
        value
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground"
      }`}
    >
      <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${value ? "border-primary bg-primary" : "border-muted-foreground"}`}>
        {value && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
      </div>
      {label}
    </button>
  );
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [loadError, setLoadError] = useState("");
  const limit = 20;

  async function load() {
    setLoading(true);
    setLoadError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const data = await api.get<ProductListResponse>(`/admin/products?${params}`);
      setProducts(data.data);
      setTotal(data.total);
    } catch (e: unknown) {
      const err = e as { data?: { error?: string }; message?: string };
      setProducts([]);
      setTotal(0);
      setLoadError(err?.data?.error ?? err?.message ?? "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    api.get<Category[]>("/admin/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => { load(); }, [page, statusFilter]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      salePrice: p.salePrice ?? "",
      sku: p.sku ?? "",
      quantity: String(p.quantity),
      status: p.status,
      stockStatus: p.stockStatus,
      categoryId: p.categoryId ? String(p.categoryId) : "",
      brand: "",
      shortDescription: "",
      thumbnail: p.thumbnail ?? "",
      isFeatured: p.isFeatured,
      isTrending: false,
      isBestSeller: false,
      isNewArrival: false,
    });
    setFormError("");
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.price) { setFormError("Name and price required"); return; }
    setSaving(true); setFormError("");
    try {
      const body = {
        name: form.name,
        price: form.price,
        salePrice: form.salePrice || null,
        sku: form.sku || null,
        quantity: parseInt(form.quantity, 10) || 0,
        status: form.status,
        stockStatus: form.stockStatus,
        categoryId: form.categoryId ? parseInt(form.categoryId, 10) : null,
        brand: form.brand || null,
        shortDescription: form.shortDescription || null,
        thumbnail: form.thumbnail || null,
        isFeatured: form.isFeatured,
        isTrending: form.isTrending,
        isBestSeller: form.isBestSeller,
        isNewArrival: form.isNewArrival,
      };
      if (editId) {
        await api.patch(`/admin/products/${editId}`, body);
      } else {
        await api.post("/admin/products", body);
      }
      setShowForm(false);
      load();
    } catch (e: unknown) {
      const err = e as { data?: { error?: string }; message?: string };
      setFormError(err?.data?.error ?? err?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/admin/products/${id}`);
    load();
  }

  async function handleDuplicate(id: number) {
    await api.post(`/admin/products/${id}/duplicate`, {});
    load();
  }

  async function handleBulkDelete() {
    if (!selected.size || !confirm(`Delete ${selected.size} product(s)?`)) return;
    await api.delete("/admin/products/bulk", { ids: Array.from(selected) });
    setSelected(new Set());
    load();
  }

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === products.length) setSelected(new Set());
    else setSelected(new Set(products.map((p) => p.id)));
  }

  const pages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">Products</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total products</p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <button onClick={handleBulkDelete} className="btn-danger flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete {selected.size}
            </button>
          )}
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      {loadError && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
          {loadError}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field pl-9" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-full sm:w-36">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Product form */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground font-display">{editId ? "Edit Product" : "New Product"}</h3>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Product Name *">
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" placeholder="Arduino Starter Kit" />
            </Field>
            <Field label="Price (₹) *">
              <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="input-field" placeholder="2999.00" />
            </Field>
            <Field label="Sale Price (₹)">
              <input value={form.salePrice} onChange={(e) => setForm((f) => ({ ...f, salePrice: e.target.value }))} className="input-field" placeholder="Optional" />
            </Field>
            <Field label="SKU">
              <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} className="input-field" placeholder="VIG-001" />
            </Field>
            <Field label="Quantity">
              <input type="number" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} className="input-field" placeholder="0" />
            </Field>
            <Field label="Brand">
              <input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="input-field" placeholder="Arduino" />
            </Field>
            <Field label="Category">
              <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} className="input-field">
                <option value="">No Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="input-field">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Stock Status">
              <select value={form.stockStatus} onChange={(e) => setForm((f) => ({ ...f, stockStatus: e.target.value }))} className="input-field">
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Thumbnail URL">
              <input value={form.thumbnail} onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))} className="input-field" placeholder="https://..." />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Short Description">
              <input value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} className="input-field" placeholder="Brief product description" />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Toggle label="Featured" value={form.isFeatured} onChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))} />
            <Toggle label="Trending" value={form.isTrending} onChange={(v) => setForm((f) => ({ ...f, isTrending: v }))} />
            <Toggle label="Best Seller" value={form.isBestSeller} onChange={(v) => setForm((f) => ({ ...f, isBestSeller: v }))} />
            <Toggle label="New Arrival" value={form.isNewArrival} onChange={(v) => setForm((f) => ({ ...f, isNewArrival: v }))} />
          </div>
          {formError && <p className="text-sm text-destructive mt-3">{formError}</p>}
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              <Check className="w-4 h-4" />{saving ? "Saving..." : "Save Product"}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Products table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            <div className="text-4xl mb-3 opacity-30">No products</div>
            <p>Add your first product to get started</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" checked={selected.size === products.length && products.length > 0} onChange={toggleAll} className="rounded accent-primary" />
                    </th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Product</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">SKU</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Price</th>
                    <th className="text-center px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Stock</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 table-row-hover">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} className="rounded accent-primary" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.thumbnail ? (
                            <img src={p.thumbnail} alt={p.name} className="w-8 h-8 rounded-lg object-cover bg-muted shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-muted border border-border shrink-0 flex items-center justify-center text-muted-foreground text-xs">?</div>
                          )}
                          <div>
                            <div className="font-medium text-foreground leading-tight">{p.name}</div>
                            {p.categoryName && <div className="text-xs text-muted-foreground">{p.categoryName}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden sm:table-cell">{p.sku ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={STATUS_BADGE[p.status] ?? "badge-draft"}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-semibold text-foreground">₹{Number(p.price).toLocaleString("en-IN")}</div>
                        {p.salePrice && <div className="text-xs text-green">Sale: ₹{Number(p.salePrice).toLocaleString("en-IN")}</div>}
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span className={STOCK_BADGE[p.stockStatus] ?? "badge-draft"}>{p.quantity}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="btn-ghost p-1.5" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDuplicate(p.id)} className="btn-ghost p-1.5" title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(p.id)} className="btn-ghost p-1.5 text-destructive hover:bg-destructive/10" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                <span className="text-xs text-muted-foreground">Page {page} of {pages} ({total} total)</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40">Prev</button>
                  <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
