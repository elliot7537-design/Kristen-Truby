// Replace YOUR_USERNAME with your actual Calendly username, e.g. "kristentruby"
// Full URL format: https://calendly.com/YOUR_USERNAME/clarity-call
export const CALENDLY_URL = "https://calendly.com/YOUR_USERNAME/clarity-call";

export function openCalendly() {
  if (typeof window !== "undefined" && (window as any).Calendly) {
    (window as any).Calendly.initPopupWidget({ url: CALENDLY_URL });
  }
}
