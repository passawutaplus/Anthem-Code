import { type Page, expect } from "@playwright/test";
import { accounts } from "../fixtures/accounts";

export async function signIn(page: Page, role: keyof typeof accounts) {
  const { email, password } = accounts[role];
  await page.goto("/auth");
  await page.getByLabel(/อีเมล|email/i).first().fill(email);
  await page.getByLabel(/รหัสผ่าน|password/i).first().fill(password);
  await page.getByRole("button", { name: /เข้าสู่ระบบ|sign in|login/i }).click();
  await expect(page).not.toHaveURL(/\/auth/, { timeout: 10_000 });
}
