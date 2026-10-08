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

function errorCode(error) {
  return typeof error?.code === 'string' ? error.code : '';
}

function errorMessage(error) {
  return typeof error?.message === 'string' ? error.message.toLowerCase() : '';
}

function isAlreadyLinked(error) {
  const code = errorCode(error);
  const message = errorMessage(error);
  return code === 'phone_exists'
    || code === 'user_already_exists'
    || (message.includes('already') && (message.includes('phone') || message.includes('registered') || message.includes('exists')));
}

function isRateLimited(error) {
  const code = errorCode(error);
  const message = errorMessage(error);
  return error?.status === 429
    || code === 'over_request_rate_limit'
    || code === 'over_sms_send_rate_limit'
    || message.includes('rate limit')
    || message.includes('only request this after');
}

export function sendCodeErrorMessage(error) {
  if (isAlreadyLinked(error)) return 'This number is already linked to another account';
  if (isRateLimited(error)) return 'Too many attempts — please wait a few minutes';

  const code = errorCode(error);
  const message = errorMessage(error);
  if (
    code === 'validation_failed'
    || code === 'invalid_phone'
    || (message.includes('phone') && (message.includes('invalid') || message.includes('valid')))
  ) {
    return 'Enter a valid phone number.';
  }

  return "We couldn't send a code. Please try again.";
}

export function verifyCodeErrorMessage(error) {
  if (isRateLimited(error)) return 'Too many attempts — please wait a few minutes';

  const code = errorCode(error);
  const message = errorMessage(error);
  if (
    code === 'otp_expired'
    || code === 'otp_disabled'
    || message.includes('expired')
    || message.includes('invalid')
    || message.includes('token')
  ) {
    return 'That code is incorrect or has expired.';
  }

  return "We couldn't verify that code. Please try again.";
}
