import { useEffect, useState } from "react";
import { Search, UserCheck, UserX } from "lucide-react";
import api from "@/lib/api";

interface Customer {
  id: number;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAt: string;
}

interface CustomerListResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState<number | null>(null);
  const limit = 20;

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      const data = await api.get<CustomerListResponse>(`/admin/customers?${params}`);
      setCustomers(data.data);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [page]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  async function toggleStatus(id: number, isActive: boolean) {
    setToggling(id);
    try {
      await api.patch(`/admin/customers/${id}/status`, { isActive });
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, isActive } : c)));
    } finally {
      setToggling(null);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">Customers</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{total} registered customers</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="input-field pl-9"
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">No customers found</div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Customer</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium hidden md:table-cell">Email</th>
                  <th className="text-center px-5 py-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-right px-5 py-3 text-muted-foreground font-medium hidden sm:table-cell">Joined</th>
                  <th className="text-right px-5 py-3 text-muted-foreground font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 table-row-hover">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                          {(c.firstName?.[0] ?? c.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.email}
                          </div>
                          <div className="text-xs text-muted-foreground md:hidden">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{c.email}</td>
                    <td className="px-5 py-3 text-center">
                      {c.isActive ? (
                        <span className="badge-published">Active</span>
                      ) : (
                        <span className="badge-cancelled">Inactive</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground text-xs hidden sm:table-cell">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => toggleStatus(c.id, !c.isActive)}
                        disabled={toggling === c.id}
                        className="btn-ghost p-1.5"
                        title={c.isActive ? "Deactivate" : "Activate"}
                      >
                        {c.isActive ? (
                          <UserX className="w-4 h-4 text-destructive" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-green" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                <span className="text-xs text-muted-foreground">Page {page} of {pages}</span>
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
