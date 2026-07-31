import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { IRouter } from "express";

const router: IRouter = Router();

const ALL_TABLES: string[] = [
  "categories", "products", "product_images", "customers",
  "addresses", "orders", "order_items", "wishlist", "cart",
  "reviews", "coupons", "banners", "blogs", "events",
  "courses", "workshops", "contact_messages", "newsletter_subscribers",
  "testimonials", "gallery", "settings", "admin_logs", "admin_requests",
];

// Load migration SQL from file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATION_SQL_PATH = path.resolve(__dirname, "..", "lib", "migration.sql");

// GET /api/migrate/status - Check which tables exist
router.get("/migrate/status", async (_req, res): Promise<void> => {
  const results: Record<string, boolean> = {};

  for (const table of ALL_TABLES) {
    try {
      const { error } = await supabaseAdmin
        .from(table)
        .select("count", { count: "exact", head: true });
      results[table] = !error;
    } catch {
      results[table] = false;
    }
  }

  const entries = Object.entries(results);
  const existing = entries.filter((e) => e[1]).map((e) => e[0]);

  res.json({
    fullyMigrated: existing.length === ALL_TABLES.length,
    existingCount: existing.length,
    totalCount: ALL_TABLES.length,
    tables: results,
    existingTables: existing,
    missingTables: ALL_TABLES.filter((t) => !results[t]),
  });
});

// POST /api/migrate/run - Attempt migration by reading and executing migration.sql
router.post("/migrate/run", async (_req, res): Promise<void> => {
  const results: Array<{ step: string; success: boolean; error?: string }> = [];

  // Read migration SQL file
  let sqlContent = "";
  try {
    sqlContent = fs.readFileSync(MIGRATION_SQL_PATH, "utf-8");
  } catch {
    res.status(500).json({ error: "Migration SQL file not found at: " + MIGRATION_SQL_PATH });
    return;
  }

  // Split into individual statements
  const statements = sqlContent
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 10 && !s.startsWith("--"));

  // Try to create exec_sql function first
  const createFuncSQL = [
    "create or replace function exec_sql(sql text)",
    "returns void",
    "language plpgsql",
    "security definer",
    "as $$",
    "begin",
    "  execute sql;",
    "end;",
    "$$;"
  ].join("\n");

  // Try exec_sql creation
  try {
    const { error: funcErr } = await supabaseAdmin.rpc("exec_sql", { sql: createFuncSQL });
    results.push({
      step: "Create exec_sql function",
      success: !funcErr,
      error: funcErr ? funcErr.message : undefined,
    });
  } catch (e: unknown) {
    results.push({
      step: "Create exec_sql function",
      success: false,
      error: e instanceof Error ? e.message : String(e),
    });
  }

  // Try to execute each statement via exec_sql RPC
  let successCount = 0;
  let failCount = 0;
  for (const stmt of statements) {
    try {
      const { error } = await supabaseAdmin.rpc("exec_sql", { sql: stmt + ";" });
      if (error) {
        failCount++;
      } else {
        successCount++;
      }
    } catch {
      failCount++;
    }
  }

  results.push({
    step: "Execute " + statements.length + " SQL statements (" + successCount + " succeeded, " + failCount + " failed)",
    success: successCount > 0,
  });

  // Check final table status
  const finalStatus = await checkTables();
  const allSuccess = finalStatus.existingCount === ALL_TABLES.length;

  res.json({
    message: allSuccess
      ? "Migration completed successfully - all tables created"
      : "Migration partially complete: " + finalStatus.existingCount + "/" + ALL_TABLES.length + " tables exist",
    allSuccess,
    results,
    finalStatus,
    manualInstructions: !allSuccess
      ? [
          "The exec_sql RPC function likely does not exist in your Supabase project yet.",
          "To complete the migration manually:",
          "1. Go to https://app.supabase.com and open your project",
          "2. Go to SQL Editor > New query",
          "3. Paste the contents of: artifacts/api-server/src/lib/migration.sql",
          "4. Run the query",
          "",
          "After running migration, call: POST /api/migrate/seed to populate initial data",
        ]
      : [],
  });
});

