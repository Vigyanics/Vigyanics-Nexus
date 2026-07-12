import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import api from "@/lib/api";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  status: string;
  total: string;
  createdAt: string;
}

interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

const STATUSES = ["", "pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_CLASS: Record<string, string> = {
  pending: "badge-pending",
  processing: "badge-processing",
  shipped: "badge-shipped",
  delivered: "badge-delivered",
  cancelled: "badge-cancelled",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [changingStatus, setChangingStatus] = useState<number | null>(null);
  const limit = 20;

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const data = await api.get<OrderListResponse>(`/admin/orders?${params}`);
      setOrders(data.data);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [page, statusFilter]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  async function updateStatus(id: number, status: string) {
    setChangingStatus(id);
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      load();
    } finally {
      setChangingStatus(null);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">Orders</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{total} total orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or customer..."
            className="input-field pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field w-full sm:w-40"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : "All Statuses"}</option>
          ))}
        </select>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">No orders found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium">Order</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium hidden md:table-cell">Customer</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="text-right px-5 py-3 text-muted-foreground font-medium">Total</th>
                    <th className="text-right px-5 py-3 text-muted-foreground font-medium hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-border/50 table-row-hover">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">#{o.orderNumber}</td>
                      <td className="px-5 py-3 text-foreground hidden md:table-cell">
                        {o.customerName ?? o.customerEmail ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          disabled={changingStatus === o.id}
                          className={`${STATUS_CLASS[o.status] ?? "badge-draft"} bg-transparent border-0 outline-none cursor-pointer text-xs font-medium`}
                        >
                          {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                            <option key={s} value={s} className="bg-card text-foreground">{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-foreground">
                        ₹{Number(o.total).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3 text-right text-muted-foreground text-xs hidden sm:table-cell">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
