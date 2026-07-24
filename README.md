# Tripzo Cabs & Tours

Modern marketing website + booking + admin dashboard for Tripzo Cabs & Tours (Sri Lanka).

## Features

- Public site: Home, Tours (incl. 7-day package), Fleet, Gallery, About, Contact, Booking
- Floating WhatsApp connector (`+94 76 649 3348`)
- Visitor booking form with stored requests
- Admin dashboard (`/admin`) for bookings, gallery uploads, and fleet management

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default admin password is set in `.env.local` (`ADMIN_PASSWORD`).

## Environment

See `.env.local`:

- `ADMIN_PASSWORD`
- `ADMIN_SECRET`
- `NEXT_PUBLIC_WHATSAPP`
- `NEXT_PUBLIC_PHONE`
- `NEXT_PUBLIC_EMAIL`
- `NEXT_PUBLIC_MESSENGER`
