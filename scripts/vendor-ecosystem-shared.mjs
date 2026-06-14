/**
 * Sync shared ecosystem modules from Solo-Code (canonical) → Anthem-Code.
 * Skips when Solo-Code is unavailable (e.g. Vercel deploy of Anthem-Code only).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const anthemRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const soloRoot = join(anthemRoot, "..", "Solo-Code");

if (!existsSync(soloRoot)) {
  console.log("[vendor-ecosystem] Solo-Code not found — using committed vendored files");
  process.exit(0);
}

const copies = [
  {
    src: join(soloRoot, "src", "lib", "lineNotificationKinds.ts"),
    dest: join(anthemRoot, "src", "lib", "lineNotificationKinds.vendored.ts"),
  },
  {
    src: join(soloRoot, "src", "data", "plans.ts"),
    dest: join(anthemRoot, "src", "data", "plans.vendored.ts"),
  },
];

for (const { src, dest } of copies) {
  let content = readFileSync(src, "utf8");
  content = `/** AUTO-GENERATED — do not edit. Source: Solo-Code/${src.split("/Solo-Code/")[1] ?? src} */\n${content}`;
  writeFileSync(dest, content);
}

const safeRelativeFn = readFileSync(
  join(soloRoot, "scripts", "ecosystem-shared", "safeRelativePath.ts"),
  "utf8",
);
const anthemSafeUrl = `/**
 * Safe URL helpers for an1hem.
 * safeRelativePath body is vendored from Solo-Code/scripts/ecosystem-shared/.
 */

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

${safeRelativeFn}
`;
writeFileSync(join(anthemRoot, "src", "lib", "safeUrl.ts"), anthemSafeUrl);

console.log("[vendor-ecosystem] synced → Anthem-Code (lineNotificationKinds, plans.vendored, safeUrl)");
