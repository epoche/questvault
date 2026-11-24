/**
 * Local calendar date helpers (YYYY-MM-DD in the user's device timezone).
 * Keeps daily streaks, weekly active days, and parent reports consistent
 * for US Pacific/Eastern families where UTC rolls over in late afternoon.
 */
export function getLocalDateKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isoToLocalDateKey(iso: string): string {
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return iso.slice(0, 10);
  return getLocalDateKey(new Date(ms));
}
