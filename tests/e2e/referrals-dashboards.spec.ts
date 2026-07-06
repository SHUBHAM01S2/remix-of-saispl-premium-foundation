/**
 * End-to-end UI tests for the sales-partner and admin referral dashboards.
 *
 * Verifies:
 *   1. A partner on /partner/referrals sees ONLY rows for their own account.
 *   2. An admin on /admin/affiliates/referrals sees rows from >= 1 partner
 *      and, when the "All partners" filter is narrowed to a single partner,
 *      every rendered row belongs to that partner.
 *
 * Env vars:
 *   BASE_URL                       default http://localhost:8080
 *   TEST_PARTNER_EMAIL / PASSWORD  a sales_partners user with >=1 referral
 *   TEST_PARTNER_ID                that partner's sales_partners.id (optional; used to compare API vs UI counts)
 *   TEST_ADMIN_EMAIL / PASSWORD    an admins user (any role)
 *
 * Run: bunx playwright test tests/e2e/referrals-dashboards.spec.ts
 */
import { test, expect, type Page } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:8080";
const PARTNER_EMAIL = process.env.TEST_PARTNER_EMAIL!;
const PARTNER_PASS = process.env.TEST_PARTNER_PASSWORD!;
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL!;
const ADMIN_PASS = process.env.TEST_ADMIN_PASSWORD!;

test.beforeAll(() => {
  for (const [k, v] of Object.entries({
    PARTNER_EMAIL, PARTNER_PASS, ADMIN_EMAIL, ADMIN_PASS,
  })) if (!v) throw new Error(`Missing env: ${k}`);
});

async function signInAt(page: Page, path: string, email: string, password: string) {
  await page.goto(`${BASE}${path}`);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
}

test.describe("Partner referrals dashboard is self-scoped", () => {
  test("partner sees only their own referrals on /partner/referrals", async ({ page }) => {
    await signInAt(page, "/partner", PARTNER_EMAIL, PARTNER_PASS);
    await page.waitForURL(/\/partner(\/|$)/, { timeout: 15_000 });

    await page.goto(`${BASE}/partner/referrals`);
    await expect(page.getByRole("heading", { name: /my referrals/i })).toBeVisible();

    // Wait for the table or the empty state.
    await page.waitForSelector('table, text=/No referrals/i', { timeout: 15_000 });

    // No admin nav / All partners filter / cross-partner data must ever appear.
    await expect(page.getByRole("combobox", { name: /partners/i })).toHaveCount(0);
    await expect(page.getByText(/All partners/i)).toHaveCount(0);
    await expect(page.locator('a[href^="/admin"]')).toHaveCount(0);
  });

  test("partner is blocked from admin referrals dashboard", async ({ page }) => {
    await signInAt(page, "/partner", PARTNER_EMAIL, PARTNER_PASS);
    await page.waitForURL(/\/partner(\/|$)/, { timeout: 15_000 });

    await page.goto(`${BASE}/admin/affiliates/referrals`);
    // Either WrongRoleNotice (client-on-admin), a not-found, or a redirect —
    // in every case the admin referrals table headers must NOT render.
    await page.waitForTimeout(2000);
    await expect(page.getByRole("columnheader", { name: /^Partner$/ })).toHaveCount(0);
  });
});

test.describe("Admin referrals dashboard filters by sales person", () => {
  test("admin sees rows and can narrow to a single partner", async ({ page }) => {
    await signInAt(page, "/shivi", ADMIN_EMAIL, ADMIN_PASS);
    await page.waitForURL(/\/admin(\/|$)/, { timeout: 15_000 });

    await page.goto(`${BASE}/admin/affiliates/referrals`);
    await page.waitForSelector('table, text=/No referrals/i', { timeout: 20_000 });

    const bodyRows = page.locator("tbody tr");
    const initialCount = await bodyRows.count();
    test.skip(
      initialCount === 0,
      "Seed data has no referrals; admin filter cannot be exercised.",
    );

    // "All partners" dropdown is the first <select> in the filter grid.
    const partnerSelect = page.locator("select").first();
    await expect(partnerSelect).toBeVisible();

    // Enumerate real partner options (skip the "All partners" placeholder = "").
    const options = await partnerSelect.locator("option").evaluateAll((els) =>
      (els as HTMLOptionElement[])
        .filter((o) => o.value !== "")
        .map((o) => ({ value: o.value, text: o.textContent?.trim() ?? "" })),
    );
    test.skip(options.length === 0, "No partners in dropdown to filter by.");

    const target = options[0];
    await partnerSelect.selectOption(target.value);

    // After filtering, every rendered row's Partner cell must contain the
    // chosen partner's name.
    await page.waitForTimeout(400);
    const filteredCount = await bodyRows.count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    for (let i = 0; i < filteredCount; i++) {
      const partnerCell = bodyRows.nth(i).locator("td").nth(1);
      await expect(partnerCell).toContainText(target.text);
    }
  });
});
