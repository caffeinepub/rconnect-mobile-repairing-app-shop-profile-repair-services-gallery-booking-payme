# Specification

## Summary
**Goal:** Ensure the device model is consistently labeled as “Model Name” across all booking-related screens and dialogs, while continuing to use the existing `deviceModel` value.

**Planned changes:**
- Update the Booking page form label from “Device Model” to “Model Name”, including any related helper and validation text, without changing the saved field (`deviceModel`).
- Update the Public Bookings booking details dialog device label from “Device Model” to “Model Name”, continuing to display `booking.deviceModel`.
- Update the Admin Bookings booking details dialog device label from “Device Model” to “Model Name”, continuing to display `selectedBooking.deviceModel`.

**User-visible outcome:** Users and admins see the device model shown under the label “Model Name” consistently in the booking form and in both public and admin booking details dialogs, with existing bookings displaying correctly.
