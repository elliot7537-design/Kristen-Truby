"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar, Users, BarChart2, LogOut, Check, X, RefreshCw, ExternalLink,
  Settings, Clock, Image as ImageIcon, FileText, Lock, Save, Plus, Trash2, Upload,
  ChevronLeft, ChevronRight,
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

interface DayConfig {
  dayOfWeek: number;
  enabled: boolean;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
}

interface BlockedDate {
  id: string;
  date: string;
  note: string | null;
}

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  note: string | null;
  color: string;
}

const EVENT_COLORS = [
  { value: "blue",   label: "Blue",   bg: "bg-blue-500",   ring: "ring-blue-500" },
  { value: "purple", label: "Purple", bg: "bg-purple-500", ring: "ring-purple-500" },
  { value: "pink",   label: "Pink",   bg: "bg-pink-500",   ring: "ring-pink-500" },
  { value: "amber",  label: "Amber",  bg: "bg-amber-500",  ring: "ring-amber-500" },
  { value: "teal",   label: "Teal",   bg: "bg-teal-500",   ring: "ring-teal-500" },
  { value: "red",    label: "Red",    bg: "bg-red-500",    ring: "ring-red-500" },
];

function eventDotClass(color: string): string {
  const map: Record<string, string> = {
    blue: "bg-blue-500", purple: "bg-purple-500", pink: "bg-pink-500",
    amber: "bg-amber-500", teal: "bg-teal-500", red: "bg-red-500",
  };
  return map[color] ?? "bg-blue-500";
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DEFAULT_DAYS: DayConfig[] = [0, 1, 2, 3, 4, 5, 6].map((dow) => ({
  dayOfWeek: dow,
  enabled: dow >= 1 && dow <= 5,
  startHour: 9,
  startMin: 0,
  endHour: 17,
  endMin: 0,
}));

function hourOptions() {
  return Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: new Date(0, 0, 0, i).toLocaleTimeString("en-US", { hour: "numeric", hour12: true }).replace(":00", ""),
  }));
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

