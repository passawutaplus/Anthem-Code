/** URL helpers for tool/tag explore galleries */

export type ExploreKind = "tool" | "tag";

export function exploreProjectsUrl(kind: ExploreKind, value: string): string {
  return `/explore/${kind}/${encodeURIComponent(value.trim())}`;
}

export function decodeExploreParam(raw: string | undefined): string {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}

export function normalizeTag(tag: string): string {
  return tag.trim().replace(/^#+/, "").toLowerCase();
}
