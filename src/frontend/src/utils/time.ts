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

export function dateTimeToNanoseconds(dateStr: string, timeStr: string): bigint {
  const dateTime = new Date(`${dateStr}T${timeStr}`);
  return BigInt(dateTime.getTime()) * BigInt(1_000_000);
}
