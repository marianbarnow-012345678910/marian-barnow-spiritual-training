# Marian Barnow Spiritual Training — client portal

A members' app for your clients at **portal.marianbarnow.com** (or any address you choose):

- **Own login** — clients create a free account with e-mail and password, confirm by e-mail, and can reset their password themselves.
- **Free meditations** — video or audio, filterable by length and theme, with "mark as done" progress.
- **Webinars** — upcoming live sessions (join button appears 15 minutes before, add-to-calendar) and recordings.
- **Classes in Dublin** — your **Momence schedule**, live. Clients pay by card through **Stripe** and are put on the class roster in Momence automatically.
- **My bookings** — each client's places, with .ics and Google Calendar buttons.
- **Manage portal** (only you) — add/edit meditations and webinars, set class prices, see bookings and fix any that need attention.

Built with Next.js 16, Supabase (logins + database) and Stripe. Hosts on Vercel like your website.

---

## Try it first (demo mode)

With no keys set, the app runs on sample content so you can click through everything.

```bash
npm install
npm run dev
# open http://localhost:3000 — any e-mail/password signs you in
```

Or deploy to Vercel without environment variables and open the link.

---

## Going live — about 45 minutes

### 1. Supabase (logins and database)

1. Create a project at [supabase.com](https://supabase.com). Choose an **EU region** (Ireland or Frankfurt) for GDPR.
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**.
3. **Authentication → URL Configuration**
   - Site URL: `https://portal.marianbarnow.com`
   - Redirect URLs: add `https://portal.marianbarnow.com/auth/callback`
4. **Authentication → Emails → SMTP settings**: switch on custom SMTP and use your **Brevo** SMTP details. Supabase's built-in sender only allows a handful of e-mails per hour — not enough for real sign-ups. Sender: something like `hello@marianbarnow.com`.
5. Optional: edit the e-mail templates (Confirm signup, Reset password) so they sound like you.
6. **Project Settings → API**: copy the Project URL, the `anon` key and the `service_role` key for step 4.

### 2. Momence (class calendar)

1. Momence dashboard → **Apps & Integrations → Developer API** → add a new API client. Copy the **Client ID** and **Client secret**.
2. Use a **staff login** of your studio account as `MOMENCE_USERNAME` / `MOMENCE_PASSWORD`. A dedicated staff user (e.g. `portal@marianbarnow.com`) is best, so you can revoke it separately.
3. Only **in-person, published, non-private** classes in the next 60 days are shown. If you have several locations, set `MOMENCE_LOCATION_ID` to the Dublin studio.

### 3. Stripe (payments)

1. Stripe → **Developers → API keys** → copy the **Secret key** (`sk_live_…`, or `sk_test_…` while testing).
2. **Developers → Webhooks → Add endpoint**
   - URL: `https://portal.marianbarnow.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`
   - Copy the **Signing secret** (`whsec_…`).

### 4. Vercel (hosting)

1. Put this folder in a new GitHub repository and **Import** it in Vercel (or run `npx vercel` inside the folder).
2. **Settings → Environment Variables**: add every value from `.env.example`.
3. **Settings → Domains**: add `portal.marianbarnow.com` and create the CNAME record Vercel shows you at your domain provider.
4. Redeploy.

### 5. Make yourself admin

Sign up once in the live portal with your own e-mail, then in Supabase **SQL Editor** run:

```sql
update public.profiles set is_admin = true
where id = (select id from auth.users where email = 'marianbarnow@gmail.com');
```

Refresh — **Manage portal** appears in the menu.

### 6. Add content and prices

- **Manage portal → Content → Add meditation or webinar.** Paste a YouTube link (set the video to *Unlisted* so it's only findable through the portal), a Vimeo link, or a direct `.mp3`/`.mp4` link.
- **Manage portal → Class prices.** Momence doesn't give prices out through its API, so set them here by class name. `schema.sql` already adds Meditation Class €20, Spiritual Intuition €50, Sanctuary Meditation €50 — change them to match.

### 7. Test one booking

Set the Stripe **test** keys, book a class with card `4242 4242 4242 4242`, and check that the client appears on the roster in Momence. Then switch to live keys.

---

## How a booking works

1. Client clicks **Book my place** → the app checks the class still has room and isn't already booked by them.
2. Stripe Checkout opens (card, plus Apple Pay / Google Pay if they're switched on in your Stripe settings). The checkout expires after 30 minutes.
3. On payment, Stripe notifies the app. The app finds the client in Momence by e-mail (or creates them) and adds them to the class.
4. The booking shows as **Confirmed** in *My bookings*, with calendar buttons. Stripe sends the receipt.

If Momence refuses step 3 (for example, the class was deleted), the money is not lost: the booking is marked **"Paid — Marian is confirming your place"** for the client and listed under **Manage portal → Bookings**. Add them in Momence by hand and press *Added in Momence*.

### Good to know

- **Revenue shows in Stripe, not in Momence.** Momence records these places as complimentary adds, so Momence sales reports won't include portal bookings.
- **Refunds and cancellations** are manual: refund in Stripe and remove the client from the class in Momence.
- **Last place:** if two people pay for the very last place within the same minute, the class can be over-booked by one.
- **Only portal bookings appear in *My bookings*.** Places booked directly in Momence or through ClassPass stay in Momence.
- Momence's docs don't say which plans include the Developer API — if you don't see the menu item, ask Momence support.
- Add a link to your privacy policy in your Supabase sign-up e-mail and on marianbarnow.com, since you're storing client accounts.

---

## Where things are

| Path | What it does |
| --- | --- |
| `app/login`, `app/signup`, `app/forgot-password` | Sign-in screens |
| `app/dashboard/*` | Client area: home, meditations, webinars, classes, bookings, account |
| `app/admin/*` | Your management pages |
| `app/api/checkout` | Starts Stripe Checkout for a class |
| `app/api/stripe/webhook` | Confirms payment and books the client in Momence |
| `app/api/calendar/*` | .ics calendar files |
| `lib/momence.ts` | Momence API client |
| `lib/demo-data.ts` | Sample content for demo mode |
| `supabase/schema.sql` | Database tables and security rules |
| `app/globals.css` | Colours, fonts and layout |
| `lib/site.ts` | Photos, your bio and the studio text |
| `public/images/` | The photo files |

Colours live at the top of `app/globals.css` (`--ink`, `--gold`, `--mist` …). Headings use Marcellus, body text Public Sans, both from Google Fonts.

## Photos

Three photo spots, all set in `lib/site.ts`:

- **Sign-in screen** — `signIn.photo` (now `marian-portrait.jpg`). `focus` decides which part stays visible when the photo is cropped.
- **"Your teacher" on the home screen** — `teacher.photo` (now `marian-teacher.jpg`), with your bio in `teacher.bio`.
- **"Where we meet" on the Classes page** — `studio.photo`, empty for now. Save a landscape photo of the space as `public/images/studio.jpg` and set `photo: "/images/studio.jpg"`.

To swap a photo, replace the file in `public/images/` with one of the same name and redeploy. Keep files under about 300 KB so the portal loads fast on phones.
