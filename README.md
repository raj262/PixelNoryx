# PixelNoryx Newsletter

A modern, Substack-style developer newsletter website built with Next.js, Tailwind CSS, and Framer Motion.

## What it is

**The Developer Dispatch** — a free weekly newsletter on React, Laravel, SaaS, and shipping digital products.

## Features

- **Subscribe-first hero** — Email signup with social proof
- **Latest issue** — Featured edition with preview quote
- **Archive** — Grid/list views, topic filters (`/archive`)
- **Issue pages** — Newsletter-style reading experience (`/archive/[slug]`)
- **Search** — `Cmd/Ctrl + K` across all issues
- **About author** — Bio + inline subscribe
- **Testimonials, FAQ, Contact**

## Run

```bash
npm install
npm run dev
```

- Home: http://localhost:3000
- Archive: http://localhost:3000/archive

Old `/blog` URLs redirect to `/archive`.

## Customize

| Item | File |
|------|------|
| Site copy & issues | `lib/data.ts` |
| Subscribe (connect API) | `components/newsletter/SubscribeForm.tsx` |
| Colors | `tailwind.config.ts` |

## Build

```bash
npm run build
npm start
```
