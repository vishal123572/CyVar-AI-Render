// Same-origin requests work in Docker/Railway; Vite proxies /api during local development.
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
