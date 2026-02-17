# Specification

## Summary
**Goal:** Add a customer billing (invoice) feature so admins can generate, store, and share printable invoices linked to existing bookings.

**Planned changes:**
- Add backend invoice data model and persistent storage, including computed totals and validation that the booking exists.
- Add admin-protected backend endpoints to create invoices and to list/get invoices (including filtering by bookingId).
- Add a public backend endpoint to fetch an invoice for customer viewing using a shareable access mechanism (invoiceId + access code/token).
- Update the Admin Bookings page to include an invoice creation flow with editable line items, totals preview, and a shareable link with copy-to-clipboard.
- Add a customer-facing invoice view route that renders an English, print-friendly receipt/invoice layout and supports browser printing.
- Apply a cohesive receipt-like theme for invoice creation and viewing that matches the existing amber/orange brand and works in light/dark mode.

**User-visible outcome:** Admins can create and manage invoices for bookings and share a secure link with customers; customers can open the link to view and print an English invoice without logging in.
