import { PROFANITY_WORDS } from "@/data/profanityWords";

const MASK = "***";

function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[@$]/g, "a")
    .replace(/0/g, "o")
    .replace(/1|!/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/[*_.\-]/g, "");
}

const patterns = PROFANITY_WORDS.map((word) => {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const spaced = escaped.split("").join("[\\s*._-]*");
  return new RegExp(`(?:^|[^\\p{L}])${spaced}(?:[^\\p{L}]|$)`, "iu");
});

export interface ProfanityResult {
  hasProfanity: boolean;
  matches: string[];
}

export function detectProfanity(text: string): ProfanityResult {
  const trimmed = text.trim();
  if (!trimmed) return { hasProfanity: false, matches: [] };
  const normalized = normalizeForMatch(trimmed);
  const matches: string[] = [];

  for (const word of PROFANITY_WORDS) {
    const w = normalizeForMatch(word);
    if (w.length >= 3 && normalized.includes(w)) {
      matches.push(word);
    }
  }

  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) {
      const hit = m[0].replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim();
      if (hit && !matches.includes(hit)) matches.push(hit);
    }
  }

  return { hasProfanity: matches.length > 0, matches };
}

export function maskProfanity(text: string): string {
  let result = text;
  for (const word of PROFANITY_WORDS) {
    const re = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(re, MASK);
  }
  return result;
}

export const PROFANITY_WARNING =
  "ไม่ควรใช้คำหยาบ — ระบบจะบันทึกและอาจจำกัดการโพสต์ชั่วคราว";

export const COMMUNITY_GUIDELINES_PATH = "/legal/community";
