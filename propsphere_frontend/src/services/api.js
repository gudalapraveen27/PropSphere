export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000")
  .replace(/\/$/, "");

export function imageUrl(image) {
  if (!image) return "/no-image.png";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
}
