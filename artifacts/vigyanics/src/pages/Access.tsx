import { useState } from "react";
import { useLocation } from "wouter";
import { Atom, ArrowLeft, LockKeyhole, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";

type AccessMode = "signin" | "join" | "admin-request";

interface CustomerProfile {
  id: string;
  email: string;
  role: "customer" | "admin" | "super_admin";
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  is_active: boolean;
  created_at?: string;
}

function getAdminUrl() {
  const configuredUrl = import.meta.env.VITE_ADMIN_URL as string | undefined;
  if (configuredUrl) return configuredUrl;

  const { protocol, hostname } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//${hostname}:5174/`;
  }

  return "/admin/";
}

function profileToStorageUser(profile: CustomerProfile) {
  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    firstName: profile.first_name,
    lastName: profile.last_name,
    phone: profile.phone,
    isActive: profile.is_active,
    createdAt: profile.created_at ?? new Date().toISOString(),
  };
}

export default function Access() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<AccessMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProfile(userId: string, fallbackEmail: string): Promise<CustomerProfile> {
    const { data, error: profileError } = await supabase
      .from("customers")
      .select("id,email,role,first_name,last_name,phone,is_active,created_at")
      .eq("id", userId)
      .single();

    if (profileError || !data) {
      throw new Error(profileError?.message ?? "Account profile was not found");
    }

    return {
      ...(data as CustomerProfile),
      email: (data as CustomerProfile).email || fallbackEmail,
    };
  }

  async function routeAfterSignIn(profile: CustomerProfile, token: string) {
    if (!profile.is_active) {
      await supabase.auth.signOut();
      throw new Error("This account is deactivated");
    }

    const storageUser = profileToStorageUser(profile);

    if (profile.role === "admin" || profile.role === "super_admin") {
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_user", JSON.stringify(storageUser));
      window.location.href = getAdminUrl();
      return;
    }

    localStorage.setItem("customer_token", token);
    localStorage.setItem("customer_user", JSON.stringify(storageUser));
    setSuccess("Signed in successfully. Taking you to the store...");
    setTimeout(() => navigate("/store"), 350);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "join") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, firstName, lastName, phone }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error ?? "Unable to create account");

        if (payload.token && payload.user) {
          localStorage.setItem("customer_token", payload.token);
          localStorage.setItem("customer_user", JSON.stringify(payload.user));
          setSuccess("Account created. Taking you to the store...");
          setTimeout(() => navigate("/store"), 350);
          return;
        }

        setSuccess(payload.message ?? "Account created. Please sign in.");
        setMode("signin");
        return;
      }

      if (mode === "admin-request") {
        const response = await fetch("/api/auth/admin-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, firstName, lastName, phone, message }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error ?? "Unable to submit request");

        setSuccess("Admin access request sent. A super admin can approve it from the panel.");
        setEmail("");
        setFirstName("");
        setLastName("");
        setPhone("");
        setMessage("");
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw new Error(signInError.message);
      if (!data.session || !data.user) throw new Error("Sign in failed");

      const profile = await loadProfile(data.user.id, email);
      await routeAfterSignIn(profile, data.session.access_token);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to continue";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-mesh font-sans text-vigyanics-blue">
      <main className="container mx-auto flex min-h-screen items-center px-4 py-10 md:px-6">
        <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_460px] lg:items-center">
          <section className="max-w-2xl pt-16 lg:pt-0">
            <button
              onClick={() => navigate("/")}
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-vigyanics-cyan"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to homepage
            </button>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-vigyanics-cyan/30 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-vigyanics-cyan shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Secure Vigyanics account
            </div>

            <h1 className="max-w-xl text-4xl font-bold leading-tight text-vigyanics-blue md:text-6xl">
              Your Vigyanics learning account starts here.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 md:text-lg">
              Create an account, continue shopping for kits, and keep your learning journey in one place.
              Team members can request admin access separately for super-admin approval.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-vigyanics-blue text-white shadow-lg">
                <Atom className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-vigyanics-blue">Vigyanics Access</p>
                <p className="text-sm text-gray-500">Role-aware sign in</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 rounded-full bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                className={`h-10 rounded-full text-sm font-semibold transition-all ${mode === "signin" ? "bg-white text-vigyanics-blue shadow-sm" : "text-gray-500"}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setMode("join"); setError(""); setSuccess(""); }}
                className={`h-10 rounded-full text-sm font-semibold transition-all ${mode === "join" ? "bg-white text-vigyanics-blue shadow-sm" : "text-gray-500"}`}
              >
                Join
              </button>
              <button
                type="button"
                onClick={() => { setMode("admin-request"); setError(""); setSuccess(""); }}
                className={`h-10 rounded-full text-sm font-semibold transition-all ${mode === "admin-request" ? "bg-white text-vigyanics-blue shadow-sm" : "text-gray-500"}`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode !== "signin" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">First name</span>
                    <input
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      required
                      className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-vigyanics-cyan"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">Last name</span>
                    <input
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      required
                      className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-vigyanics-cyan"
                    />
                  </label>
                </div>
              )}

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="you@vigyanics.com"
                  className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-vigyanics-cyan"
                />
              </label>

              {mode !== "admin-request" && (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={mode === "join" ? 8 : undefined}
                    placeholder={mode === "join" ? "At least 8 characters" : "Enter your password"}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-vigyanics-cyan"
                  />
                </label>
              )}

              {mode !== "signin" && (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">Phone</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Optional"
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-vigyanics-cyan"
                  />
                </label>
              )}

              {mode === "admin-request" && (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">Reason for admin access</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={4}
                    placeholder="Example: I manage product uploads or order operations"
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-vigyanics-cyan"
                  />
                </label>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-full border-none bg-vigyanics-blue text-white shadow-[0_8px_24px_rgba(11,31,58,0.22)] transition-all hover:-translate-y-0.5 hover:bg-vigyanics-cyan"
              >
                {mode === "signin" ? <LockKeyhole className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {loading ? "Please wait..." : mode === "join" ? "Create account" : mode === "admin-request" ? "Request admin access" : "Sign in"}
              </Button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
