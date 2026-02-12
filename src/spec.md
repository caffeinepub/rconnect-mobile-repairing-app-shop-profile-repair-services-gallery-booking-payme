# Specification

## Summary
**Goal:** Update the app’s Rconnect logo asset to the newly provided design and add a new public, read-only “All Bookings” page that anyone can access without login.

**Planned changes:**
- Replace the existing logo file at `/assets/generated/rconnect-logo.dim_512x512.png` with the newly uploaded logo artwork so existing header and Shop page hero logo rendering continues without frontend path changes.
- Add a new public route (e.g., `/bookings`) that lists all submitted bookings and provides a read-only booking details view.
- Add a backend method to fetch all bookings for the public page if current all-bookings access is restricted.
- Add a new “All Bookings” navigation item to both the desktop header navigation and the mobile menu.
- Keep the existing admin-only bookings management page at `/admin/bookings` unchanged and still able to update booking status.

**User-visible outcome:** Users can see the updated Rconnect logo across the site, and anyone can open a new “All Bookings” page from the main navigation to browse all bookings and view booking details without being able to modify anything.
