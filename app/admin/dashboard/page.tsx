"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar, Users, BarChart2, LogOut, Check, X, RefreshCw, ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  startTime: string;
  endTime: string;
  timezone: string;
  status: string;
  createdAt: string;
}

interface Stats {
  total: number;
  thisMonth: number;
  upcoming: number;
  pending: number;
  cancelled: number;
  recentBookings: Booking[];
  months: { label: string; count: number }[];
}

interface Analytics {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  days: { label: string; count: number }[];
  pages: { path: string; count: number }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

function formatTime(iso: string, tz: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz,
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest-xl rounded-sm ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "appointments" | "clients" | "analytics">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const [bRes, sRes, aRes] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/stats"),
        fetch("/api/admin/analytics"),
      ]);
      if (bRes.status === 401 || sRes.status === 401) {
        router.push("/admin");
        return;
      }
      if (!bRes.ok || !sRes.ok) {
        setFetchError(`Server error (bookings: ${bRes.status}, stats: ${sRes.status}). Check that DATABASE_URL is set in Vercel environment variables.`);
        return;
      }
      const { bookings: b } = await bRes.json();
      const s = await sRes.json();
      const a = aRes.ok ? await aRes.json() : null;
      setBookings(b ?? []);
      setStats(s);
      setAnalytics(a);
    } catch (e) {
      setFetchError(`Failed to load data: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      await fetchAll();
    } finally {
      setUpdatingId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  // Derived data
  const filteredBookings = statusFilter === "all"
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  const clients = Object.values(
    bookings.reduce<Record<string, { name: string; email: string; phone: string | null; bookings: Booking[] }>>((acc, b) => {
      if (!acc[b.email]) acc[b.email] = { name: b.name, email: b.email, phone: b.phone, bookings: [] };
      acc[b.email].bookings.push(b);
      return acc;
    }, {})
  ).sort((a, b) => b.bookings.length - a.bookings.length);

  const now = new Date();
  const upcomingBookings = bookings
    .filter((b) => new Date(b.startTime) >= now && b.status !== "cancelled")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const maxMonth = stats ? Math.max(...stats.months.map((m) => m.count), 1) : 1;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Header */}
      <header className="bg-forest-950 text-cream-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="font-display italic text-xl text-cream-50 leading-none">Rooted &amp; Rising</div>
            <div className="text-[9px] uppercase tracking-widest-xl text-sage-300/70 mt-0.5">Admin Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest-xl text-sage-300 hover:text-cream-50 transition-colors"
          >
            <ExternalLink size={12} /> View Site
          </a>
          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest-xl text-sage-300 hover:text-cream-50 transition-colors"
          >
            <RefreshCw size={12} /> Refresh
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest-xl text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0">
          {([
            { id: "overview", label: "Overview", icon: BarChart2 },
            { id: "appointments", label: "Appointments", icon: Calendar },
            { id: "clients", label: "Clients", icon: Users },
            { id: "analytics", label: "Analytics", icon: BarChart2 },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-4 text-[11px] uppercase tracking-widest-xl border-b-2 transition-colors ${
                tab === id
                  ? "border-forest-600 text-forest-800"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : fetchError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 text-sm leading-relaxed max-w-2xl">
            <p className="font-medium mb-1">Could not load dashboard data</p>
            <p>{fetchError}</p>
          </div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {tab === "overview" && stats && (
              <div className="space-y-8">
                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Bookings", value: stats.total, color: "text-forest-800" },
                    { label: "This Month", value: stats.thisMonth, color: "text-blue-700" },
                    { label: "Upcoming", value: stats.upcoming, color: "text-green-700" },
                    { label: "Awaiting Confirmation", value: stats.pending, color: "text-amber-700" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white border border-gray-200 p-5">
                      <div className={`font-display text-4xl ${s.color}`}>{s.value}</div>
                      <div className="text-[10px] uppercase tracking-widest-xl text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Upcoming appointments */}
                <div className="bg-white border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-800 uppercase tracking-widest-xl">Next Up</h2>
                    <button onClick={() => setTab("appointments")} className="text-[10px] uppercase tracking-widest-xl text-forest-600 hover:text-forest-800">
                      View all →
                    </button>
                  </div>
                  {upcomingBookings.length === 0 ? (
                    <div className="px-6 py-10 text-center text-sm text-gray-400">No upcoming appointments.</div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {upcomingBookings.slice(0, 5).map((b) => (
                        <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4">
                          <div>
                            <div className="font-medium text-sm text-gray-900">{b.name}</div>
                            <div className="text-xs text-gray-500">{b.email}</div>
                          </div>
                          <div className="text-right text-sm text-gray-700">
                            <div>{formatDate(b.startTime)}</div>
                            <div className="text-xs text-gray-500">{formatTime(b.startTime, b.timezone)} ({b.timezone.split("/").pop()?.replace(/_/g, " ")})</div>
                          </div>
                          <StatusBadge status={b.status} />
                          {b.status === "pending" && (
                            <button
                              onClick={() => updateStatus(b.id, "confirmed")}
                              disabled={updatingId === b.id}
                              className="text-[10px] uppercase tracking-widest-xl bg-forest-950 text-cream-50 px-3 py-1.5 hover:bg-forest-700 transition-colors disabled:opacity-50"
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── APPOINTMENTS ── */}
            {tab === "appointments" && (
              <div className="space-y-4">
                {/* Filter bar */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] uppercase tracking-widest-xl text-gray-500">Filter:</span>
                  {["all", "pending", "confirmed", "cancelled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 text-[10px] uppercase tracking-widest-xl transition-colors ${
                        statusFilter === s
                          ? "bg-forest-950 text-cream-50"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-forest-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <span className="ml-auto text-xs text-gray-400">{filteredBookings.length} result{filteredBookings.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest-xl text-gray-500">
                        <th className="px-4 py-3 text-left">Client</th>
                        <th className="px-4 py-3 text-left">Date &amp; Time</th>
                        <th className="px-4 py-3 text-left">Timezone</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Notes</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-10 text-center text-gray-400">No bookings found.</td>
                        </tr>
                      ) : filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{b.name}</div>
                            <div className="text-xs text-gray-500">{b.email}</div>
                            {b.phone && <div className="text-xs text-gray-400">{b.phone}</div>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-gray-900">{formatDate(b.startTime)}</div>
                            <div className="text-xs text-gray-500">{formatTime(b.startTime, b.timezone)}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                            {b.timezone.replace(/_/g, " ")}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <p className="text-xs text-gray-500 line-clamp-2">{b.message || <span className="italic text-gray-300">None</span>}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {b.status !== "confirmed" && b.status !== "cancelled" && (
                                <button
                                  onClick={() => updateStatus(b.id, "confirmed")}
                                  disabled={updatingId === b.id}
                                  title="Confirm"
                                  className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-40"
                                >
                                  <Check size={13} />
                                </button>
                              )}
                              {b.status !== "cancelled" && (
                                <button
                                  onClick={() => updateStatus(b.id, "cancelled")}
                                  disabled={updatingId === b.id}
                                  title="Cancel"
                                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-40"
                                >
                                  <X size={13} />
                                </button>
                              )}
                              {b.status === "cancelled" && (
                                <button
                                  onClick={() => updateStatus(b.id, "pending")}
                                  disabled={updatingId === b.id}
                                  title="Restore"
                                  className="p-1.5 bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-40 text-[10px] uppercase tracking-widest-xl px-2"
                                >
                                  Restore
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── CLIENTS ── */}
            {tab === "clients" && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500">{clients.length} unique client{clients.length !== 1 ? "s" : ""}</p>
                <div className="bg-white border border-gray-200 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest-xl text-gray-500">
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Phone</th>
                        <th className="px-4 py-3 text-left">Sessions</th>
                        <th className="px-4 py-3 text-left">Last Booking</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {clients.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-10 text-center text-gray-400">No clients yet.</td>
                        </tr>
                      ) : clients.map((c) => {
                        const latest = c.bookings.sort(
                          (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
                        )[0];
                        const hasUpcoming = c.bookings.some(
                          (b) => new Date(b.startTime) >= now && b.status !== "cancelled"
                        );
                        return (
                          <tr key={c.email} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                            <td className="px-4 py-3">
                              <a href={`mailto:${c.email}`} className="text-forest-700 hover:underline">{c.email}</a>
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{c.phone ?? <span className="italic text-gray-300">—</span>}</td>
                            <td className="px-4 py-3">
                              <span className="font-display text-xl text-forest-800">{c.bookings.filter(b => b.status !== "cancelled").length}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {formatDate(latest.startTime)}
                            </td>
                            <td className="px-4 py-3">
                              {hasUpcoming
                                ? <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest-xl text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Active</span>
                                : <span className="text-[10px] uppercase tracking-widest-xl text-gray-400">Past</span>
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── ANALYTICS ── */}
            {tab === "analytics" && (
              <div className="space-y-6">
                {/* Page view stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Page Views", value: analytics?.total ?? 0, color: "text-forest-800" },
                    { label: "Views Today", value: analytics?.today ?? 0, color: "text-blue-700" },
                    { label: "This Week", value: analytics?.thisWeek ?? 0, color: "text-purple-700" },
                    { label: "This Month", value: analytics?.thisMonth ?? 0, color: "text-green-700" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white border border-gray-200 p-5">
                      <div className={`font-display text-4xl ${s.color}`}>{s.value}</div>
                      <div className="text-[10px] uppercase tracking-widest-xl text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Daily bar chart */}
                <div className="bg-white border border-gray-200 p-6">
                  <h2 className="text-[10px] uppercase tracking-widest-xl text-gray-500 mb-6">Page Views — Last 7 Days</h2>
                  {analytics && analytics.days.every(d => d.count === 0) ? (
                    <p className="text-sm text-gray-400 py-8 text-center">No page views recorded yet. Views will appear here as visitors browse the site.</p>
                  ) : (
                    <div className="flex items-end gap-2 h-36">
                      {(analytics?.days ?? []).map((d) => {
                        const maxDay = Math.max(...(analytics?.days ?? []).map(x => x.count), 1);
                        return (
                          <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
                            <span className="text-xs font-medium text-forest-800">{d.count > 0 ? d.count : ""}</span>
                            <div
                              className="w-full bg-forest-600/80 transition-all"
                              style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count > 0 ? "4px" : "2px" }}
                            />
                            <span className="text-[9px] text-gray-400 whitespace-nowrap">{d.label.split(",")[0]}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Top pages */}
                  <div className="bg-white border border-gray-200 p-5">
                    <div className="text-[10px] uppercase tracking-widest-xl text-gray-500 mb-4">Top Pages</div>
                    {!analytics || analytics.pages.length === 0 ? (
                      <p className="text-sm text-gray-400">No data yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {analytics.pages.map((p) => {
                          const maxCount = analytics.pages[0].count;
                          return (
                            <div key={p.path} className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-800 truncate">{p.path === "/" ? "/ (Home)" : p.path}</div>
                                <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-forest-500 rounded-full"
                                    style={{ width: `${(p.count / maxCount) * 100}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-sm font-medium text-gray-600 shrink-0">{p.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Booking breakdown */}
                  <div className="bg-white border border-gray-200 p-5">
                    <div className="text-[10px] uppercase tracking-widest-xl text-gray-500 mb-4">Booking Breakdown</div>
                    {[
                      { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, color: "bg-green-500" },
                      { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "bg-amber-400" },
                      { label: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length, color: "bg-red-400" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-3 py-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${row.color}`} />
                        <span className="text-sm text-gray-700 flex-1">{row.label}</span>
                        <span className="font-display text-xl text-gray-900">{row.value}</span>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      {stats && [
                        { label: "Upcoming sessions", value: stats.upcoming },
                        { label: "Past sessions", value: stats.total - stats.upcoming },
                        { label: "Booked this month", value: stats.thisMonth },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{row.label}</span>
                          <span className="font-display text-lg text-forest-800">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
