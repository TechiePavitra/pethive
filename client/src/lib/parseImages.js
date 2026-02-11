/**
 * Safely extract an array of image URLs from product.images,
 * which may be a JSON string, a plain URL string, or already an array.
 */
export function parseImages(images) {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    // Try JSON parse first (handles '["url1","url2"]')
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // Plain URL string — wrap in array
      return [images];
    }
  }
  return [];
}
