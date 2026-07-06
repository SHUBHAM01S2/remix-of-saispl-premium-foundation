/**
 * End-to-end tests: role-based access control on /admin.
 *
 * Verifies:
 *   1. Anonymous users cannot see admin UI or admin data on /admin routes.
 *   2. Signed-in CLIENT accounts (e.g. Anuj-style) hitting /admin see the
 *      "wrong role" notice — no admin nav, no admin data.
 *   3. Client accounts cannot reach a deep admin route (`/admin/admins`)
 *      even by direct URL.
 *   4. Signing in on /shivi with client credentials does NOT navigate to
 *      /admin — the login-time role assertion holds.
 *
 * Env vars:
 *   BASE_URL              default http://localhost:8080
 *   TEST_CLIENT_EMAIL     a real client (row in client_onboarding, NOT in admins)
 *   TEST_CLIENT_PASSWORD
 *
 * Run: bunx playwright test tests/e2e/admin-access.spec.ts
 */
import { test, expect, type Page } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:8080";
const CLIENT_EMAIL = process.env.TEST_CLIENT_EMAIL!;
const CLIENT_PASS = process.env.TEST_CLIENT_PASSWORD!;

test.beforeAll(() => {
  if (!CLIENT_EMAIL || !CLIENT_PASS) {
    throw new Error("TEST_CLIENT_EMAIL / TEST_CLIENT_PASSWORD env vars required");
  }
});

async function signInClientViaShivi(page: Page) {
  await page.goto(`${BASE}/shivi`);
  await page.getByLabel(/email/i).fill(CLIENT_EMAIL);
  await page.getByLabel(/password/i).fill(CLIENT_PASS);
  await page.getByRole("button", { name: /sign in/i }).click();
}

test.describe("RBAC — /admin is admin-only", () => {
  test("anonymous visit to /admin does not expose admin data", async ({ page }) => {
    const res = await page.goto(`${BASE}/admin`);
    // Either the notFound is served (per _authenticated gate) or we get
    // redirected to a sign-in surface. In both cases the admin sidebar
    // ("Control Panel") must NOT be visible.
    expect(res?.status()).toBeLessThan(500);
    await expect(page.getByText(/Control Panel/i)).toHaveCount(0);
  });

  test("client account on /admin sees WrongRoleNotice, not admin UI", async ({ page }) => {
    await signInClientViaShivi(page);
    // After sign-in, /shivi should NOT redirect to /admin for a client.
    await page.waitForTimeout(1500);
    expect(page.url()).not.toMatch(/\/admin(\/|$)/);

    // Now try to force /admin directly.
    await page.goto(`${BASE}/admin`);
    await expect(
      page.getByText(/wrong account|not have admin|client account/i),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Control Panel/i)).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Manage Admins/i })).toHaveCount(0);
  });

  test("client cannot reach deep admin route /admin/admins", async ({ page }) => {
    await signInClientViaShivi(page);
    const res = await page.goto(`${BASE}/admin/admins`);
    expect(res?.status()).toBeLessThan(500);
    // Should never render the admin accounts table for a client.
    await expect(page.getByRole("heading", { name: /Admin Accounts/i })).toHaveCount(0);
    await expect(page.getByText(/Role change audit/i)).toHaveCount(0);
  });
});
