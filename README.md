# Kristen Truby — Christian Life Coach

Editorial-style marketing site for Kristen Truby, built with Next.js 15, Tailwind CSS v4, and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — lint with Next's ESLint config

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** — deep-forest + cream theme tokens defined in `app/globals.css`
- **Framer Motion** — entrance + scroll-triggered animations (`whileInView`, parallax, stat counters)
- **Fonts** — Cormorant Garamond (display) + Inter (body) via `next/font`

## Structure

```
app/
  layout.tsx            fonts, metadata, root shell
  page.tsx              section composition
  globals.css           theme tokens
  api/contact/route.ts  placeholder contact endpoint
components/
  Nav, Hero, FeaturedIn, About, Services, Stats,
  Method, Testimonials, Contact, Footer, Reveal
lib/
  useCountUp.ts         rAF-based number counter hook
```

## Customizing

- **Copy & section content** — each section lives in its own component in `components/`; edit inline text there.
- **Portrait photos** — replace the Unsplash URLs in `components/Hero.tsx` and `components/About.tsx` with real photos (either remote URLs added to `next.config.ts#images.remotePatterns`, or local files in `public/images/`).
- **Colors** — adjust the `--color-*` tokens in `app/globals.css`.
- **Contact submissions** — the placeholder API route logs to the server console. Wire up a real email service (Resend, Postmark, etc.) in `app/api/contact/route.ts`.

## Accessibility

- Respects `prefers-reduced-motion` (transforms disabled, opacity only).
- Semantic landmarks (`header`, `main`, `section`, `footer`) with labeled nav and form controls.
- Color contrast verified against the forest/cream palette.
