/**
 * End-to-end tests for the SAISPL client ↔ admin messaging system.
 *
 * Covers:
 *   1. Client → Admin message delivery + admin unread badge
 *   2. Status chip transitions (waiting_on_team → waiting_on_client)
 *   3. Deep-link navigation from the onboarding Messages card
 *      (`/admin/inbox?thread=<id>`) auto-selecting the correct thread
 *   4. Admin → Client reply + client toast/bell notification
 *
 * Prereqs (set before running):
 *   BASE_URL              - e.g. http://localhost:8080
 *   TEST_CLIENT_EMAIL     - a real client account linked to a
 *                           client_onboarding row via email match
 *   TEST_CLIENT_PASSWORD
 *   TEST_ADMIN_EMAIL      - a real admin account (row in `admins`)
 *   TEST_ADMIN_PASSWORD
 *   TEST_ONBOARDING_ID    - the onboarding UUID that pairs with the
 *                           client account above (for deep-link check)
 *
 * Run with:
 *   bunx playwright test tests/e2e/messaging.spec.ts
 */
import { test, expect, type Page } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:8080";
const CLIENT_EMAIL = process.env.TEST_CLIENT_EMAIL!;
const CLIENT_PASS = process.env.TEST_CLIENT_PASSWORD!;
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL!;
const ADMIN_PASS = process.env.TEST_ADMIN_PASSWORD!;
const ONBOARDING_ID = process.env.TEST_ONBOARDING_ID!;

test.beforeAll(() => {
  for (const [k, v] of Object.entries({
    CLIENT_EMAIL,
    CLIENT_PASS,
    ADMIN_EMAIL,
    ADMIN_PASS,
    ONBOARDING_ID,
  })) {
    if (!v) throw new Error(`Missing TEST_ env var: ${k}`);
  }
});

async function signInClient(page: Page) {
  await page.goto(`${BASE}/client-portal`);
  await page.getByPlaceholder("you@company.com").fill(CLIENT_EMAIL);
  await page.getByPlaceholder("••••••••").fill(CLIENT_PASS);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page.getByRole("button", { name: /messages/i })).toBeVisible({ timeout: 15_000 });
}

async function signInAdmin(page: Page) {
  await page.goto(`${BASE}/auth/admin`);
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  await page.getByLabel(/password/i).fill(ADMIN_PASS);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/admin/, { timeout: 15_000 });
}

test.describe("Client → Admin messaging", () => {
  test("client sends a message and admin sees unread + waiting_on_team", async ({ browser }) => {
    const stamp = `E2E ping ${Date.now()}`;

    // --- Client sends a message ---
    const clientCtx = await browser.newContext();
    const clientPage = await clientCtx.newPage();
    await signInClient(clientPage);
    await clientPage.getByRole("button", { name: /messages/i }).click();
    await clientPage.getByRole("textbox").fill(stamp);
    await clientPage.getByRole("button", { name: /send/i }).click();
    await expect(clientPage.getByText(stamp)).toBeVisible();
    await clientCtx.close();

    // --- Admin sees unread badge and status chip flipped ---
    const adminCtx = await browser.newContext();
    const adminPage = await adminCtx.newPage();
    await signInAdmin(adminPage);

    // Sidebar unread badge
    await expect(adminPage.getByRole("link", { name: /client inbox/i })).toContainText(/\d+/);

    await adminPage.goto(`${BASE}/admin/inbox`);
    await expect(adminPage.getByText(stamp)).toBeVisible({ timeout: 15_000 });
    await expect(adminPage.getByText(/waiting on team/i).first()).toBeVisible();
    await adminCtx.close();
  });

  test("deep-link ?thread= auto-selects the correct conversation", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await signInAdmin(page);

    // Simulate the "Open conversation" click on the onboarding Messages card.
    await page.goto(`${BASE}/admin/inbox?thread=${ONBOARDING_ID}`);
    // The thread pane header renders the client company name; verify the
    // active thread row in the sidebar is highlighted.
    await expect(page.locator("aside button.bg-brand\\/10").first()).toBeVisible({ timeout: 15_000 });
    // URL must retain the thread param.
    await expect(page).toHaveURL(new RegExp(`thread=${ONBOARDING_ID}`));
    await ctx.close();
  });

  test("admin reply → client unread badge + status flips to waiting_on_client", async ({ browser }) => {
    const stamp = `E2E reply ${Date.now()}`;

    // Admin replies
    const adminCtx = await browser.newContext();
    const adminPage = await adminCtx.newPage();
    await signInAdmin(adminPage);
    await adminPage.goto(`${BASE}/admin/inbox?thread=${ONBOARDING_ID}`);
    await adminPage.getByRole("textbox").fill(stamp);
    await adminPage.getByRole("button", { name: /send/i }).click();
    await expect(adminPage.getByText(stamp)).toBeVisible();
    await expect(adminPage.getByText(/waiting on client/i).first()).toBeVisible();
    await adminCtx.close();

    // Client sees notification bell badge + "Waiting on you" chip.
    const clientCtx = await browser.newContext();
    const clientPage = await clientCtx.newPage();
    await signInClient(clientPage);
    // Bell badge should appear (Realtime + polling fallback).
    await expect(
      clientPage.getByRole("button", { name: /new message/i }),
    ).toBeVisible({ timeout: 20_000 });
    await clientPage.getByRole("button", { name: /messages/i }).click();
    await expect(clientPage.getByText(/waiting on you/i)).toBeVisible();
    await expect(clientPage.getByText(stamp)).toBeVisible();
    await clientCtx.close();
  });
});
