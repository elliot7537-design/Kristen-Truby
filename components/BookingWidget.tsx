"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Clock, Globe, Check, ArrowRight, Loader2 } from "lucide-react";
import { BOOKING_WINDOW_DAYS } from "@/lib/availability";

// ─── Timezone data ────────────────────────────────────────────────────────────
const TIMEZONES = [
  { group: "United States", zones: [
    { label: "Eastern (ET): New York", value: "America/New_York" },
    { label: "Central (CT): Chicago", value: "America/Chicago" },
    { label: "Mountain (MT): Denver", value: "America/Denver" },
    { label: "Pacific (PT): Los Angeles", value: "America/Los_Angeles" },
    { label: "Alaska (AKT): Anchorage", value: "America/Anchorage" },
    { label: "Hawaii (HT): Honolulu", value: "Pacific/Honolulu" },
  ]},
  { group: "Canada", zones: [
    { label: "Eastern: Toronto", value: "America/Toronto" },
    { label: "Mountain: Calgary", value: "America/Edmonton" },
    { label: "Pacific: Vancouver", value: "America/Vancouver" },
  ]},
  { group: "Europe", zones: [
    { label: "GMT/BST: London", value: "Europe/London" },
    { label: "CET: Paris, Berlin, Rome", value: "Europe/Paris" },
    { label: "EET: Athens, Helsinki", value: "Europe/Athens" },
  ]},
  { group: "Latin America", zones: [
    { label: "Mexico City", value: "America/Mexico_City" },
    { label: "Colombia, Peru", value: "America/Bogota" },
    { label: "São Paulo, Brazil", value: "America/Sao_Paulo" },
    { label: "Buenos Aires", value: "America/Argentina/Buenos_Aires" },
  ]},
  { group: "Middle East & Africa", zones: [
    { label: "Dubai (Gulf)", value: "Asia/Dubai" },
    { label: "East Africa: Nairobi", value: "Africa/Nairobi" },
    { label: "South Africa: Johannesburg", value: "Africa/Johannesburg" },
  ]},
  { group: "Asia & Pacific", zones: [
    { label: "India (IST)", value: "Asia/Kolkata" },
    { label: "Southeast Asia: Bangkok", value: "Asia/Bangkok" },
    { label: "Singapore, Philippines", value: "Asia/Singapore" },
    { label: "China, Hong Kong", value: "Asia/Shanghai" },
    { label: "Japan, South Korea", value: "Asia/Tokyo" },
    { label: "Australia Eastern: Sydney", value: "Australia/Sydney" },
    { label: "Australia Western: Perth", value: "Australia/Perth" },
    { label: "New Zealand: Auckland", value: "Pacific/Auckland" },
  ]},
];

function detectTimezone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "America/Los_Angeles"; }
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();
}

function startOfUTCMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

function formatSelectedDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }).format(d);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Slot { startUTC: string; endUTC: string; displayTime: string; }
type Step = "calendar" | "slots" | "form" | "confirm";

// ─── Sub-components ───────────────────────────────────────────────────────────
function CalendarGrid({
  viewMonth,
  selectedDate,
  timezone,
  availableDays,
  onSelect,
  onPrev,
  onNext,
}: {
  viewMonth: Date;
  selectedDate: string | null;
  timezone: string;
  availableDays: number[];
  onSelect: (d: string) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const today = new Date();
  const todayStr = toDateStr(today);
  const maxDate = addDays(today, BOOKING_WINDOW_DAYS);
  const maxStr = toDateStr(maxDate);

  const monthStart = startOfUTCMonth(viewMonth);
  const startDow = monthStart.getUTCDay();
  const daysInMonth = new Date(Date.UTC(viewMonth.getUTCFullYear(), viewMonth.getUTCMonth() + 1, 0)).getUTCDate();

  const canPrev = !isSameMonth(viewMonth, today);
  const canNext = isSameMonth(addDays(viewMonth, 40), maxDate) ? false : true;

  const cells: (string | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      toDateStr(new Date(Date.UTC(viewMonth.getUTCFullYear(), viewMonth.getUTCMonth(), i + 1)))
    ),
  ];

  function isSelectable(ds: string): boolean {
    if (ds <= todayStr || ds > maxStr) return false;
    const d = new Date(ds + "T12:00:00Z");
    const dow = d.getUTCDay();
    return availableDays.includes(dow);
  }

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className="p-1.5 text-forest-700 hover:text-forest-950 disabled:opacity-20 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-display italic text-lg text-forest-950">
          {formatMonthYear(viewMonth)}
        </span>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="p-1.5 text-forest-700 hover:text-forest-950 disabled:opacity-20 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="text-center text-[10px] uppercase tracking-widest-xl text-ink-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((ds, i) => {
          if (!ds) return <div key={i} />;
          const selectable = isSelectable(ds);
          const isSelected = ds === selectedDate;
          const isToday = ds === todayStr;
          return (
            <button
              key={ds}
              onClick={() => selectable && onSelect(ds)}
              disabled={!selectable}
              className={[
                "relative w-full aspect-square flex items-center justify-center text-sm transition-colors",
                isSelected
                  ? "bg-forest-950 text-cream-50"
                  : selectable
                  ? "hover:bg-forest-100 text-forest-950 cursor-pointer"
                  : "text-ink-300 cursor-default",
                isToday && !isSelected ? "ring-1 ring-forest-400" : "",
              ].join(" ")}
            >
              {ds.slice(-2).replace(/^0/, "")}
            </button>
          );
        })}
      </div>

      {/* Timezone indicator */}
      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-ink-400">
        <Globe size={11} strokeWidth={1.5} />
        <span>Times shown in {timezone.replace(/_/g, " ")}</span>
      </div>
    </div>
  );
}

