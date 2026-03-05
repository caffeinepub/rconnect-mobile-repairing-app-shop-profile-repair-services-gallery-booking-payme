# Specification

## Summary
**Goal:** Display a customer's complete booking history when they search for a booking by phone number.

**Planned changes:**
- Add backend function to retrieve all bookings for a given phone number
- Create React hook (useCustomerBookings) to fetch customer booking history
- Update PublicBookingsPage to display all previous bookings for the searched phone number
- Show each booking's ID, service type, device details, status, and date
- Highlight or show the searched booking first, with previous bookings clearly labeled

**User-visible outcome:** When a customer searches for their booking using phone number, they will see their current booking along with all their previous bookings in a list, making it easy to track their repair history.
