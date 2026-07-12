import { Router } from "express";
import { db, productsTable, ordersTable, usersTable, orderItemsTable } from "@workspace/db";
import { count, sum, eq, lt, and, desc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/admin/dashboard/stats", requireAdmin, async (req, res): Promise<void> => {
  const [productStats] = await db
    .select({
      total: count(),
    })
    .from(productsTable);

  const [activeListings] = await db
    .select({ total: count() })
    .from(productsTable)
    .where(eq(productsTable.status, "published"));

  const [orderStats] = await db
    .select({ total: count() })
    .from(ordersTable);

  const [revenueStats] = await db
    .select({ total: sum(ordersTable.total) })
    .from(ordersTable);

  const [customerStats] = await db
    .select({ total: count() })
    .from(usersTable)
    .where(eq(usersTable.role, "customer"));

  const [lowStockStats] = await db
    .select({ total: count() })
    .from(productsTable)
    .where(and(lt(productsTable.quantity, 10), eq(productsTable.status, "published")));

  const [pendingOrderStats] = await db
    .select({ total: count() })
    .from(ordersTable)
    .where(eq(ordersTable.status, "pending"));

  res.json({
    totalProducts: productStats?.total ?? 0,
    activeListings: activeListings?.total ?? 0,
    totalOrders: orderStats?.total ?? 0,
    totalRevenue: parseFloat(revenueStats?.total ?? "0"),
    totalCustomers: customerStats?.total ?? 0,
    lowStockItems: lowStockStats?.total ?? 0,
    pendingOrders: pendingOrderStats?.total ?? 0,
  });
});

router.get("/admin/dashboard/recent-orders", requireAdmin, async (req, res): Promise<void> => {
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt))
    .limit(10);

  res.json(orders);
});

export default router;
