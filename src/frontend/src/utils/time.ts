/**
 * Safari-safe date/time utilities for iOS compatibility
 */

export function formatDateTime(time: bigint): string {
  const milliseconds = Number(time / BigInt(1_000_000));
  const date = new Date(milliseconds);

  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dateStr} at ${timeStr}`;
}

/**
 * Convert date and time strings to nanoseconds (backend Time format)
 * Safari-safe: constructs Date from numeric parts instead of string parsing
 */
export function dateTimeToNanoseconds(dateStr: string, timeStr: string): bigint {
  try {
    // Parse date parts (YYYY-MM-DD)
    const dateParts = dateStr.split('-').map(Number);
    if (dateParts.length !== 3) {
      throw new Error('Invalid date format');
    }
    const [year, month, day] = dateParts;

    // Parse time parts (HH:MM or HH:MM:SS)
    const timeParts = timeStr.split(':').map(Number);
    if (timeParts.length < 2) {
      throw new Error('Invalid time format');
    }
    const [hours, minutes, seconds = 0] = timeParts;

    // Construct Date from numeric parts (Safari-safe, uses local timezone)
    const date = new Date(year, month - 1, day, hours, minutes, seconds, 0);

    // Validate the constructed date
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date/time values');
    }

    return BigInt(date.getTime()) * BigInt(1_000_000);
  } catch (error) {
    console.error('dateTimeToNanoseconds error:', error, { dateStr, timeStr });
    // Fallback: try string parsing (may fail on some Safari versions)
    const dateTime = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(dateTime.getTime())) {
      throw new Error('Unable to parse date/time');
    }
    return BigInt(dateTime.getTime()) * BigInt(1_000_000);
  }
}
