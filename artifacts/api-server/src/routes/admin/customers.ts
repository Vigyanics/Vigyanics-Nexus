import { Router } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { requireAdmin } from "../../middlewares/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/admin/customers", requireAdmin, async (req, res): Promise<void> => {
  const { search, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, parseInt(limit, 10) || 20);
  const offset = (pageNum - 1) * limitNum;

  let query = supabaseAdmin
    .from("customers")
    .select("*", { count: "exact" })
    .eq("role", "customer")
    .order("created_at", { ascending: false })
    .range(offset, offset + limitNum - 1);

  if (search) query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) { res.status(500).json({ error: error.message }); return; }

  res.json({ data: data ?? [], total: count ?? 0, page: pageNum, limit: limitNum });
});

router.patch("/admin/customers/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const { id } = req.params;
  const { isActive } = req.body as { isActive?: boolean };

  if (typeof isActive !== "boolean") {
    res.status(400).json({ error: "isActive must be a boolean" });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("customers")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) { res.status(404).json({ error: "Customer not found" }); return; }
  res.json(data);
});

export default router;
