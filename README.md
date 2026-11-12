# Autochip.uz — Performance Lab

React + Vite + Tailwind CSS PWA, prepared for Vercel deployment. Includes public booking form, protected admin inbox and Supabase storage.

## 1. Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

The public site works visually without Supabase, but form submission requires the backend configuration below.

## 2. Configure Supabase

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy Project URL, anon/public key and service_role key from Project Settings → API.
4. Set environment variables in `.env` (local) and Vercel (production):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD` — use a long, unique password.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PASSWORD` server-only. Never prefix them with `VITE_`.

## 3. Contact details

Edit the root `config.js`: Instagram, phone, Telegram username, Tashkent address and map link. The phone and exact address are placeholders because verified business details were not supplied.

## 4. Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Framework preset: Vite; Build command: `npm run build`; Output directory: `dist`.
4. Add all environment variables listed above in Vercel → Settings → Environment Variables.
5. Deploy. The `/api` files run as Vercel Functions.

## 5. Admin panel

Open `/admin` and sign in with `ADMIN_PASSWORD`. New requests are refreshed every 10 seconds. This is near-real-time polling, not a persistent websocket subscription. The API returns at most the latest 200 requests.

## Important production notes

- Prices and performance figures in the catalogue are illustrative starting estimates; confirm actual service pricing and legal/technical suitability before publishing.
- The current login issues a 12-hour signed token. Use a long unique admin password, enable Vercel deployment protection where appropriate, and consider Supabase Auth + MFA for a multi-user production back office.
- Add rate limiting / CAPTCHA and a privacy notice before accepting public traffic at scale.
- A booking request is not a confirmed appointment; the shop must confirm it with the customer.
- The included PWA manifest and service worker provide an installable shell and offline fallback for the main page. API requests are never cached; booking requires a connection.
