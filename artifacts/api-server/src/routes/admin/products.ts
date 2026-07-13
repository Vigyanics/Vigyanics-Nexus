import { Router } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { requireAdmin } from "../../middlewares/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/admin/products", requireAdmin, async (req, res): Promise<void> => {
  const { search, status, categoryId, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, parseInt(limit, 10) || 20);
  const offset = (pageNum - 1) * limitNum;

  let query = supabaseAdmin
    .from("products")
    .select("*, categories(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limitNum - 1);

  if (status) query = query.eq("status", status);
  if (categoryId) query = query.eq("category_id", parseInt(categoryId, 10));
  if (search) query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) { res.status(500).json({ error: error.message }); return; }

  res.json({ data: data ?? [], total: count ?? 0, page: pageNum, limit: limitNum });
});

router.post("/admin/products", requireAdmin, async (req, res): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  if (!body.name || !body.price) {
    res.status(400).json({ error: "name and price are required" });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      name: body.name,
      short_description: body.shortDescription ?? null,
      long_description: body.longDescription ?? null,
      price: body.price,
      sale_price: body.salePrice ?? null,
      sku: body.sku ?? null,
      quantity: body.quantity ?? 0,
      category_id: body.categoryId ?? null,
      brand: body.brand ?? null,
      tags: body.tags ?? null,
      thumbnail: body.thumbnail ?? null,
      status: body.status ?? "draft",
      stock_status: body.stockStatus ?? "in_stock",
      is_featured: body.isFeatured ?? false,
      is_trending: body.isTrending ?? false,
      is_best_seller: body.isBestSeller ?? false,
      is_new_arrival: body.isNewArrival ?? false,
      age_group: body.ageGroup ?? null,
      color_accent: body.colorAccent ?? null,
      features: body.features ?? null,
      specifications: body.specifications ?? null,
    })
    .select("*, categories(name)")
    .single();

  if (error) { res.status(400).json({ error: error.message }); return; }
  res.status(201).json(data);
});

router.delete("/admin/products/bulk", requireAdmin, async (req, res): Promise<void> => {
  const { ids } = req.body as { ids?: number[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: "ids array required" });
    return;
  }
  const { error, count } = await supabaseAdmin.from("products").delete({ count: "exact" }).in("id", ids);
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ deleted: count ?? 0 });
});

router.get("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*, categories(name), product_images(*)")
    .eq("id", id)
    .single();

  if (error || !data) { res.status(404).json({ error: "Product not found" }); return; }
  res.json(data);
});

router.patch("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const body = req.body as Record<string, unknown>;
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const map: Record<string, string> = {
    name: "name", shortDescription: "short_description", longDescription: "long_description",
    price: "price", salePrice: "sale_price", sku: "sku", quantity: "quantity",
    categoryId: "category_id", brand: "brand", tags: "tags", thumbnail: "thumbnail",
    status: "status", stockStatus: "stock_status", isFeatured: "is_featured",
    isTrending: "is_trending", isBestSeller: "is_best_seller", isNewArrival: "is_new_arrival",
    ageGroup: "age_group", colorAccent: "color_accent", features: "features",
    specifications: "specifications", weight: "weight", dimensions: "dimensions",
  };
  for (const [jsKey, dbKey] of Object.entries(map)) {
    if (jsKey in body) updates[dbKey] = body[jsKey];
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", id)
    .select("*, categories(name)")
    .single();

  if (error || !data) { res.status(404).json({ error: "Product not found" }); return; }
  res.json(data);
});

router.delete("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) { res.status(404).json({ error: "Product not found" }); return; }
  res.sendStatus(204);
});

router.post("/admin/products/:id/duplicate", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { data: original, error: fetchErr } = await supabaseAdmin
    .from("products").select("*").eq("id", id).single();

  if (fetchErr || !original) { res.status(404).json({ error: "Product not found" }); return; }

  const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = original;
  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({ ...rest, name: `${original.name} (Copy)`, sku: original.sku ? `${original.sku}-copy` : null, status: "draft" })
    .select("*, categories(name)")
    .single();

  if (error) { res.status(400).json({ error: error.message }); return; }
  res.status(201).json(data);
});

export default router;
