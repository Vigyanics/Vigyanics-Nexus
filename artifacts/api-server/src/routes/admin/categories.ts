import { Router } from "express";
import { db, categoriesTable, productsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { requireAdmin } from "../../middlewares/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/admin/categories", requireAdmin, async (req, res): Promise<void> => {
  const categories = await db.select().from(categoriesTable);

  const counts = await db
    .select({ categoryId: productsTable.categoryId, total: count() })
    .from(productsTable)
    .groupBy(productsTable.categoryId);

  const countMap = new Map(counts.map((c) => [c.categoryId, c.total]));

  const result = categories.map((c) => ({
    ...c,
    productCount: countMap.get(c.id) ?? 0,
  }));

  res.json(result);
});

router.post("/admin/categories", requireAdmin, async (req, res): Promise<void> => {
  const { name, slug, description, parentId } = req.body as {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: number | null;
  };

  if (!name || !slug) {
    res.status(400).json({ error: "name and slug are required" });
    return;
  }

  const [category] = await db
    .insert(categoriesTable)
    .values({ name, slug, description: description ?? null, parentId: parentId ?? null })
    .returning();

  res.status(201).json({ ...category, productCount: 0 });
});

router.patch("/admin/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid category id" });
    return;
  }

  const { name, slug, description, parentId } = req.body as {
    name?: string;
    slug?: string;
    description?: string | null;
    parentId?: number | null;
  };

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (slug !== undefined) updates.slug = slug;
  if (description !== undefined) updates.description = description;
  if (parentId !== undefined) updates.parentId = parentId;
  updates.updatedAt = new Date();

  const [category] = await db
    .update(categoriesTable)
    .set(updates)
    .where(eq(categoriesTable.id, id))
    .returning();

  if (!category) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  const [countResult] = await db
    .select({ total: count() })
    .from(productsTable)
    .where(eq(productsTable.categoryId, id));

  res.json({ ...category, productCount: countResult?.total ?? 0 });
});

router.delete("/admin/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid category id" });
    return;
  }

  const [deleted] = await db.delete(categoriesTable).where(eq(categoriesTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
