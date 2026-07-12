import { Router } from "express";
import { db, productsTable, productImagesTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, inArray, desc } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

async function fetchProductWithImages(id: number) {
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!product) return null;

  const images = await db
    .select()
    .from(productImagesTable)
    .where(eq(productImagesTable.productId, id))
    .orderBy(productImagesTable.sortOrder);

  let categoryName: string | null = null;
  if (product.categoryId) {
    const [cat] = await db
      .select({ name: categoriesTable.name })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, product.categoryId));
    categoryName = cat?.name ?? null;
  }

  return { ...product, images, categoryName };
}

router.get("/admin/products", requireAdmin, async (req, res): Promise<void> => {
  const {
    search,
    status,
    categoryId,
    page = "1",
    limit = "20",
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, parseInt(limit, 10) || 20);
  const offset = (pageNum - 1) * limitNum;

  const allProducts = await db
    .select()
    .from(productsTable)
    .orderBy(desc(productsTable.createdAt));

  let filtered = allProducts;
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(s) || p.sku?.toLowerCase().includes(s)
    );
  }
  if (status) filtered = filtered.filter((p) => p.status === status);
  if (categoryId) {
    const cid = parseInt(categoryId, 10);
    if (!isNaN(cid)) filtered = filtered.filter((p) => p.categoryId === cid);
  }

  const total = filtered.length;
  const page_data = filtered.slice(offset, offset + limitNum);

  const productIds = page_data.map((p) => p.id);
  const images =
    productIds.length > 0
      ? await db
          .select()
          .from(productImagesTable)
          .where(inArray(productImagesTable.productId, productIds))
      : [];

  const categories = await db.select({ id: categoriesTable.id, name: categoriesTable.name }).from(categoriesTable);
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const imageMap = new Map<number, typeof images>();
  for (const img of images) {
    if (!imageMap.has(img.productId)) imageMap.set(img.productId, []);
    imageMap.get(img.productId)!.push(img);
  }

  const data = page_data.map((p) => ({
    ...p,
    images: imageMap.get(p.id) ?? [],
    categoryName: p.categoryId ? (categoryMap.get(p.categoryId) ?? null) : null,
  }));

  res.json({ data, total, page: pageNum, limit: limitNum });
});

router.post("/admin/products", requireAdmin, async (req, res): Promise<void> => {
  const {
    name,
    shortDescription,
    longDescription,
    price,
    salePrice,
    sku,
    quantity,
    categoryId,
    brand,
    tags,
    thumbnail,
    status,
    stockStatus,
    isFeatured,
    isTrending,
    isBestSeller,
    isNewArrival,
    weight,
    dimensions,
    features,
  } = req.body as Record<string, unknown>;

  if (!name || !price) {
    res.status(400).json({ error: "name and price are required" });
    return;
  }

  const [product] = await db
    .insert(productsTable)
    .values({
      name: name as string,
      shortDescription: (shortDescription as string) ?? null,
      longDescription: (longDescription as string) ?? null,
      price: price as string,
      salePrice: (salePrice as string) ?? null,
      sku: (sku as string) ?? null,
      quantity: (quantity as number) ?? 0,
      categoryId: (categoryId as number) ?? null,
      brand: (brand as string) ?? null,
      tags: (tags as string[]) ?? null,
      thumbnail: (thumbnail as string) ?? null,
      status: (status as string) ?? "draft",
      stockStatus: (stockStatus as string) ?? "in_stock",
      isFeatured: (isFeatured as boolean) ?? false,
      isTrending: (isTrending as boolean) ?? false,
      isBestSeller: (isBestSeller as boolean) ?? false,
      isNewArrival: (isNewArrival as boolean) ?? false,
      weight: (weight as string) ?? null,
      dimensions: (dimensions as string) ?? null,
      features: (features as string[]) ?? null,
    })
    .returning();

  const result = await fetchProductWithImages(product.id);
  res.status(201).json(result);
});

router.delete("/admin/products/bulk", requireAdmin, async (req, res): Promise<void> => {
  const { ids } = req.body as { ids?: number[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: "ids array required" });
    return;
  }

  const deleted = await db
    .delete(productsTable)
    .where(inArray(productsTable.id, ids))
    .returning({ id: productsTable.id });

  res.json({ deleted: deleted.length });
});

router.get("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  const product = await fetchProductWithImages(id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

router.patch("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  const fields = [
    "name", "shortDescription", "longDescription", "price", "salePrice",
    "sku", "quantity", "categoryId", "brand", "tags", "thumbnail", "status",
    "stockStatus", "isFeatured", "isTrending", "isBestSeller", "isNewArrival",
    "weight", "dimensions", "features",
  ];
  for (const field of fields) {
    if (field in req.body) updates[field] = (req.body as Record<string, unknown>)[field];
  }

  const [updated] = await db
    .update(productsTable)
    .set(updates)
    .where(eq(productsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const result = await fetchProductWithImages(id);
  res.json(result);
});

router.delete("/admin/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  const [deleted] = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.sendStatus(204);
});

router.post("/admin/products/:id/duplicate", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  const [original] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!original) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const { id: _id, createdAt: _ca, updatedAt: _ua, sku, ...rest } = original;
  const [duplicate] = await db
    .insert(productsTable)
    .values({
      ...rest,
      name: `${original.name} (Copy)`,
      sku: sku ? `${sku}-copy` : null,
      status: "draft",
    })
    .returning();

  const result = await fetchProductWithImages(duplicate.id);
  res.status(201).json(result);
});

export default router;