function TimezoneSelector({
  timezone,
  isAuto,
  onChange,
  onReset,
}: {
  timezone: string;
  isAuto: boolean;
  onChange: (tz: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="p-4 border border-ink-900/10 bg-white/60">
      <div className="flex items-center gap-2 mb-2">
        <Globe size={13} strokeWidth={1.5} className="text-forest-600 shrink-0" />
        <span className="text-[10px] uppercase tracking-widest-xl text-forest-600">Your Timezone</span>
      </div>
      <select
        value={timezone}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-cream-50 border border-ink-900/15 text-ink-800 text-sm py-2 px-2.5 focus:outline-none focus:border-forest-600 transition-colors"
      >
        {TIMEZONES.map((group) => (
          <optgroup key={group.group} label={group.group}>
            {group.zones.map((z) => (
              <option key={z.value} value={z.value}>{z.label}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[11px] text-ink-400">
          {isAuto ? "Auto-detected from your browser." : "Manually selected."}
        </p>
        {!isAuto && (
          <button
            onClick={onReset}
            className="text-[11px] uppercase tracking-widest-xl text-forest-600 hover:text-forest-800 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function BookingWidget() {
  const [step, setStep] = useState<Step>("calendar");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [isAuto, setIsAuto] = useState(true);
  const [viewMonth, setViewMonth] = useState<Date>(() => startOfUTCMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [availableDays, setAvailableDays] = useState<number[]>([1, 2, 3, 4, 5]);

  // Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [, setConfirmedId] = useState("");

  // Detect timezone and fetch available days on mount
  useEffect(() => {
    setTimezone(detectTimezone());
    fetch("/api/booking/available-days")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.days)) setAvailableDays(d.days); })
      .catch(() => {});
  }, []);

  const handleTimezoneChange = (tz: string) => { setTimezone(tz); setIsAuto(false); };
  const handleTimezoneReset = () => { setTimezone(detectTimezone()); setIsAuto(true); };

  const fetchSlots = useCallback(async (date: string, tz: string) => {
    setSlotsLoading(true);
    setSlots([]);
    try {
      const res = await fetch(`/api/booking/slots?date=${date}&timezone=${encodeURIComponent(tz)}`);
      const data = await res.json();
      setSlots(data.slots ?? []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep("slots");
    fetchSlots(date, timezone);
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, startUTC: selectedSlot.startUTC, timezone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setConfirmedId(data.id);
      setStep("confirm");
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetWidget = () => {
    setStep("calendar");
    setSelectedDate(null);
    setSelectedSlot(null);
    setSlots([]);
    setName(""); setEmail(""); setPhone(""); setMessage("");
    setFormError(""); setConfirmedId("");
  };

  // ── Render ──
  return (
    <div className="bg-white border border-ink-900/10 overflow-hidden">

      {/* ── STEP: Calendar ── */}
      {step === "calendar" && (
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <div className="text-[10px] uppercase tracking-widest-xl text-forest-600 mb-1">Step 1 of 3</div>
            <p className="font-display text-2xl text-forest-950">Choose a date</p>
          </div>
          <CalendarGrid
            viewMonth={viewMonth}
            selectedDate={selectedDate}
            timezone={timezone}
            availableDays={availableDays}
            onSelect={handleDateSelect}
            onPrev={() => setViewMonth((m) => addDays(startOfUTCMonth(m), -1))}
            onNext={() => setViewMonth((m) => addDays(startOfUTCMonth(addDays(m, 32)), 0))}
          />
          <div className="mt-6 pt-5 border-t border-ink-900/8">
            <TimezoneSelector
              timezone={timezone}
              isAuto={isAuto}
              onChange={handleTimezoneChange}
              onReset={handleTimezoneReset}
            />
          </div>
        </div>
      )}

      {/* ── STEP: Slots ── */}
      {step === "slots" && selectedDate && (
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <button
              onClick={() => setStep("calendar")}
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest-xl text-forest-600 hover:text-forest-800 transition-colors mb-3"
            >
              <ChevronLeft size={13} /> Back
            </button>
            <div className="text-[10px] uppercase tracking-widest-xl text-forest-600 mb-1">Step 2 of 3</div>
            <p className="font-display text-2xl text-forest-950">
              {formatSelectedDate(selectedDate)}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[12px] text-ink-500">
              <Clock size={12} strokeWidth={1.5} />
              <span>30-minute free clarity call · Times in {timezone.split("/").pop()?.replace(/_/g, " ")}</span>
            </div>
          </div>

          {slotsLoading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-ink-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading available times…</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-ink-500 text-sm mb-4">No available times on this date.</p>
              <button
                onClick={() => setStep("calendar")}
                className="text-[11px] uppercase tracking-widest-xl text-forest-700 hover:text-forest-950 transition-colors"
              >
                ← Choose a different day
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.startUTC}
                  onClick={() => handleSlotSelect(slot)}
                  className="border border-ink-900/15 py-3 text-sm text-forest-950 hover:bg-forest-950 hover:text-cream-50 hover:border-forest-950 transition-colors"
                >
                  {slot.displayTime}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STEP: Form ── */}
      {step === "form" && selectedSlot && (
        <div className="p-6 md:p-8">
          <button
            onClick={() => setStep("slots")}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest-xl text-forest-600 hover:text-forest-800 transition-colors mb-5"
          >
            <ChevronLeft size={13} /> Back
          </button>

          {/* Booking summary */}
          <div className="mb-6 p-4 bg-forest-950 text-cream-50">
            <div className="text-[10px] uppercase tracking-widest-xl text-sage-300/70 mb-1">Your Booking</div>
            <p className="font-display italic text-xl">
              {selectedDate ? formatSelectedDate(selectedDate) : ""}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-sage-300/90">
              <Clock size={12} strokeWidth={1.5} />
              <span>{selectedSlot.displayTime} · 30 min · {timezone.split("/").pop()?.replace(/_/g, " ")}</span>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-widest-xl text-forest-600 mb-1">Step 3 of 3</div>
          <p className="font-display text-2xl text-forest-950 mb-5">Your details</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest-xl text-ink-500 mb-1.5">
                  Full Name <span className="text-forest-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-ink-900/15 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-forest-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest-xl text-ink-500 mb-1.5">
                  Email <span className="text-forest-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-ink-900/15 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-forest-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest-xl text-ink-500 mb-1.5">
                Phone <span className="text-ink-300">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full border border-ink-900/15 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-forest-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest-xl text-ink-500 mb-1.5">
                What would you like to talk about? <span className="text-ink-300">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share anything that feels relevant: no pressure to have it all figured out."
                className="w-full border border-ink-900/15 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-forest-600 transition-colors resize-none"
              />
            </div>

            {formError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">{formError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group w-full inline-flex items-center justify-center gap-3 bg-forest-950 text-cream-50 px-7 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-forest-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? (
                <><Loader2 size={14} className="animate-spin" /> Booking…</>
              ) : (
                <>Confirm Booking <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" /></>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ── STEP: Confirmation ── */}
      {step === "confirm" && selectedSlot && (
        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-forest-950 flex items-center justify-center mb-5">
            <Check size={22} className="text-cream-50" strokeWidth={2} />
          </div>
          <p className="font-display text-3xl text-forest-950 mb-2">You&apos;re booked.</p>
          <p className="text-ink-600 text-sm mb-6 max-w-xs leading-relaxed">
            Kristen will be in touch to confirm your call. Keep an eye on{" "}
            <span className="text-forest-700">{email}</span>.
          </p>

          <div className="w-full p-4 bg-forest-950 text-cream-50 mb-6 text-left">
            <div className="text-[10px] uppercase tracking-widest-xl text-sage-300/70 mb-1">Your Clarity Call</div>
            <p className="font-display italic text-xl mb-1">
              {selectedDate ? formatSelectedDate(selectedDate) : ""}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-sage-300/90">
              <Clock size={12} strokeWidth={1.5} />
              <span>{selectedSlot.displayTime} · 30 min · {timezone.split("/").pop()?.replace(/_/g, " ")}</span>
            </div>
          </div>

          <button
            onClick={resetWidget}
            className="text-[11px] uppercase tracking-widest-xl text-forest-600 hover:text-forest-800 transition-colors"
          >
            Book another time
          </button>
        </div>
      )}
    </div>
  );
}
