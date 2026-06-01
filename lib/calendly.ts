// Replace YOUR_USERNAME with your actual Calendly username, e.g. "kristentruby"
// Full URL format: https://calendly.com/YOUR_USERNAME/clarity-call
export const CALENDLY_URL = "https://calendly.com/YOUR_USERNAME/clarity-call";

interface CalendlyWindow {
  Calendly?: {
    initPopupWidget: (opts: { url: string }) => void;
    initInlineWidget: (opts: { url: string; parentElement: HTMLElement | null }) => void;
  };
}

export function openCalendly() {
  if (typeof window !== "undefined") {
    (window as CalendlyWindow).Calendly?.initPopupWidget({ url: CALENDLY_URL });
  }
}
