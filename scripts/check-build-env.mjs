#!/usr/bin/env node
/**
 * Fail production builds that enable demo mode (known shared credentials in bundle).
 *
 * Usage:
 *   node scripts/check-build-env.mjs              # checks process.env
 *   DEPLOY_TARGET=production node scripts/check-build-env.mjs
 */
const deployTarget = (process.env.DEPLOY_TARGET || process.env.VERCEL_ENV || "").toLowerCase();
const demoMode = (process.env.VITE_DEMO_MODE || "false").toLowerCase();

const isProductionTarget =
  deployTarget === "production" ||
  deployTarget === "prod" ||
  process.env.VERCEL_ENV === "production";

if (isProductionTarget && (demoMode === "true" || demoMode === "1")) {
  console.error(
    "[security] VITE_DEMO_MODE must not be true for production deploys.\n" +
      "Use scripts/deploy-demo-vercel.sh for preview/demo only.",
  );
  process.exit(1);
}

console.log("[check-build-env] OK", { deployTarget: deployTarget || "(unset)", demoMode });