// POST /api/migrate/seed - Seed initial data (settings, categories)
router.post("/migrate/seed", async (_req, res): Promise<void> => {
  const seeds: Array<{ name: string; success: boolean; error?: string }> = [];

  // Seed settings
  try {
    const { error } = await supabaseAdmin.from("settings").upsert(
      [
        { key: "site_name", value: "Vigyanics", description: "Website name" },
        { key: "site_tagline", value: "Learn by Doing", description: "Site tagline" },
        { key: "whatsapp_number", value: "919999999999", description: "WhatsApp contact number" },
        { key: "contact_email", value: "contact@vigyanics.com", description: "Contact email address" },
        { key: "shipping_fee", value: "99", description: "Default shipping fee" },
        { key: "free_shipping_above", value: "999", description: "Free shipping threshold" },
      ],
      { onConflict: "key" }
    );
    seeds.push({ name: "settings", success: !error, error: error?.message });
  } catch (e: unknown) {
    seeds.push({ name: "settings", success: false, error: e instanceof Error ? e.message : String(e) });
  }

  // Seed categories
  try {
    const { error } = await supabaseAdmin.from("categories").upsert(
      [
        { name: "STEM Kits", slug: "stem-kits", description: "All-in-one science and technology kits", icon: "FlaskConical", color: "#00D4FF", sort_order: 1 },
        { name: "Robotics Kits", slug: "robotics", description: "Build and program real robots", icon: "Bot", color: "#00C896", sort_order: 2 },
        { name: "AI Learning Kits", slug: "ai-learning", description: "Machine learning and computer vision", icon: "Brain", color: "#8B5CF6", sort_order: 3 },
        { name: "Electronics", slug: "electronics", description: "Components, modules and tools", icon: "Cpu", color: "#F59E0B", sort_order: 4 },
        { name: "Sensors and IoT", slug: "sensors-iot", description: "Smart sensors and connected devices", icon: "Wifi", color: "#EF4444", sort_order: 5 },
        { name: "Arduino and Microcontrollers", slug: "arduino", description: "Microcontroller boards and accessories", icon: "Zap", color: "#00D4FF", sort_order: 6 },
        { name: "School Lab Equipment", slug: "school-lab", description: "Classroom and innovation lab gear", icon: "School", color: "#00C896", sort_order: 7 },
        { name: "DIY Science Projects", slug: "diy-science", description: "Fun science project kits", icon: "Lightbulb", color: "#8B5CF6", sort_order: 8 },
        { name: "Competition Kits", slug: "competition", description: "Ready for hackathons and olympiads", icon: "Trophy", color: "#F59E0B", sort_order: 9 },
        { name: "Accessories", slug: "accessories", description: "Tools, storage and learning materials", icon: "Package", color: "#EF4444", sort_order: 10 },
      ],
      { onConflict: "slug" }
    );
    seeds.push({ name: "categories", success: !error, error: error?.message });
  } catch (e: unknown) {
    seeds.push({ name: "categories", success: false, error: e instanceof Error ? e.message : String(e) });
  }

  res.json({
    message: "Seeding complete",
    seeds,
  });
});

async function checkTables() {
  const results: Record<string, boolean> = {};
  for (const table of ALL_TABLES) {
    try {
      const { error } = await supabaseAdmin
        .from(table)
        .select("count", { count: "exact", head: true });
      results[table] = !error;
    } catch {
      results[table] = false;
    }
  }
  const entries = Object.entries(results);
  const existing = entries.filter((e) => e[1]).map((e) => e[0]);
  return { existingCount: existing.length, totalCount: ALL_TABLES.length, existingTables: existing };
}

export default router;
