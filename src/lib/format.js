const LOCALE_FOR_CURRENCY = {
  GBP: 'en-GB',
  NGN: 'en-NG',
  USD: 'en-US',
};

/**
 * Formats a whole-unit amount in the given currency, e.g. 2450 GBP -> "£2,450".
 */
export function formatMoney(amount, currency) {
  return new Intl.NumberFormat(LOCALE_FOR_CURRENCY[currency] ?? 'en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-GB').format(value);
}

/**
 * Compact count, e.g. 1200 -> "1.2k".
 */
export function formatCompact(value) {
  return new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 })
    .format(value)
    .toLowerCase();
}

/**
 * Whole months between a date and now.
 */
export function monthsSince(isoDate, now = new Date()) {
  const start = new Date(isoDate);
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return now.getDate() < start.getDate() ? months - 1 : months;
}

/**
 * A date as "YYYY-MM-DD" in the viewer's own time zone. toISOString() uses
 * UTC, which is a day off near midnight for anyone not on UTC.
 */
export function localIsoDate(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Short month + day, e.g. "Aug 31".
 */
export function formatShortDate(isoDate) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(isoDate));
}

/**
 * Month, day and year, e.g. "Aug 31, 2026".
 */
export function formatLongDate(isoDate) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(isoDate));
}

/**
 * Money with an explicit sign, e.g. 45000 GBP -> "+£45,000", -8500 -> "-£8,500".
 */
export function formatSignedMoney(amount, currency) {
  return `${amount > 0 ? '+' : amount < 0 ? '-' : ''}${formatMoney(Math.abs(amount), currency)}`;
}

/**
 * Signed percentage, e.g. 18.6 -> "+18.6%".
 */
export function formatDelta(value, suffix = '%') {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}${suffix}`;
}

/**
 * Replaces {placeholders} in a content template, e.g.
 * fill('{n} items', { n: 3 }) -> "3 items".
 */
export function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}

/**
 * Picks the singular or plural template from a { one, other } pair.
 */
export function plural(templates, n) {
  return fill(n === 1 ? templates.one : templates.other, { n });
}

/**
 * Turns a timestamp into "2 hrs ago" style text using content templates.
 */
export function formatTimeAgo(isoDate, labels, now = Date.now()) {
  const minutes = Math.max(0, Math.round((now - new Date(isoDate).getTime()) / 60000));
  if (minutes < 1) return labels.justNow;
  if (minutes < 60) return fill(labels.minutes, { n: minutes });
  const hours = Math.round(minutes / 60);
  if (hours === 1) return labels.hour;
  if (hours < 24) return fill(labels.hours, { n: hours });
  const days = Math.round(hours / 24);
  return days === 1 ? labels.day : fill(labels.days, { n: days });
}

/**
 * Date and time, e.g. "Oct 7, 2026, 9:00 AM".
 */
export function formatDateTime(isoDate) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(new Date(isoDate));
}

/**
 * Time of day, e.g. "9:00 AM".
 */
export function formatTime(isoDate) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(isoDate));
}
