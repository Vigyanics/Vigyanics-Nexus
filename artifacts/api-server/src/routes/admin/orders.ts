import { Router } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { requireAdmin } from "../../middlewares/auth";
import { orderToAdmin } from "./serializers";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/admin/orders", requireAdmin, async (req, res): Promise<void> => {
  const { status, search, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, parseInt(limit, 10) || 20);
  const offset = (pageNum - 1) * limitNum;

  let query = supabaseAdmin
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limitNum - 1);

  if (status) query = query.eq("status", status);
  if (search) query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);

  let result;
  try {
    result = await query;
  } catch {
    res.json({ data: [], total: 0, page: pageNum, limit: limitNum });
    return;
  }

  const { data, error, count } = result;
  if (error) {
    res.json({ data: [], total: 0, page: pageNum, limit: limitNum });
    return;
  }

  res.json({ data: (data ?? []).map(orderToAdmin), total: count ?? 0, page: pageNum, limit: limitNum });
});

router.get("/admin/orders/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (error || !data) { res.status(404).json({ error: "Order not found" }); return; }
  res.json({ ...orderToAdmin(data), orderItems: data.order_items ?? [] });
});

router.patch("/admin/orders/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { status } = req.body as { status?: string };
  const valid = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!status || !valid.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${valid.join(", ")}` });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) { res.status(404).json({ error: "Order not found" }); return; }
  res.json(orderToAdmin(data));
});

export default router;
