const DIAL_CODES = new Set(['+44', '+234']);

/**
 * National format to E.164. Strips spaces, dashes, and brackets, then
 * removes one leading trunk 0. Null unless 10 digits remain.
 */
export function toE164(dialCode, input) {
  if (!DIAL_CODES.has(dialCode) || typeof input !== 'string') return null;

  const stripped = input.replace(/[\s\-()[\]]/g, '');
  const national = stripped.startsWith('0') ? stripped.slice(1) : stripped;
  if (!/^\d{10}$/.test(national)) return null;
  return `${dialCode}${national}`;
}

/** `+447700900123` → `+44 •••• ••••23`. Empty string when it isn't our E.164. */
export function maskE164(e164) {
  let dial = '';
  let national = '';
  if (typeof e164 === 'string' && e164.startsWith('+234')) {
    dial = '+234';
    national = e164.slice(4);
  } else if (typeof e164 === 'string' && e164.startsWith('+44')) {
    dial = '+44';
    national = e164.slice(3);
  } else {
    return '';
  }
  if (!/^\d{10}$/.test(national)) return '';
  return `${dial} •••• ••••${national.slice(-2)}`;
}

