import { useEffect, useState } from "react";
import { Check, ShieldCheck, UserPlus, X } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface AdminRequest {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

interface AdminRequestResponse {
  data: AdminRequest[];
}

export default function AdminRequests() {
  const { isSuperAdmin } = useAuth();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [passwords, setPasswords] = useState<Record<number, string>>({});
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await api.get<AdminRequestResponse>("/admin/admin-requests?status=pending");
      setRequests(data.data);
    } catch (e: unknown) {
      const err = e as { data?: { error?: string }; message?: string };
      setError(err?.data?.error ?? err?.message ?? "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function approve(id: number) {
    const temporaryPassword = passwords[id]?.trim();
    if (!temporaryPassword || temporaryPassword.length < 8) {
      setError("Temporary password must be at least 8 characters");
      return;
    }
    setBusyId(id);
    setError("");
    try {
      await api.post(`/admin/admin-requests/${id}/approve`, { temporaryPassword });
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (e: unknown) {
      const err = e as { data?: { error?: string }; message?: string };
      setError(err?.data?.error ?? err?.message ?? "Failed to approve request");
    } finally {
      setBusyId(null);
    }
  }

  async function reject(id: number) {
    if (!confirm("Reject this admin request?")) return;
    setBusyId(id);
    setError("");
    try {
      await api.post(`/admin/admin-requests/${id}/reject`, {});
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (e: unknown) {
      const err = e as { data?: { error?: string }; message?: string };
      setError(err?.data?.error ?? err?.message ?? "Failed to reject request");
    } finally {
      setBusyId(null);
    }
  }

  if (!isSuperAdmin) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <ShieldCheck className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
        <h1 className="font-display text-xl font-bold text-foreground">Super admin only</h1>
        <p className="mt-2 text-sm text-muted-foreground">Only super admins can approve new admin accounts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Admin Requests</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Approve team members who requested control panel access.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="glass-card overflow-hidden rounded-2xl">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            <UserPlus className="mx-auto mb-3 h-9 w-9 opacity-40" />
            No pending admin requests
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Requester</th>
                  <th className="hidden px-5 py-3 text-left font-medium text-muted-foreground md:table-cell">Reason</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Temporary Password</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b border-border/50 table-row-hover">
                    <td className="px-5 py-3">
                      <div className="font-medium text-foreground">{request.firstName} {request.lastName}</div>
                      <div className="text-xs text-muted-foreground">{request.email}</div>
                      {request.phone && <div className="text-xs text-muted-foreground">{request.phone}</div>}
                    </td>
                    <td className="hidden max-w-md px-5 py-3 text-muted-foreground md:table-cell">
                      {request.message || "No reason provided"}
                    </td>
                    <td className="px-5 py-3">
                      <input
                        type="text"
                        value={passwords[request.id] ?? ""}
                        onChange={(event) => setPasswords((prev) => ({ ...prev, [request.id]: event.target.value }))}
                        placeholder="Set password"
                        className="input-field min-w-44"
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => approve(request.id)}
                          disabled={busyId === request.id}
                          className="btn-primary inline-flex items-center gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => reject(request.id)}
                          disabled={busyId === request.id}
                          className="btn-ghost inline-flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
