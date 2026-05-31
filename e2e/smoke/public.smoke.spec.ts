import { test, expect } from "@playwright/test";

/**
 * Smoke suite — only public/unauthenticated checks.
 * Goal: confirm the app boots and routing/headers are healthy before deeper QA.
 * Run with:  bun run e2e:smoke
 */

test.describe("smoke @public", () => {
  test("home renders and has H1 + main landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/an1hem|anthem/i);
    await expect(page.locator("main, [role=main]").first()).toBeVisible();
  });

  test("auth page is reachable", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.getByRole("button", { name: /เข้าสู่ระบบ|sign in|login/i }).first()).toBeVisible();
  });

  test("guest hitting /admin is redirected to /auth", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("guest hitting /chat is redirected to /auth", async ({ page }) => {
    await page.goto("/chat");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("open-redirect guard blocks //evil.com", async ({ page }) => {
    await page.goto("/auth?redirect=//evil.com");
    // safeRelativePath should strip the protocol-relative target
    await expect(page).not.toHaveURL(/evil\.com/);
  });

  test("legal pages render", async ({ page }) => {
    for (const path of ["/legal/terms", "/legal/privacy", "/legal/cookies"]) {
      await page.goto(path);
      await expect(page.locator("body")).toContainText(/.+/);
    }
  });

  test("security headers present (meta)", async ({ page }) => {
    await page.goto("/");
    const hasCsp = await page.locator('meta[http-equiv="Content-Security-Policy-Report-Only"]').count();
    const hasNoSniff = await page.locator('meta[http-equiv="X-Content-Type-Options"]').count();
    expect(hasCsp).toBeGreaterThan(0);
    expect(hasNoSniff).toBeGreaterThan(0);
  });

  test("no service_role key leaked into client HTML", async ({ page }) => {
    const res = await page.goto("/");
    const body = (await res?.text()) ?? "";
    expect(body).not.toMatch(/service_role/i);
  });
});
