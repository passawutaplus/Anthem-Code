/**
 * Returns the URL only if it is an http(s) absolute URL.
 * Otherwise returns undefined to prevent javascript:, data:, etc. XSS via href.
 */
export const safeHttpUrl = (raw?: string | null): string | undefined => {
  if (!raw) return undefined;
  const v = raw.trim();
  if (!v) return undefined;
  try {
    const u = new URL(v);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
  } catch {
    /* not a valid absolute URL */
  }
  return undefined;
};

/** Same-origin relative path guard for post-login redirects. */
export const safeRelativePath = (raw?: string | null, fallback = "/"): string => {
  if (!raw) return fallback;
  // Must start with a single '/' and not '//' (protocol-relative) or '/\'
  return /^\/(?![/\\])/.test(raw) ? raw : fallback;
};
