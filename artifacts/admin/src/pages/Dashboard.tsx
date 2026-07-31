import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, Clock, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";

interface Stats {
  totalProducts: number;
  activeListings: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockItems: number;
  pendingOrders: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  status: string;
  total: string;
  createdAt: string;
}

const STATUS_CLASS: Record<string, string> = {
  pending: "badge-pending",
  processing: "badge-processing",
  shipped: "badge-shipped",
  delivered: "badge-delivered",
  cancelled: "badge-cancelled",
};

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="stat-card rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-bold text-foreground font-display">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1 opacity-70">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      api.get<Stats>("/admin/dashboard/stats"),
      api.get<Order[]>("/admin/dashboard/recent-orders"),
    ])
      .then(([statsResult, ordersResult]) => {
        if (!mounted) return;
        if (statsResult.status === "fulfilled") setStats(statsResult.value);
        else setError(statsResult.reason?.message ?? "Unable to load dashboard stats");

        if (ordersResult.status === "fulfilled") setOrders(ordersResult.value);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Welcome back. Here's what's happening.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Package className="w-5 h-5 text-cyan" />}
          label="Total Products"
          value={stats?.totalProducts ?? 0}
          sub={`${stats?.activeListings ?? 0} live`}
          color="bg-cyan/10"
        />
        <StatCard
          icon={<ShoppingCart className="w-5 h-5 text-purple" />}
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          sub={`${stats?.pendingOrders ?? 0} pending`}
          color="bg-purple/10"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-green" />}
          label="Revenue"
          value={`₹${Number(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
          color="bg-green/10"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-primary" />}
          label="Customers"
          value={stats?.totalCustomers ?? 0}
          color="bg-primary/10"
        />
      </div>

      {/* Alerts row */}
      {((stats?.lowStockItems ?? 0) > 0 || (stats?.pendingOrders ?? 0) > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(stats?.lowStockItems ?? 0) > 0 && (
            <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <div>
                <div className="text-sm font-semibold text-foreground">{stats!.lowStockItems} low stock items</div>
                <div className="text-xs text-muted-foreground">Review inventory levels</div>
              </div>
            </div>
          )}
          {(stats?.pendingOrders ?? 0) > 0 && (
            <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <Clock className="w-5 h-5 text-yellow-500 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-foreground">{stats!.pendingOrders} pending orders</div>
                <div className="text-xs text-muted-foreground">Need processing</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent orders */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground font-display">Recent Orders</h3>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Order</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Customer</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-right px-5 py-3 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border/50 table-row-hover">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">#{o.orderNumber}</td>
                    <td className="px-5 py-3 text-foreground">{o.customerName ?? o.customerEmail ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className={STATUS_CLASS[o.status] ?? "badge-draft"}>{o.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-foreground">
                      ₹{Number(o.total).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
