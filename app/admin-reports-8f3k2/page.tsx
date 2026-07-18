"use client";

import { useState, useEffect } from "react";
import {
  LogIn,
  LogOut,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  X,
  User,
  Globe,
} from "lucide-react";

interface Report {
  id: number;
  title: string;
  description: string;
  email: string | null;
  browser: string | null;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "var(--warning)", bg: "var(--warning-muted)" },
  reviewed: { label: "Reviewed", color: "var(--info)", bg: "var(--info-muted)" },
  resolved: { label: "Resolved", color: "var(--success)", bg: "var(--success-muted)" },
  dismissed: { label: "Dismissed", color: "var(--text-muted)", bg: "var(--bg-alt)" },
};

export default function AdminPage() {
  const [auth, setAuth] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin-auth");
    if (saved) {
      setAuth(saved);
      fetchReports(saved);
    }
  }, []);

  const fetchReports = async (authToken: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/reports/admin", {
        headers: { Authorization: `Basic ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data.data || []);
      } else {
        setAuth(null);
        localStorage.removeItem("admin-auth");
      }
    } catch {
      setAuth(null);
      localStorage.removeItem("admin-auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const token = btoa(`${email}:${password}`);
    try {
      const response = await fetch("/api/reports/admin", {
        headers: { Authorization: `Basic ${token}` },
      });
      if (response.ok) {
        setAuth(token);
        localStorage.setItem("admin-auth", token);
        fetchReports(token);
      } else {
        setLoginError("Invalid credentials");
      }
    } catch {
      setLoginError("Failed to connect");
    }
  };

  const handleLogout = () => {
    setAuth(null);
    setReports([]);
    localStorage.removeItem("admin-auth");
  };

  const updateStatus = async (id: number, status: string) => {
    if (!auth) return;
    try {
      await fetch("/api/reports/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({ id, status }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      if (selectedReport?.id === id) {
        setSelectedReport((prev) => (prev ? { ...prev, status } : null));
      }
    } catch {}
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--accent-muted)] mb-4">
              <LogIn className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <h1
              className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Admin Access
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Filipino Profanity API — Reports Dashboard
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8 space-y-5"
          >
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="block text-sm font-medium text-[var(--text-secondary)]">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                required
                className="w-full h-10 px-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="block text-sm font-medium text-[var(--text-secondary)]">
                Password
              </label>
              <input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-10 px-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 bg-[var(--error-muted)] border border-[var(--error)]/10 rounded-[var(--radius-lg)]">
                <AlertCircle className="w-4 h-4 text-[var(--error)] shrink-0" />
                <p className="text-sm text-[var(--error)]">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 w-full h-10 px-6 text-sm font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-[var(--radius-pill)] transition-all duration-200 active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pending = reports.filter((r) => r.status === "pending").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Top bar */}
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Reports Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchReports(auth)}
              disabled={loading}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] rounded-[var(--radius-lg)] transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <a
              href="/"
              className="px-3 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] transition-colors"
            >
              Home
            </a>
            <button
              onClick={handleLogout}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] rounded-[var(--radius-lg)] transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 sm:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total", value: reports.length, color: "var(--text-primary)" },
            { label: "Pending", value: pending, color: "var(--warning)" },
            { label: "Resolved", value: resolved, color: "var(--success)" },
            { label: "Others", value: reports.length - pending - resolved, color: "var(--text-muted)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)]"
            >
              <p className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold tracking-tight" style={{ color: stat.color, fontFamily: "var(--font-display)" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Reports list */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
            <h2 className="text-sm font-medium text-[var(--text-primary)]">
              All Reports ({reports.length})
            </h2>
          </div>

          {loading && reports.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-[var(--border-default)] border-t-[var(--accent)] rounded-full animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-[var(--text-muted)]">No reports yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-subtle)]">
              {reports.map((report) => {
                const cfg = statusConfig[report.status] || statusConfig.pending;
                return (
                  <div
                    key={report.id}
                    className="px-6 py-4 hover:bg-[var(--bg-alt)] transition-colors cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                            {report.title}
                          </h3>
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          {report.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Detail modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-overlay)] p-6"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-medium text-[var(--text-primary)]">Report Details</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Title</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">{selectedReport.title}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Description</p>
                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{selectedReport.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" /> Email
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedReport.email || "Anonymous"}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Submitted
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {new Date(selectedReport.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedReport.browser && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Browser
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-mono break-all">
                    {selectedReport.browser}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(selectedReport.id, key)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                        selectedReport.status === key
                          ? "border-current"
                          : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                      }`}
                      style={{
                        color: selectedReport.status === key ? cfg.color : "var(--text-muted)",
                        backgroundColor: selectedReport.status === key ? cfg.bg : "transparent",
                      }}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
