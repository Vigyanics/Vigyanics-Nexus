import { Router } from "express";
import { supabaseAdmin, supabase } from "../lib/supabase";
import { requireAuth } from "../middlewares/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

// Request admin access. A super admin must approve this in the admin panel.
router.post("/auth/admin-request", async (req, res): Promise<void> => {
  const { email, firstName, lastName, phone, message } = req.body as {
    email?: string; firstName?: string; lastName?: string; phone?: string; message?: string;
  };

  if (!email || !firstName || !lastName) {
    res.status(400).json({ error: "email, firstName and lastName are required" });
    return;
  }

  const { error } = await supabaseAdmin.from("admin_requests").insert({
    email,
    first_name: firstName,
    last_name: lastName,
    phone: phone || null,
    message: message || null,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      res.status(409).json({ error: "An admin access request already exists for this email" });
      return;
    }
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(201).json({ message: "Admin access request submitted" });
});

// Customer registration
router.post("/auth/register", async (req, res): Promise<void> => {
  const { email, password, firstName, lastName, phone } = req.body as {
    email?: string; password?: string; firstName?: string; lastName?: string; phone?: string;
  };

  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ error: "email, password, firstName and lastName are required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { first_name: firstName, last_name: lastName, role: "customer" },
    email_confirm: true,
  });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  // Update phone if provided
  if (phone && data.user) {
    await supabaseAdmin.from("customers").update({ phone }).eq("id", data.user.id);
  }

  // Sign in to get token
  const { data: signIn, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
  if (signInErr || !signIn.session) {
    res.status(201).json({ message: "Account created. Please sign in." });
    return;
  }

  const { data: profile } = await supabaseAdmin.from("customers").select("*").eq("id", data.user.id).single();

  res.status(201).json({
    token: signIn.session.access_token,
    user: {
      id: profile?.id, email: profile?.email, role: profile?.role,
      firstName: profile?.first_name, lastName: profile?.last_name,
      phone: profile?.phone, isActive: profile?.is_active,
    },
  });
});

// Customer login
router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const { data: profile } = await supabaseAdmin
    .from("customers").select("*").eq("id", data.user.id).single();

  if (!profile?.is_active) {
    res.status(403).json({ error: "Account is deactivated" });
    return;
  }

  res.json({
    token: data.session.access_token,
    user: {
      id: profile.id, email: profile.email, role: profile.role,
      firstName: profile.first_name, lastName: profile.last_name,
      phone: profile.phone, isActive: profile.is_active,
    },
  });
});

// Get current user
router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const { data: profile } = await supabaseAdmin
    .from("customers").select("*").eq("id", req.user!.userId).single();

  if (!profile) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json({
    id: profile.id, email: profile.email, role: profile.role,
    firstName: profile.first_name, lastName: profile.last_name,
    phone: profile.phone, isActive: profile.is_active, createdAt: profile.created_at,
  });
});

export default router;
