export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg'];
export const PRODUCT_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Checks a chosen image. Returns 'imageType', 'imageSize' or null, which
 * map to keys in the surface's errors content.
 */
export function validateImage(file, types = ACCEPTED_IMAGE_TYPES) {
  if (!types.includes(file.type)) return 'imageType';
  if (file.size > MAX_BYTES) return 'imageSize';
  return null;
}
