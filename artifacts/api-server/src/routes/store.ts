/**
 * Public store routes — no auth required.
 * Products are read from Supabase. Service role bypasses RLS so we see all published products.
 */
import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";
import type { IRouter } from "express";

const router: IRouter = Router();

// List published products with optional filters
router.get("/store/products", async (req, res): Promise<void> => {
  const {
    search, categorySlug, featured, bestSeller, newArrival, trending,
    page = "1", limit = "20", sort = "created_at",
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, parseInt(limit, 10) || 20);
  const offset = (pageNum - 1) * limitNum;

  let query = supabaseAdmin
    .from("products")
    .select("*, categories(name, slug, color, icon)", { count: "exact" })
    .eq("status", "published")
    .order(sort === "price_asc" ? "price" : sort === "price_desc" ? "price" : "created_at", {
      ascending: sort !== "price_desc",
    })
    .range(offset, offset + limitNum - 1);

  if (search) query = query.ilike("name", `%${search}%`);
  if (featured === "true") query = query.eq("is_featured", true);
  if (bestSeller === "true") query = query.eq("is_best_seller", true);
  if (newArrival === "true") query = query.eq("is_new_arrival", true);
  if (trending === "true") query = query.eq("is_trending", true);

  if (categorySlug) {
    const { data: cat } = await supabaseAdmin
      .from("categories").select("id").eq("slug", categorySlug).single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  const { data, error, count } = await query;
  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ data: data ?? [], total: count ?? 0, page: pageNum, limit: limitNum });
});

// Single product
router.get("/store/products/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  const isNumeric = /^\d+$/.test(id);

  const query = supabaseAdmin
    .from("products")
    .select("*, categories(name, slug, color, icon), product_images(*)")
    .eq("status", "published");

  const { data, error } = isNumeric
    ? await query.eq("id", parseInt(id, 10)).single()
    : await query.eq("sku", id).single();

  if (error || !data) { res.status(404).json({ error: "Product not found" }); return; }
  res.json(data);
});

// List active categories
router.get("/store/categories", async (req, res): Promise<void> => {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json(data ?? []);
});

// Contact form
router.post("/store/contact", async (req, res): Promise<void> => {
  const { name, email, phone, subject, message } = req.body as Record<string, string>;
  if (!name || !email || !message) {
    res.status(400).json({ error: "name, email and message are required" });
    return;
  }

  const { error } = await supabaseAdmin
    .from("contact_messages")
    .insert({ name, email, phone: phone ?? null, subject: subject ?? null, message });

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json({ message: "Message received. We'll be in touch soon." });
});

// Newsletter subscribe
router.post("/store/newsletter", async (req, res): Promise<void> => {
  const { email, name } = req.body as { email?: string; name?: string };
  if (!email) { res.status(400).json({ error: "email is required" }); return; }

  const { error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .upsert({ email, name: name ?? null, is_active: true }, { onConflict: "email" });

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(201).json({ message: "Subscribed successfully." });
});

export default router;
