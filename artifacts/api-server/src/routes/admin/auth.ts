import { Router } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { requireSuperAdmin } from "../../middlewares/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

// Admin login via Supabase Auth
router.post("/admin/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  // Sign in via Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  // Check customer profile for admin role
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    res.status(401).json({ error: "Account not found" });
    return;
  }

  if (profile.role !== "admin" && profile.role !== "super_admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  if (!profile.is_active) {
    res.status(403).json({ error: "Account is deactivated" });
    return;
  }

  res.json({
    token: authData.session.access_token,
    user: {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      firstName: profile.first_name,
      lastName: profile.last_name,
      isActive: profile.is_active,
    },
  });
});

// Create new admin user (super_admin only)
router.post("/admin/auth/create-admin", requireSuperAdmin, async (req, res): Promise<void> => {
  const { email, password, firstName, lastName } = req.body as {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };

  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ error: "All fields required" });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { first_name: firstName, last_name: lastName, role: "admin" },
    email_confirm: true,
  });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  // Update role to admin in customers table
  await supabaseAdmin
    .from("customers")
    .update({ role: "admin" })
    .eq("id", data.user.id);

  res.status(201).json({
    id: data.user.id,
    email: data.user.email,
    role: "admin",
    firstName,
    lastName,
  });
});

export default router;
