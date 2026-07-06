/**
 * E2E: an admin whose role is downgraded to "not admin" while their session
 * is still active must be blocked from /admin routes on the very next
 * navigation — no page reload required from an attacker's perspective.
 *
 * Flow:
 *   1. Sign in as an admin via /shivi
 *   2. Confirm /admin renders the control panel
 *   3. Using the service role key, DELETE the row in public.admins
 *      (simulating a super-admin revoke via the Manage Admins UI)
 *   4. Reload /admin — the session bearer is unchanged, but the RBAC
 *      check is DB-backed, so the WrongRoleNotice must render and the
 *      admin sidebar must not appear.
 *   5. Restore the admin row so subsequent test runs are unaffected.
 *
 * Env vars:
 *   BASE_URL                         default http://localhost:8080
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY        required — service role key
 *   TEST_ADMIN_EMAIL
 *   TEST_ADMIN_PASSWORD
 *   TEST_ADMIN_USER_ID               auth uid of the test admin
 *
 * The test restores the row on success AND on failure via afterAll.
 */
import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const BASE = process.env.BASE_URL ?? "http://localhost:8080";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const EMAIL = process.env.TEST_ADMIN_EMAIL!;
const PASS = process.env.TEST_ADMIN_PASSWORD!;
const UID = process.env.TEST_ADMIN_USER_ID!;

let originalRole: string | null = null;

test.beforeAll(() => {
  for (const [k, v] of Object.entries({ SUPABASE_URL, SERVICE_KEY, EMAIL, PASS, UID })) {
    if (!v) throw new Error(`Missing env: ${k}`);
  }
});

test.afterAll(async () => {
  // Best-effort restore so a failed test doesn't lock the admin out.
  if (originalRole == null) return;
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  await admin.from("admins").upsert({ id: UID, email: EMAIL, role: originalRole });
});

test("downgrading an admin immediately blocks their live session", async ({ page }) => {
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  // Snapshot the admin row so we can restore it.
  const { data: row } = await admin.from("admins").select("role").eq("id", UID).maybeSingle();
  originalRole = row?.role ?? "super_admin";

  // 1. Sign in via /shivi.
  await page.goto(`${BASE}/shivi`);
  await page.getByLabel(/email/i).fill(EMAIL);
  await page.getByLabel(/password/i).fill(PASS);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/admin(\/|$)/, { timeout: 15_000 });
  await expect(page.getByText(/Control Panel/i)).toBeVisible();

  // 2. Simulate revocation via the service role.
  const { error: delErr } = await admin.from("admins").delete().eq("id", UID);
  expect(delErr).toBeNull();

  // 3. Reload — same session, revoked role.
  await page.goto(`${BASE}/admin`);
  await expect(
    page.getByText(/dashboard is for admins only|wrong|not have admin/i),
  ).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(/Control Panel/i)).toHaveCount(0);

  // 4. Deep admin route must also be blocked.
  await page.goto(`${BASE}/admin/admins`);
  await expect(page.getByRole("heading", { name: /Admin Accounts/i })).toHaveCount(0);

  // 5. Restore for follow-up runs (afterAll is a safety net).
  await admin.from("admins").upsert({ id: UID, email: EMAIL, role: originalRole });
});
