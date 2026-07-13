import { Router } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { requireAdmin } from "../../middlewares/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/admin/categories", requireAdmin, async (req, res): Promise<void> => {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) { res.status(500).json({ error: error.message }); return; }

  // Get product counts
  const { data: counts } = await supabaseAdmin
    .from("products")
    .select("category_id");

  const countMap = new Map<number, number>();
  (counts ?? []).forEach((p: { category_id: number | null }) => {
    if (p.category_id) countMap.set(p.category_id, (countMap.get(p.category_id) ?? 0) + 1);
  });

  res.json((data ?? []).map((c) => ({ ...c, productCount: countMap.get(c.id) ?? 0 })));
});

router.post("/admin/categories", requireAdmin, async (req, res): Promise<void> => {
  const { name, slug, description, parentId, icon, color } = req.body as Record<string, unknown>;
  if (!name || !slug) { res.status(400).json({ error: "name and slug required" }); return; }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({ name, slug, description: description ?? null, parent_id: parentId ?? null, icon: icon ?? null, color: color ?? null })
    .select()
    .single();

  if (error) { res.status(400).json({ error: error.message }); return; }
  res.status(201).json({ ...data, productCount: 0 });
});

router.patch("/admin/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const body = req.body as Record<string, unknown>;
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if ("name" in body) updates.name = body.name;
  if ("slug" in body) updates.slug = body.slug;
  if ("description" in body) updates.description = body.description;
  if ("parentId" in body) updates.parent_id = body.parentId;
  if ("icon" in body) updates.icon = body.icon;
  if ("color" in body) updates.color = body.color;
  if ("isActive" in body) updates.is_active = body.isActive;
  if ("sortOrder" in body) updates.sort_order = body.sortOrder;

  const { data, error } = await supabaseAdmin
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) { res.status(404).json({ error: "Category not found" }); return; }
  res.json({ ...data, productCount: 0 });
});

router.delete("/admin/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
  if (error) { res.status(404).json({ error: "Category not found" }); return; }
  res.sendStatus(204);
});

export default router;
