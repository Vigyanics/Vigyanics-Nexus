import { Router } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { requireAdmin } from "../../middlewares/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/admin/dashboard/stats", requireAdmin, async (req, res): Promise<void> => {
  const [
    { count: totalProducts },
    { count: activeListings },
    { count: totalOrders },
    { count: totalCustomers },
    { count: lowStockItems },
    { count: pendingOrders },
    revenueResult,
  ] = await Promise.all([
    supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("products").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("customers").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabaseAdmin.from("products").select("*", { count: "exact", head: true }).lt("quantity", 10).eq("status", "published"),
    supabaseAdmin.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin.from("orders").select("total"),
  ]);

  const totalRevenue = (revenueResult.data ?? []).reduce(
    (sum: number, o: { total: string }) => sum + parseFloat(o.total ?? "0"),
    0
  );

  res.json({
    totalProducts: totalProducts ?? 0,
    activeListings: activeListings ?? 0,
    totalOrders: totalOrders ?? 0,
    totalRevenue,
    totalCustomers: totalCustomers ?? 0,
    lowStockItems: lowStockItems ?? 0,
    pendingOrders: pendingOrders ?? 0,
  });
});

router.get("/admin/dashboard/recent-orders", requireAdmin, async (req, res): Promise<void> => {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data ?? []);
});

export default router;
