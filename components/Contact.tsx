"use client";

import { useEffect, useState } from "react";
import { Mail, Clock, Globe } from "lucide-react";
import { Reveal } from "./Reveal";
import { CALENDLY_URL } from "@/lib/calendly";

const TIMEZONES = [
  { group: "United States", zones: [
    { label: "Eastern Time (ET) — New York, Miami", value: "America/New_York" },
    { label: "Central Time (CT) — Chicago, Dallas", value: "America/Chicago" },
    { label: "Mountain Time (MT) — Denver, Phoenix", value: "America/Denver" },
    { label: "Pacific Time (PT) — Los Angeles, Seattle", value: "America/Los_Angeles" },
    { label: "Alaska Time (AKT) — Anchorage", value: "America/Anchorage" },
    { label: "Hawaii Time (HT) — Honolulu", value: "Pacific/Honolulu" },
  ]},
  { group: "Canada", zones: [
    { label: "Eastern — Toronto, Ottawa", value: "America/Toronto" },
    { label: "Central — Winnipeg", value: "America/Winnipeg" },
    { label: "Mountain — Calgary, Edmonton", value: "America/Edmonton" },
    { label: "Pacific — Vancouver", value: "America/Vancouver" },
  ]},
  { group: "Europe", zones: [
    { label: "GMT/BST — London, Dublin", value: "Europe/London" },
    { label: "CET — Paris, Berlin, Madrid, Rome", value: "Europe/Paris" },
    { label: "EET — Athens, Helsinki, Kyiv", value: "Europe/Athens" },
    { label: "Moscow Time — Moscow", value: "Europe/Moscow" },
  ]},
  { group: "Latin America", zones: [
    { label: "Mexico City", value: "America/Mexico_City" },
    { label: "Colombia, Peru", value: "America/Bogota" },
    { label: "São Paulo, Brazil", value: "America/Sao_Paulo" },
    { label: "Buenos Aires, Argentina", value: "America/Argentina/Buenos_Aires" },
    { label: "Santiago, Chile", value: "America/Santiago" },
  ]},
  { group: "Middle East & Africa", zones: [
    { label: "Dubai, Abu Dhabi (Gulf)", value: "Asia/Dubai" },
    { label: "East Africa — Nairobi", value: "Africa/Nairobi" },
    { label: "South Africa — Johannesburg", value: "Africa/Johannesburg" },
  ]},
  { group: "Asia & Pacific", zones: [
    { label: "India (IST) — Mumbai, Delhi", value: "Asia/Kolkata" },
    { label: "Bangladesh, Sri Lanka", value: "Asia/Dhaka" },
    { label: "Southeast Asia — Bangkok, Jakarta", value: "Asia/Bangkok" },
    { label: "Singapore, Malaysia, Philippines", value: "Asia/Singapore" },
    { label: "China, Hong Kong, Taiwan", value: "Asia/Shanghai" },
    { label: "Japan, South Korea", value: "Asia/Tokyo" },
    { label: "Australia Eastern — Sydney, Melbourne", value: "Australia/Sydney" },
    { label: "Australia Central — Adelaide", value: "Australia/Adelaide" },
    { label: "Australia Western — Perth", value: "Australia/Perth" },
    { label: "New Zealand — Auckland", value: "Pacific/Auckland" },
  ]},
];

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/Los_Angeles";
  }
}

function calendlyUrlWithTz(tz: string) {
  return `${CALENDLY_URL}?timezone=${encodeURIComponent(tz)}`;
}

export function Contact() {
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    const detected = detectTimezone();
    setTimezone(detected);
  }, []);

  function handleTimezoneChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setTimezone(e.target.value);
    setIsAuto(false);
  }

  function resetToAuto() {
    const detected = detectTimezone();
    setTimezone(detected);
    setIsAuto(true);
  }

  const embedUrl = calendlyUrlWithTz(timezone);

  return (
    <section
      id="contact"
      className="bg-cream-50 text-ink-900 py-24 md:py-36 border-t border-ink-900/5"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid md:grid-cols-12 gap-12 md:gap-16">

        {/* Left — info */}
        <div className="md:col-span-4">
          <Reveal>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>Take the Next Step</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-8 text-5xl md:text-6xl leading-[0.95] text-forest-950">
              Ready to move{" "}
              <em className="italic text-forest-700">forward?</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-ink-700 leading-relaxed text-[17px]">
              Book a free clarity call — choose a time that works for you.
            </p>
          </Reveal>

          {/* Timezone selector */}
          <Reveal delay={0.25}>
            <div className="mt-8 p-5 border border-ink-900/10 bg-cream-100">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} strokeWidth={1.5} className="text-forest-600 shrink-0" />
                <span className="text-[10px] uppercase tracking-widest-xl text-forest-600">
                  Your Timezone
                </span>
              </div>

              <select
                value={timezone}
                onChange={handleTimezoneChange}
                className="w-full bg-cream-50 border border-ink-900/15 text-ink-800 text-sm py-2.5 px-3 focus:outline-none focus:border-forest-600 transition-colors"
              >
                {TIMEZONES.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.zones.map((z) => (
                      <option key={z.value} value={z.value}>
                        {z.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[11px] text-ink-500 leading-relaxed">
                  {isAuto
                    ? "Auto-detected from your browser."
                    : "Manually selected."}
                </p>
                {!isAuto && (
                  <button
                    onClick={resetToAuto}
                    className="text-[11px] uppercase tracking-widest-xl text-forest-600 hover:text-forest-800 transition-colors whitespace-nowrap"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="mt-3 flex items-start gap-2 text-[11px] text-ink-500">
                <Clock size={12} strokeWidth={1.5} className="mt-0.5 shrink-0 text-forest-500" />
                <span>
                  Kristen is based in California. Times shown match your selected timezone.
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <a
              href="mailto:hello@rootedandrising.com"
              className="mt-6 inline-flex items-center gap-3 text-forest-700 hover:text-forest-500 transition-colors"
            >
              <Mail size={16} strokeWidth={1.5} />
              <span className="text-sm tracking-wide">hello@rootedandrising.com</span>
            </a>
          </Reveal>
        </div>

        {/* Right — Calendly inline embed, re-mounts when timezone changes */}
        <Reveal className="md:col-span-8" delay={0.15}>
          <div
            key={embedUrl}
            className="calendly-inline-widget w-full border border-ink-900/10"
            data-url={embedUrl}
            style={{ minWidth: "320px", height: "700px" }}
          />
        </Reveal>

      </div>
    </section>
  );
}
