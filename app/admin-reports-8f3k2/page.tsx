"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LogIn,
  LogOut,
  RefreshCw,
  Clock,
  Eye,
  X,
  User,
  Globe,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
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

interface WordSubmission {
  id: number;
  word: string;
  language: string;
  region: string | null;
  email: string | null;
  browser: string | null;
  status: string;
  created_at: string;
}

const reportStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "var(--warning)", bg: "var(--warning-muted)" },
  reviewed: { label: "Reviewed", color: "var(--info)", bg: "var(--info-muted)" },
  resolved: { label: "Resolved", color: "var(--success)", bg: "var(--success-muted)" },
  dismissed: { label: "Dismissed", color: "var(--text-muted)", bg: "var(--bg-alt)" },
};

const submissionStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "var(--warning)", bg: "var(--warning-muted)" },
  approved: { label: "Approved", color: "var(--success)", bg: "var(--success-muted)" },
  denied: { label: "Denied", color: "var(--error)", bg: "var(--error-muted)" },
};

type ActiveTab = "reports" | "submissions";

export default function AdminPage() {
  const [auth, setAuth] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [submissions, setSubmissions] = useState<WordSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<WordSubmission | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("reports");

  useEffect(() => {
    const saved = localStorage.getItem("admin-auth");
    if (saved) {
      setAuth(saved);
      fetchAllData(saved);
    }
  }, []);

  const fetchAllData = async (authToken: string) => {
    setLoading(true);
    try {
      const [reportsRes, submissionsRes] = await Promise.all([
        fetch("/api/reports/admin", { headers: { Authorization: `Basic ${authToken}` } }),
        fetch("/api/contribute", { headers: { Authorization: `Basic ${authToken}` } }),
      ]);

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData.data || []);
      }

      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json();
        setSubmissions(submissionsData.data || []);
      }

      if (!reportsRes.ok && !submissionsRes.ok) {
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
        fetchAllData(token);
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
    setSubmissions([]);
    localStorage.removeItem("admin-auth");
  };

  const updateReportStatus = async (id: number, status: string) => {
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

  const handleSubmissionAction = async (id: number, status: "approved" | "denied") => {
    if (!auth) return;
    try {
      const response = await fetch(`/api/contribute/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        setSelectedSubmission(null);
      }
    } catch {}
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!auth) return;
    try {
      const response = await fetch(`/api/contribute/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Basic ${auth}` },
      });

      if (response.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        setSelectedSubmission(null);
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
              Filipino Profanity API — Admin Dashboard
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

  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const resolvedReports = reports.filter((r) => r.status === "resolved").length;
  const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAllData(auth)}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Reports", value: reports.length, color: "var(--text-primary)" },
            { label: "Pending Reports", value: pendingReports, color: "var(--warning)" },
            { label: "Resolved Reports", value: resolvedReports, color: "var(--success)" },
            { label: "Total Submissions", value: submissions.length, color: "var(--text-primary)" },
            { label: "Pending Submissions", value: pendingSubmissions, color: "var(--warning)" },
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

        <div className="flex gap-1 p-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-pill)] mb-6 w-fit">
          {([["reports", "Reports", reports.length], ["submissions", "Submissions", submissions.length]] as const).map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === key
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {activeTab === "reports" ? (
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
                  const cfg = reportStatusConfig[report.status] || reportStatusConfig.pending;
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
        ) : (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-sm font-medium text-[var(--text-primary)]">
                Word Submissions ({submissions.length})
              </h2>
            </div>

            {loading && submissions.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-[var(--border-default)] border-t-[var(--accent)] rounded-full animate-spin" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-[var(--text-muted)]">No submissions yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)]">
                {submissions.map((submission) => {
                  const cfg = submissionStatusConfig[submission.status] || submissionStatusConfig.pending;
                  return (
                    <div
                      key={submission.id}
                      className="px-6 py-4 hover:bg-[var(--bg-alt)] transition-colors cursor-pointer"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-[var(--text-primary)]">
                              {submission.word}
                            </h3>
                            <span
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                              style={{ backgroundColor: cfg.bg, color: cfg.color }}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)]">
                            {submission.language}
                            {submission.region ? ` · ${submission.region}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {submission.status === "pending" && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubmissionAction(submission.id, "approved");
                                }}
                                className="p-1.5 text-[var(--success)] hover:bg-[var(--success-muted)] rounded-[var(--radius-lg)] transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubmissionAction(submission.id, "denied");
                                }}
                                className="p-1.5 text-[var(--error)] hover:bg-[var(--error-muted)] rounded-[var(--radius-lg)] transition-colors"
                                title="Deny"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <Clock className="w-3 h-3" />
                            {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

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
                  {Object.entries(reportStatusConfig).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => updateReportStatus(selectedReport.id, key)}
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

      {selectedSubmission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-overlay)] p-6"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-medium text-[var(--text-primary)]">Submission Details</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Word</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">{selectedSubmission.word}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Language</p>
                  <p className="text-sm text-[var(--text-secondary)] capitalize">{selectedSubmission.language}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Region</p>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedSubmission.region || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" /> Email
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedSubmission.email || "Anonymous"}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Submitted
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedSubmission.browser && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Browser
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-mono break-all">
                    {selectedSubmission.browser}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-2">Actions</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSubmissionAction(selectedSubmission.id, "approved")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--success)] text-[var(--success)] bg-[var(--success-muted)] hover:opacity-80 transition-opacity"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Approve & Add
                  </button>
                  <button
                    onClick={() => handleSubmissionAction(selectedSubmission.id, "denied")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--error)] text-[var(--error)] bg-[var(--error-muted)] hover:opacity-80 transition-opacity"
                  >
                    <XCircle className="w-3 h-3" />
                    Deny
                  </button>
                  <button
                    onClick={() => handleDeleteSubmission(selectedSubmission.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--error)] hover:border-[var(--error)] transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
