import { Router } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { requireSuperAdmin } from "../../middlewares/auth";
import { orderToAdmin } from "./serializers";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/admin/dashboard/stats", requireSuperAdmin, async (req, res): Promise<void> => {
  let results;
  try {
    results = await Promise.all([
      supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("products").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("customers").select("*", { count: "exact", head: true }).eq("role", "customer"),
      supabaseAdmin.from("products").select("*", { count: "exact", head: true }).lt("quantity", 10).eq("status", "published"),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("orders").select("total"),
    ]);
  } catch {
    res.json({
      totalProducts: 0,
      activeListings: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      lowStockItems: 0,
      pendingOrders: 0,
    });
    return;
  }

  const [
    { count: totalProducts },
    { count: activeListings },
    { count: totalOrders },
    { count: totalCustomers },
    { count: lowStockItems },
    { count: pendingOrders },
    revenueResult,
  ] = results;

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

router.get("/admin/dashboard/recent-orders", requireSuperAdmin, async (req, res): Promise<void> => {
  let result;
  try {
    result = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
  } catch {
    res.json([]);
    return;
  }

  const { data, error } = result;

  if (error) {
    // Table likely doesn't exist yet — return empty gracefully
    res.json([]);
    return;
  }

  res.json((data ?? []).map(orderToAdmin));
});

export default router;