// ─── Image Upload Field ───────────────────────────────────────────────────────
function ImageField({
  label,
  contentKey,
  currentUrl,
  defaultSrc,
  onSaved,
}: {
  label: string;
  contentKey: string;
  currentUrl?: string;
  defaultSrc: string;
  onSaved: (key: string, url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl ?? "");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg(""); setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("key", contentKey);
    try {
      const res = await fetch("/api/admin/images", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Upload failed"); return; }
      setUrlInput(data.url);
      onSaved(contentKey, data.url);
      setMsg("Image updated.");
    } catch {
      setError("Upload failed. Check your network.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleUrlSave() {
    if (!urlInput.trim()) return;
    setUploading(true); setMsg(""); setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: contentKey, value: urlInput.trim() }),
      });
      if (!res.ok) { setError("Failed to save URL."); return; }
      onSaved(contentKey, urlInput.trim());
      setMsg("Image URL saved.");
    } catch {
      setError("Failed to save.");
    } finally {
      setUploading(false);
    }
  }

  const previewSrc = urlInput || defaultSrc;

  return (
    <div className="border border-gray-200 bg-white p-5">
      <div className="text-[10px] uppercase tracking-widest-xl text-gray-500 mb-3">{label}</div>
      <div className="flex gap-4 items-start flex-wrap md:flex-nowrap">
        <div className="w-24 h-24 shrink-0 bg-gray-100 border border-gray-200 overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc} alt="" className="w-full h-full object-cover" onError={() => {}} />
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <label className="block text-[10px] uppercase tracking-widest-xl text-gray-500 mb-1.5">
              Upload New Image
            </label>
            <div className="flex items-center gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-forest-950 text-cream-50 px-3 py-2 text-[10px] uppercase tracking-widest-xl hover:bg-forest-700 transition-colors disabled:opacity-50"
              >
                <Upload size={12} />
                {uploading ? "Uploading…" : "Choose File"}
              </button>
              <span className="text-[11px] text-gray-400">Max 10 MB</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest-xl text-gray-500 mb-1.5">
              Or paste an image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://…"
                className="flex-1 border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-forest-500"
              />
              <button
                onClick={handleUrlSave}
                disabled={uploading}
                className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-[10px] uppercase tracking-widest-xl disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
          {msg && <p className="text-[11px] text-green-700">{msg}</p>}
          {error && <p className="text-[11px] text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
type Tab = "overview" | "appointments" | "clients" | "analytics" | "availability" | "content" | "profile";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Availability state
  const [availDays, setAvailDays] = useState<DayConfig[]>(DEFAULT_DAYS);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [availLoading, setAvailLoading] = useState(false);
  const [availSaving, setAvailSaving] = useState(false);
  const [availMsg, setAvailMsg] = useState("");
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockNote, setNewBlockNote] = useState("");

  // Content state
  const [content, setContent] = useState<Record<string, string>>({});
  const [contentLoading, setContentLoading] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [contentMsgs, setContentMsgs] = useState<Record<string, string>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  // Profile state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  // Calendar events state
  const todayISO = new Date().toISOString().slice(0, 10);
  const [calendarMonth, setCalendarMonth] = useState(() => todayISO.slice(0, 7));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calEventsLoading, setCalEventsLoading] = useState(false);
  const [selectedCalDay, setSelectedCalDay] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventNote, setNewEventNote] = useState("");
  const [newEventColor, setNewEventColor] = useState("blue");
  const [addingEvent, setAddingEvent] = useState(false);

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

  const fetchAvailability = useCallback(async () => {
    setAvailLoading(true);
    try {
      const res = await fetch("/api/admin/availability");
      if (!res.ok) return;
      const { days, blocked } = await res.json();
      if (days && days.length > 0) {
        const merged = DEFAULT_DAYS.map((def) => {
          const db = days.find((d: DayConfig) => d.dayOfWeek === def.dayOfWeek);
          return db ?? def;
        });
        setAvailDays(merged);
      }
      if (blocked) setBlockedDates(blocked);
    } finally {
      setAvailLoading(false);
    }
  }, []);

  const fetchContent = useCallback(async () => {
    setContentLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (!res.ok) return;
      const { content: c } = await res.json();
      setContent(c ?? {});
      setEditValues(c ?? {});
    } finally {
      setContentLoading(false);
    }
  }, []);

  const fetchCalendarEvents = useCallback(async (month: string) => {
    setCalEventsLoading(true);
    try {
      const res = await fetch(`/api/admin/calendar-events?month=${month}`);
      if (!res.ok) return;
      const { events } = await res.json();
      setCalendarEvents(events ?? []);
    } finally {
      setCalEventsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (tab === "availability") {
      if (!availLoading) fetchAvailability();
      fetchCalendarEvents(calendarMonth);
    }
    if (tab === "content" && !contentLoading) fetchContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

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

  async function saveAvailability() {
    setAvailSaving(true);
    setAvailMsg("");
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: availDays, blocked: blockedDates }),
      });
      if (!res.ok) { setAvailMsg("Failed to save."); return; }
      setAvailMsg("Availability saved. The booking calendar will update immediately.");
    } finally {
      setAvailSaving(false);
    }
  }

  function updateDay(dayOfWeek: number, updates: Partial<DayConfig>) {
    setAvailDays((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...updates } : d))
    );
  }

  function addBlockedDate() {
    if (!newBlockDate) return;
    if (blockedDates.some((b) => b.date === newBlockDate)) return;
    setBlockedDates((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, date: newBlockDate, note: newBlockNote || null },
    ]);
    setNewBlockDate("");
    setNewBlockNote("");
  }

  function removeBlockedDate(date: string) {
    setBlockedDates((prev) => prev.filter((b) => b.date !== date));
  }

  function navCalendarMonth(delta: number) {
    const [y, m] = calendarMonth.split("-").map(Number);
    const next = new Date(Date.UTC(y, m - 1 + delta, 1));
    const nextStr = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}`;
    setCalendarMonth(nextStr);
    setSelectedCalDay(null);
    fetchCalendarEvents(nextStr);
  }

  async function addCalendarEvent() {
    if (!selectedCalDay || !newEventTitle.trim()) return;
    setAddingEvent(true);
    try {
      const res = await fetch("/api/admin/calendar-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedCalDay, title: newEventTitle.trim(), note: newEventNote.trim() || undefined, color: newEventColor }),
      });
      if (!res.ok) return;
      const { event } = await res.json();
      setCalendarEvents((prev) => [...prev, event]);
      setNewEventTitle("");
      setNewEventNote("");
      setNewEventColor("blue");
    } finally {
      setAddingEvent(false);
    }
  }

  async function deleteCalendarEvent(id: string) {
    await fetch(`/api/admin/calendar-events?id=${id}`, { method: "DELETE" });
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
  }

  async function saveContentKey(key: string) {
    setSavingKey(key);
    setContentMsgs((m) => ({ ...m, [key]: "" }));
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: editValues[key] ?? "" }),
      });
      if (!res.ok) { setContentMsgs((m) => ({ ...m, [key]: "Failed to save." })); return; }
      setContent((c) => ({ ...c, [key]: editValues[key] ?? "" }));
      setContentMsgs((m) => ({ ...m, [key]: "Saved." }));
    } finally {
      setSavingKey(null);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(""); setPwError("");
    if (newPw !== confirmPw) { setPwError("New passwords don't match."); return; }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    setPwSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error ?? "Failed to update password."); return; }
      setPwMsg("Password updated successfully.");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } finally {
      setPwSaving(false);
    }
  }

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

  const TABS = [
    { id: "overview" as const, label: "Overview", icon: BarChart2 },
    { id: "appointments" as const, label: "Appointments", icon: Calendar },
    { id: "clients" as const, label: "Clients", icon: Users },
    { id: "analytics" as const, label: "Analytics", icon: BarChart2 },
    { id: "availability" as const, label: "Availability", icon: Clock },
    { id: "content" as const, label: "Content", icon: FileText },
    { id: "profile" as const, label: "Profile", icon: Settings },
  ];

  const hours = hourOptions();

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
      <nav className="bg-white border-b border-gray-200 px-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-4 text-[11px] uppercase tracking-widest-xl border-b-2 transition-colors whitespace-nowrap ${
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
        {loading && (tab === "overview" || tab === "appointments" || tab === "clients" || tab === "analytics") ? (
          <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : fetchError && (tab === "overview" || tab === "appointments" || tab === "clients" || tab === "analytics") ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 text-sm leading-relaxed max-w-2xl">
            <p className="font-medium mb-1">Could not load dashboard data</p>
            <p>{fetchError}</p>
          </div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {tab === "overview" && stats && (
              <div className="space-y-8">
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

                <div className="bg-white border border-gray-200 p-6">
                  <h2 className="text-[10px] uppercase tracking-widest-xl text-gray-500 mb-6">Page Views — Last 7 Days</h2>
                  {analytics && analytics.days.every(d => d.count === 0) ? (
                    <p className="text-sm text-gray-400 py-8 text-center">No page views recorded yet.</p>
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
                                  <div className="h-full bg-forest-500 rounded-full" style={{ width: `${(p.count / maxCount) * 100}%` }} />
                                </div>
                              </div>
                              <span className="text-sm font-medium text-gray-600 shrink-0">{p.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

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

            {/* ── AVAILABILITY ── */}
            {tab === "availability" && (() => {
              // Build calendar grid for calendarMonth
              const [calY, calM] = calendarMonth.split("-").map(Number);
              const firstDay = new Date(Date.UTC(calY, calM - 1, 1));
              const daysInMonth = new Date(Date.UTC(calY, calM, 0)).getUTCDate();
              const startDow = firstDay.getUTCDay(); // 0=Sun
              const gridCells: (string | null)[] = [
                ...Array(startDow).fill(null),
                ...Array.from({ length: daysInMonth }, (_, i) =>
                  `${calendarMonth}-${String(i + 1).padStart(2, "0")}`
                ),
              ];
              while (gridCells.length % 7 !== 0) gridCells.push(null);

              const calMonthLabel = firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
              const selectedDayEvents = selectedCalDay ? calendarEvents.filter((e) => e.date === selectedCalDay) : [];
              const selectedDayBookings = selectedCalDay
                ? bookings.filter((b) => b.startTime.slice(0, 10) === selectedCalDay && b.status !== "cancelled")
                : [];
              const isBlocked = (date: string) => blockedDates.some((b) => b.date === date);

              return (
                <div className="space-y-8">
                  <div className="flex flex-col xl:flex-row gap-8 items-start">
                    {/* Left column: weekly hours + blocked dates */}
                    <div className="space-y-8 w-full xl:max-w-sm">

                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h2 className="text-base font-semibold text-gray-900">Set your weekly hours</h2>
                          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                            <Clock size={13} className="text-forest-600" />
                            Pacific Time (PT) · 30-minute sessions
                          </p>
                        </div>
                        <button
                          onClick={saveAvailability}
                          disabled={availSaving}
                          className="flex items-center gap-2 bg-forest-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-forest-700 transition-colors disabled:opacity-50 shadow-sm"
                        >
                          <Save size={14} />
                          {availSaving ? "Saving…" : "Save"}
                        </button>
                      </div>

                      {availMsg && (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-md">
                          <Check size={15} /> {availMsg}
                        </div>
                      )}

                      {availLoading ? (
                        <div className="flex items-center gap-2 text-gray-400 py-12">
                          <RefreshCw size={15} className="animate-spin" />
                          <span className="text-sm">Loading your schedule…</span>
                        </div>
                      ) : (
                        <>
                          {/* Weekly schedule card */}
                          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {availDays.map((day, idx) => (
                              <div
                                key={day.dayOfWeek}
                                className={`flex items-center gap-4 px-5 py-3.5 ${idx !== 0 ? "border-t border-gray-100" : ""} ${day.enabled ? "" : "bg-gray-50/60"}`}
                              >
                                <button
                                  role="switch"
                                  aria-checked={day.enabled}
                                  onClick={() => updateDay(day.dayOfWeek, { enabled: !day.enabled })}
                                  className={`relative flex-shrink-0 inline-flex h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 ${day.enabled ? "bg-forest-600" : "bg-gray-200"}`}
                                >
                                  <span className={`inline-block h-4 w-4 m-0.5 rounded-full bg-white shadow transition-transform duration-200 ${day.enabled ? "translate-x-4" : "translate-x-0"}`} />
                                </button>
                                <span className={`w-8 text-xs font-semibold shrink-0 ${day.enabled ? "text-gray-900" : "text-gray-400"}`}>
                                  {DAY_NAMES[day.dayOfWeek].slice(0, 3).toUpperCase()}
                                </span>
                                {day.enabled ? (
                                  <div className="flex items-center gap-2 flex-1">
                                    <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                                      <select
                                        value={day.startHour}
                                        onChange={(e) => updateDay(day.dayOfWeek, { startHour: Number(e.target.value) })}
                                        className="px-2 py-1.5 text-xs text-gray-800 bg-transparent focus:outline-none appearance-none cursor-pointer pr-5"
                                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}
                                      >
                                        {hours.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
                                      </select>
                                    </div>
                                    <span className="text-gray-400 text-xs select-none">–</span>
                                    <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                                      <select
                                        value={day.endHour}
                                        onChange={(e) => updateDay(day.dayOfWeek, { endHour: Number(e.target.value) })}
                                        className="px-2 py-1.5 text-xs text-gray-800 bg-transparent focus:outline-none appearance-none cursor-pointer pr-5"
                                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}
                                      >
                                        {hours.filter(h => h.value > day.startHour).map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
                                      </select>
                                    </div>
                                    <span className="text-[10px] text-gray-400 hidden sm:block whitespace-nowrap">
                                      {Math.max(0, Math.floor((day.endHour * 60 - day.startHour * 60) / 30))} slots
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400 italic flex-1">Unavailable</span>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Blocked dates card */}
                          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100">
                              <h3 className="text-sm font-semibold text-gray-900">Date overrides</h3>
                              <p className="text-xs text-gray-500 mt-0.5">Block specific dates — no slots shown regardless of weekly hours.</p>
                            </div>
                            {blockedDates.length > 0 && (
                              <div className="divide-y divide-gray-100">
                                {blockedDates.map((b) => (
                                  <div key={b.date} className="flex items-center gap-3 px-5 py-3">
                                    <div className="flex-1">
                                      <p className="text-xs font-medium text-gray-800">
                                        {new Date(b.date + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
                                      </p>
                                      {b.note && <p className="text-[10px] text-gray-400 mt-0.5">{b.note}</p>}
                                    </div>
                                    <button onClick={() => removeBlockedDate(b.date)} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50">
                                      <Trash2 size={11} /> Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/60">
                              <p className="text-xs font-medium text-gray-600 mb-3">Add a blocked date</p>
                              <div className="flex gap-2 flex-wrap">
                                <input
                                  type="date"
                                  value={newBlockDate}
                                  onChange={(e) => setNewBlockDate(e.target.value)}
                                  className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white shadow-sm"
                                />
                                <input
                                  type="text"
                                  value={newBlockNote}
                                  onChange={(e) => setNewBlockNote(e.target.value)}
                                  placeholder="Reason (optional)"
                                  className="flex-1 min-w-[140px] border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white shadow-sm"
                                />
                                <button
                                  onClick={addBlockedDate}
                                  disabled={!newBlockDate}
                                  className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-40 shadow-sm font-medium"
                                >
                                  <Plus size={13} /> Add
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end pt-2">
                            <button
                              onClick={saveAvailability}
                              disabled={availSaving}
                              className="flex items-center gap-2 bg-forest-600 text-white px-5 py-2.5 text-sm font-medium rounded-md hover:bg-forest-700 transition-colors disabled:opacity-50 shadow-sm"
                            >
                              <Save size={14} />
                              {availSaving ? "Saving…" : "Save changes"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Right column: calendar */}
                    <div className="flex-1 min-w-0 space-y-4">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Calendar header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                          <button onClick={() => navCalendarMonth(-1)} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                            <ChevronLeft size={16} className="text-gray-600" />
                          </button>
                          <div className="text-center">
                            <h3 className="text-sm font-semibold text-gray-900">{calMonthLabel}</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">Click any day to add events · Pacific Time</p>
                          </div>
                          <button onClick={() => navCalendarMonth(1)} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                            <ChevronRight size={16} className="text-gray-600" />
                          </button>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 px-5 py-2.5 bg-gray-50/60 border-b border-gray-100 flex-wrap">
                          {[
                            { color: "bg-green-500", label: "Confirmed" },
                            { color: "bg-amber-400", label: "Pending" },
                            { color: "bg-red-400", label: "Blocked" },
                            { color: "bg-blue-500", label: "Custom Event" },
                          ].map((l) => (
                            <div key={l.label} className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${l.color}`} />
                              <span className="text-[10px] text-gray-500">{l.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Day-of-week headers */}
                        <div className="grid grid-cols-7 border-b border-gray-100">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-2">{d}</div>
                          ))}
                        </div>

                        {/* Day cells */}
                        {calEventsLoading ? (
                          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                            <RefreshCw size={14} className="animate-spin" /> <span className="text-sm">Loading…</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-7">
                            {gridCells.map((date, i) => {
                              if (!date) return <div key={`empty-${i}`} className="border-t border-r border-gray-100 last:border-r-0 min-h-[60px] bg-gray-50/30" />;
                              const dayNum = Number(date.slice(8));
                              const isToday = date === todayISO;
                              const isSelected = date === selectedCalDay;
                              const blocked = isBlocked(date);
                              const dayBookings = bookings.filter((b) => b.startTime.slice(0, 10) === date && b.status !== "cancelled");
                              const confirmedCount = dayBookings.filter((b) => b.status === "confirmed").length;
                              const pendingCount = dayBookings.filter((b) => b.status === "pending").length;
                              const dayEvents = calendarEvents.filter((e) => e.date === date);

                              return (
                                <button
                                  key={date}
                                  onClick={() => setSelectedCalDay(isSelected ? null : date)}
                                  className={`border-t border-r border-gray-100 last:border-r-0 min-h-[60px] p-1.5 text-left transition-colors relative flex flex-col ${
                                    isSelected ? "bg-forest-50 ring-2 ring-inset ring-forest-400" :
                                    "hover:bg-gray-50"
                                  } ${blocked ? "bg-red-50/40" : ""}`}
                                >
                                  <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                                    isToday ? "bg-forest-600 text-white" : "text-gray-700"
                                  }`}>
                                    {dayNum}
                                  </span>
                                  <div className="flex flex-wrap gap-0.5">
                                    {confirmedCount > 0 && <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" title={`${confirmedCount} confirmed`} />}
                                    {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title={`${pendingCount} pending`} />}
                                    {blocked && <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" title="Blocked" />}
                                    {dayEvents.map((ev) => (
                                      <span key={ev.id} className={`w-2 h-2 rounded-full shrink-0 ${eventDotClass(ev.color)}`} title={ev.title} />
                                    ))}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Day detail panel */}
                      {selectedCalDay && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {new Date(selectedCalDay + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}
                            </h3>
                            <button onClick={() => setSelectedCalDay(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                              <X size={16} />
                            </button>
                          </div>

                          <div className="px-5 py-4 space-y-4">
                            {/* Bookings on this day */}
                            {selectedDayBookings.length > 0 && (
                              <div>
                                <p className="text-[10px] uppercase tracking-widest-xl text-gray-500 mb-2">Sessions</p>
                                <div className="space-y-1.5">
                                  {selectedDayBookings.map((b) => (
                                    <div key={b.id} className="flex items-center gap-3 py-1.5 px-3 rounded-md bg-gray-50 border border-gray-100">
                                      <span className={`w-2 h-2 rounded-full shrink-0 ${b.status === "confirmed" ? "bg-green-500" : "bg-amber-400"}`} />
                                      <span className="text-sm text-gray-800 font-medium">{b.name}</span>
                                      <span className="text-xs text-gray-500 ml-auto">{formatTime(b.startTime, "America/Los_Angeles")} PT</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Blocked indicator */}
                            {isBlocked(selectedCalDay) && (
                              <div className="flex items-center gap-2 py-1.5 px-3 rounded-md bg-red-50 border border-red-100">
                                <span className="w-2 h-2 rounded-full bg-red-400" />
                                <span className="text-xs text-red-700 font-medium">This date is blocked</span>
                              </div>
                            )}

                            {/* Custom events */}
                            {selectedDayEvents.length > 0 && (
                              <div>
                                <p className="text-[10px] uppercase tracking-widest-xl text-gray-500 mb-2">Events</p>
                                <div className="space-y-1.5">
                                  {selectedDayEvents.map((ev) => (
                                    <div key={ev.id} className="flex items-start gap-3 py-2 px-3 rounded-md bg-gray-50 border border-gray-100">
                                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${eventDotClass(ev.color)}`} />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 font-medium">{ev.title}</p>
                                        {ev.note && <p className="text-xs text-gray-500 mt-0.5">{ev.note}</p>}
                                      </div>
                                      <button onClick={() => deleteCalendarEvent(ev.id)} className="text-gray-300 hover:text-red-500 transition-colors mt-0.5 shrink-0">
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {selectedDayBookings.length === 0 && !isBlocked(selectedCalDay) && selectedDayEvents.length === 0 && (
                              <p className="text-xs text-gray-400 italic">Nothing scheduled for this day.</p>
                            )}

                            {/* Add event form */}
                            <div className="border-t border-gray-100 pt-4">
                              <p className="text-[10px] uppercase tracking-widest-xl text-gray-500 mb-3">Add Event</p>
                              <div className="space-y-2.5">
                                <input
                                  type="text"
                                  value={newEventTitle}
                                  onChange={(e) => setNewEventTitle(e.target.value)}
                                  placeholder="Event title *"
                                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                                />
                                <input
                                  type="text"
                                  value={newEventNote}
                                  onChange={(e) => setNewEventNote(e.target.value)}
                                  placeholder="Note (optional)"
                                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                                />
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 shrink-0">Color:</span>
                                  <div className="flex gap-1.5">
                                    {EVENT_COLORS.map((c) => (
                                      <button
                                        key={c.value}
                                        onClick={() => setNewEventColor(c.value)}
                                        title={c.label}
                                        className={`w-6 h-6 rounded-full ${c.bg} transition-transform hover:scale-110 ${newEventColor === c.value ? `ring-2 ring-offset-1 ${c.ring}` : ""}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <button
                                  onClick={addCalendarEvent}
                                  disabled={addingEvent || !newEventTitle.trim()}
                                  className="flex items-center gap-1.5 bg-forest-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-forest-700 transition-colors disabled:opacity-40 w-full justify-center"
                                >
                                  <Plus size={14} />
                                  {addingEvent ? "Adding…" : "Add to calendar"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── CONTENT ── */}
            {tab === "content" && (
              <div className="space-y-8 max-w-2xl">
                <div>
                  <h2 className="text-sm font-medium text-gray-800 mb-1">Site Content</h2>
                  <p className="text-xs text-gray-500">Edit text and images that appear on the homepage. Changes go live immediately.</p>
                </div>

                {contentLoading ? (
                  <div className="flex items-center gap-2 text-gray-400 py-8">
                    <RefreshCw size={14} className="animate-spin" /> Loading…
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <ImageIcon size={14} className="text-forest-600" />
                        <h3 className="text-[10px] uppercase tracking-widest-xl text-gray-700">Images</h3>
                      </div>
                      <div className="space-y-4">
                        <ImageField
                          label="Hero Photo"
                          contentKey="hero.image"
                          currentUrl={content["hero.image"]}
                          defaultSrc="/images/kristen-hero.jpg"
                          onSaved={(key, url) => setContent((c) => ({ ...c, [key]: url }))}
                        />
                        <ImageField
                          label="Portrait Photo (Meet Kristen)"
                          contentKey="meet.image"
                          currentUrl={content["meet.image"]}
                          defaultSrc="/images/kristen-portrait-new.png"
                          onSaved={(key, url) => setContent((c) => ({ ...c, [key]: url }))}
                        />
                        <ImageField
                          label="Focus / Session Photo"
                          contentKey="focus.image"
                          currentUrl={content["focus.image"]}
                          defaultSrc="/images/focus-session.png"
                          onSaved={(key, url) => setContent((c) => ({ ...c, [key]: url }))}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <FileText size={14} className="text-forest-600" />
                        <h3 className="text-[10px] uppercase tracking-widest-xl text-gray-700">Text Content</h3>
                      </div>
                      <div className="space-y-5">
                        {[
                          {
                            key: "hero.subheadline",
                            label: "Hero Subheadline",
                            type: "text" as const,
                            placeholder: "Helping women reconnect with God, regain clarity, and move forward with confidence.",
                          },
                          {
                            key: "meet.bio1",
                            label: "Bio — Paragraph 1",
                            type: "textarea" as const,
                            placeholder: "I'm a certified Christian life coach with a Master's degree in Sociology...",
                          },
                          {
                            key: "meet.bio2",
                            label: "Bio — Paragraph 2",
                            type: "textarea" as const,
                            placeholder: "Those experiences shaped the way I show up: with compassion, patience, and care.",
                          },
                          {
                            key: "meet.bio3",
                            label: "Bio — Paragraph 3",
                            type: "textarea" as const,
                            placeholder: "Rooted and Rising was created for the seasons when life feels uncertain...",
                          },
                          {
                            key: "meet.bio4",
                            label: "Bio — Paragraph 4",
                            type: "textarea" as const,
                            placeholder: "In our work together, I create a calm, faith-rooted space...",
                          },
                        ].map(({ key, label, type, placeholder }) => (
                          <div key={key} className="bg-white border border-gray-200 p-5">
                            <label className="block text-[10px] uppercase tracking-widest-xl text-gray-500 mb-2">{label}</label>
                            {type === "text" ? (
                              <input
                                type="text"
                                value={editValues[key] ?? ""}
                                onChange={(e) => setEditValues((v) => ({ ...v, [key]: e.target.value }))}
                                placeholder={placeholder}
                                className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-forest-500"
                              />
                            ) : (
                              <textarea
                                rows={3}
                                value={editValues[key] ?? ""}
                                onChange={(e) => setEditValues((v) => ({ ...v, [key]: e.target.value }))}
                                placeholder={placeholder}
                                className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-forest-500 resize-y"
                              />
                            )}
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[11px] text-green-700">{contentMsgs[key] ?? ""}</span>
                              <button
                                onClick={() => saveContentKey(key)}
                                disabled={savingKey === key}
                                className="flex items-center gap-1.5 bg-forest-950 text-cream-50 px-4 py-2 text-[10px] uppercase tracking-widest-xl hover:bg-forest-700 transition-colors disabled:opacity-50"
                              >
                                <Save size={11} />
                                {savingKey === key ? "Saving…" : "Save"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── PROFILE ── */}
            {tab === "profile" && (
              <div className="space-y-6 max-w-md">
                <div>
                  <h2 className="text-sm font-medium text-gray-800 mb-1">Profile Settings</h2>
                  <p className="text-xs text-gray-500">Manage your admin account credentials.</p>
                </div>

                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Lock size={14} className="text-forest-600" />
                    <h3 className="text-[10px] uppercase tracking-widest-xl text-gray-700">Change Password</h3>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest-xl text-gray-500 mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        autoComplete="current-password"
                        className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-forest-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest-xl text-gray-500 mb-1.5">
                        New Password <span className="text-gray-300">(min. 8 characters)</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        autoComplete="new-password"
                        className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-forest-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest-xl text-gray-500 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        autoComplete="new-password"
                        className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-forest-500"
                      />
                    </div>

                    {pwError && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">{pwError}</p>
                    )}
                    {pwMsg && (
                      <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2">{pwMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={pwSaving}
                      className="flex items-center gap-2 bg-forest-950 text-cream-50 px-6 py-3 text-[10px] uppercase tracking-widest-xl hover:bg-forest-700 transition-colors disabled:opacity-50 w-full justify-center"
                    >
                      <Lock size={12} />
                      {pwSaving ? "Updating…" : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
