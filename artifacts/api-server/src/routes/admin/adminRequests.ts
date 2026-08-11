import { Router } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { requireSuperAdmin } from "../../middlewares/auth";
import { adminRequestToAdmin } from "./serializers";
import type { IRouter, Request } from "express";

const router: IRouter = Router();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The local-dev auth fallback uses a synthetic user id ("local-super-admin")
// that is not a real Supabase auth uuid. `admin_requests.reviewed_by` is a
// uuid column referencing customers(id), so a synthetic id would make Postgres
// fail with "invalid input syntax for type uuid". Resolve the real reviewer id
// from the persisted customers table using the authenticated email when the
// id is not already a valid uuid.
async function resolveReviewerId(req: Request): Promise<string | null> {
  const userId = req.user?.userId;
  if (userId && UUID_RE.test(userId)) return userId;

  if (!req.user?.email) return null;

  const { data } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("email", req.user.email)
    .maybeSingle();

  return data?.id ?? null;
}

router.get("/admin/admin-requests", requireSuperAdmin, async (req, res): Promise<void> => {
  const status = typeof req.query.status === "string" ? req.query.status : "pending";

  let result;
  try {
    result = await supabaseAdmin
      .from("admin_requests")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
  } catch {
    res.json({ data: [] });
    return;
  }

  const { data, error } = result;

  if (error) {
    // Table likely doesn't exist yet — return empty gracefully
    res.json({ data: [] });
    return;
  }

  res.json({ data: (data ?? []).map(adminRequestToAdmin) });
});

router.post("/admin/admin-requests/:id/approve", requireSuperAdmin, async (req, res): Promise<void> => {
  const { id } = req.params;
  const { temporaryPassword } = req.body as { temporaryPassword?: string };

  if (!temporaryPassword || temporaryPassword.length < 8) {
    res.status(400).json({ error: "Temporary password must be at least 8 characters" });
    return;
  }

  const { data: request, error: requestError } = await supabaseAdmin
    .from("admin_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (requestError || !request) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  if (request.status !== "pending") {
    res.status(409).json({ error: "Request has already been reviewed" });
    return;
  }

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: request.email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: {
      first_name: request.first_name,
      last_name: request.last_name,
      role: "admin",
    },
  });

  if (createError || !created.user) {
    res.status(400).json({ error: createError?.message ?? "Unable to create admin account" });
    return;
  }

  await supabaseAdmin
    .from("customers")
    .upsert({
      id: created.user.id,
      email: request.email,
      first_name: request.first_name,
      last_name: request.last_name,
      phone: request.phone,
      role: "admin",
      is_active: true,
    });

  const reviewerId = await resolveReviewerId(req);

  const { error: updateError } = await supabaseAdmin
    .from("admin_requests")
    .update({
      status: "approved",
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    res.status(400).json({ error: updateError.message });
    return;
  }

  res.json({ message: "Admin request approved", email: request.email });
});

router.post("/admin/admin-requests/:id/reject", requireSuperAdmin, async (req, res): Promise<void> => {
  const { id } = req.params;

  const reviewerId = await resolveReviewerId(req);

  const { error } = await supabaseAdmin
    .from("admin_requests")
    .update({
      status: "rejected",
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending");

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({ message: "Admin request rejected" });
});

export default router;
