# RCONNECT Mobile Repairing App

## Current State
The app is a mobile repair shop booking and showcase platform built with React + TanStack Router + Motoko backend. It has:
- ShopPage (home with amber/orange theme, brand info, quick actions)
- BookingPage (repair booking form with services catalog)
- AdminBookingsPage (all bookings list with status filter and update)
- PublicBookingsPage (track booking by ID + phone)
- ServicesPage, GalleryPage, ContactPage, ReviewsPage
- Header with nav links: Home, Services, Gallery, Book Now, Bookings, Reviews, Contact
- Backend: createBooking, getAllBookings, updateBookingStatus, trackBooking, getBookingsByPhoneNumber, submitReview, etc.
- Logo at /assets/generated/rconnect-logo.dim_512x512.png
- Color theme: amber/orange gradients

## Requested Changes (Diff)

### Add
- **Blue/Black tech theme** — replace amber/orange with blue (#1e40af, #0ea5e9, #1e293b, #0f172a) throughout all pages; dark circuit/tech background aesthetic
- **New Home Screen layout** — bold RCONNECT header, "Mobile Repairing Experts" subtitle, 4 large icon buttons: New Repair Entry (→ /booking), Customer List (→ /bookings), Daily Income (→ /income), Contact Shop (→ /contact); dark tech background with subtle circuit pattern overlay
- **Daily Income Page** (/income) — shows all completed bookings for today, sums up total income, displays list of completed repairs with price. Derive price from issueDescription if available. Show daily total.
- **Redesigned AdminBookingsPage** — styled as a Customer List with table layout (Customer | Model | Problem | Status | Actions), search input, edit/status update inline. Full table for desktop, card stacked for mobile.
- **WhatsApp button** on Contact page — "WhatsApp Chat" button that opens wa.me/918055788280
- **Repair Status visual indicators** — on booking cards: 🟡 Pending, 🔧 Under Repair (confirmed), 🟢 Completed, ❌ Cancelled — colored status badges with emoji indicators
- **iPhone parts in booking** — add iPhone-specific models to deviceModel suggestions/autocomplete list in BookingPage: iPhone 6, 7, 8, X, XR, XS, 11, 12, 13, 14, 15 (all variants), plus Android: Samsung S/A series, Vivo, OPPO, Realme, OnePlus, Xiaomi/Redmi, Motorola
- **Job Card ID** display — show Job Card # on booking cards prominently  
- **Repair price field** — add repairPrice field to BookingPage form (optional, for shop use)

### Modify
- **All page headers** — change from amber/orange gradient to blue/dark gradient (from-blue-900 to-slate-900)
- **ShopPage** — redesign as a dark tech-style home dashboard with 4 large action buttons; keep shop info and brands section but restyled in blue theme
- **Header** — change active/hover colors from amber to blue; add "Daily Income" nav link
- **ContactPage** — add WhatsApp Chat button, update colors to blue theme
- **BookingPage** — add deviceModel dropdown/datalist with iPhone and Android model suggestions; add optional repairPrice input field; update to blue theme
- **Footer** — update to blue/dark tech theme

### Remove
- Payment method field from BookingPage (simplify — shop handles payment directly)

## Implementation Plan

1. **Update index.css / tailwind config** — add blue tech color tokens; add subtle circuit background pattern via CSS
2. **Update ShopPage** — full redesign to dark home dashboard with 4 big action buttons (grid layout), blue/black gradient, tech vibe; keep brands section
3. **Create IncomePage** (/income route) — queries getAllBookings, filters today's completed bookings, sums prices parsed from issueDescription or a stored price field; shows daily total card + list
4. **Update AdminBookingsPage** — add search bar, change to table layout on desktop / card on mobile, add prominent Job Card ID, repair status visual icons
5. **Update BookingPage** — add deviceModel datalist with iPhone (all major models) + Android models; add optional repair price field; remove payment method; update colors to blue
6. **Update ContactPage** — add WhatsApp button for 8055788280; update colors
7. **Update Header** — add Daily Income link; change amber colors to blue
8. **Update App.tsx** — add /income route
9. **Update all page gradient headers** from amber/orange to blue/dark
10. **Update Footer** — blue/dark tech theme
