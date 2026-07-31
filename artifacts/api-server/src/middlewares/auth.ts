import type { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../lib/supabase";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }
  const token = header.slice(7);

  if (process.env.NODE_ENV !== "production") {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? "vigyanics-local-dev-secret") as {
        sub?: string;
        email?: string;
        role?: string;
        provider?: string;
      };
      if (payload.provider === "local-dev" && payload.sub && payload.email && payload.role) {
        req.user = { userId: payload.sub, email: payload.email, role: payload.role };
        next();
        return;
      }
    } catch {
      // Not a local development token; continue with Supabase verification.
    }
  }

  // Verify token with Supabase
  let user;
  let error;
  try {
    const result = await supabaseAdmin.auth.getUser(token);
    user = result.data.user;
    error = result.error;
  } catch {
    res.status(503).json({ error: "Unable to reach authentication service" });
    return;
  }
  if (error || !user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  // Get role from customers table
  const { data: profile } = await supabaseAdmin
    .from("customers")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile?.is_active) {
    res.status(403).json({ error: "Account is deactivated" });
    return;
  }

  req.user = { userId: user.id, email: user.email ?? "", role: profile?.role ?? "customer" };
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.role !== "admin" && req.user?.role !== "super_admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  });
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({ error: "Super admin access required" });
      return;
    }
    next();
  });
}
