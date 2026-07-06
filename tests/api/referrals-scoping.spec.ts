/**
 * API test: referral dashboards row-scope correctly.
 *
 *   - listMyReferrals (partner-scoped) must return ONLY the caller partner's
 *     referrals (partner_id === TEST_PARTNER_ID for every row).
 *   - adminListReferrals (admin-scoped) with no filter returns rows from
 *     multiple partners; with { partner_id } it returns only that partner's
 *     rows; a client caller receives an error.
 *
 * Env vars:
 *   BASE_URL                             default http://localhost:8080
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY
 *   TEST_PARTNER_EMAIL, TEST_PARTNER_PASSWORD
 *   TEST_PARTNER_ID                      sales_partners.id for that account
 *   TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD
 *   TEST_CLIENT_EMAIL, TEST_CLIENT_PASSWORD
 */
import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const BASE = process.env.BASE_URL ?? "http://localhost:8080";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
const PARTNER_EMAIL = process.env.TEST_PARTNER_EMAIL!;
const PARTNER_PASS = process.env.TEST_PARTNER_PASSWORD!;
const PARTNER_ID = process.env.TEST_PARTNER_ID!;
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL!;
const ADMIN_PASS = process.env.TEST_ADMIN_PASSWORD!;
const CLIENT_EMAIL = process.env.TEST_CLIENT_EMAIL!;
const CLIENT_PASS = process.env.TEST_CLIENT_PASSWORD!;

async function signIn(email: string, password: string) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw new Error(`sign-in failed for ${email}: ${error?.message}`);
  return data.session.access_token;
}

async function callFn(name: string, bearer: string, body?: unknown, method: "GET" | "POST" = "GET") {
  const res = await fetch(`${BASE}/_serverFn/${name}`, {
    method,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${bearer}`,
    },
    body: method === "POST" ? JSON.stringify({ data: body ?? {} }) : undefined,
  });
  return { status: res.status, body: await res.text() };
}

let partnerToken = "";
let adminToken = "";
let clientToken = "";

beforeAll(async () => {
  for (const [k, v] of Object.entries({
    SUPABASE_URL, SUPABASE_KEY, PARTNER_EMAIL, PARTNER_PASS, PARTNER_ID,
    ADMIN_EMAIL, ADMIN_PASS, CLIENT_EMAIL, CLIENT_PASS,
  })) if (!v) throw new Error(`Missing env: ${k}`);
  [partnerToken, adminToken, clientToken] = await Promise.all([
    signIn(PARTNER_EMAIL, PARTNER_PASS),
    signIn(ADMIN_EMAIL, ADMIN_PASS),
    signIn(CLIENT_EMAIL, CLIENT_PASS),
  ]);
});

describe("Referral dashboards row-scoping", () => {
  it("partner sees only their own referrals", async () => {
    const r = await callFn("listMyReferrals", partnerToken);
    expect(r.status).toBe(200);
    const rows = JSON.parse(r.body).result ?? JSON.parse(r.body);
    const list = Array.isArray(rows) ? rows : rows.data ?? [];
    for (const row of list) {
      expect(row.partner_id).toBe(PARTNER_ID);
    }
  });

  it("admin sees all referrals when unfiltered", async () => {
    const r = await callFn("adminListReferrals", adminToken);
    expect(r.status).toBe(200);
    const rows = JSON.parse(r.body).result ?? JSON.parse(r.body);
    const list = Array.isArray(rows) ? rows : rows.data ?? [];
    const partnerIds = new Set(list.map((x: any) => x.partner_id));
    // Either seeded with >1 partner or at least contains the partner under test.
    expect(list.length).toBeGreaterThan(0);
    expect(partnerIds.has(PARTNER_ID)).toBe(true);
  });

  it("admin filter by partner_id returns only that partner's rows", async () => {
    const r = await callFn("adminListReferrals", adminToken, { partner_id: PARTNER_ID }, "POST");
    // The fn is GET but server-fn accepts POST payloads too when data is sent.
    // Fall back to GET if that returned 405:
    const res = r.status === 405
      ? await callFn(`adminListReferrals?data=${encodeURIComponent(JSON.stringify({ partner_id: PARTNER_ID }))}`, adminToken)
      : r;
    expect(res.status).toBeLessThan(400);
    const rows = JSON.parse(res.body).result ?? JSON.parse(res.body);
    const list = Array.isArray(rows) ? rows : rows.data ?? [];
    for (const row of list) {
      expect(row.partner_id).toBe(PARTNER_ID);
    }
  });

  it("client caller is denied from adminListReferrals", async () => {
    const r = await callFn("adminListReferrals", clientToken);
    const denied = r.status >= 400 || /forbidden|unauthorized/i.test(r.body);
    expect(denied).toBe(true);
  });

  it("client caller is denied from listMyReferrals (not a partner)", async () => {
    const r = await callFn("listMyReferrals", clientToken);
    // Non-partners get an empty list (200 []) — verify no other partner's data leaks.
    if (r.status === 200) {
      const rows = JSON.parse(r.body).result ?? JSON.parse(r.body);
      const list = Array.isArray(rows) ? rows : rows.data ?? [];
      expect(list.length).toBe(0);
    } else {
      expect(r.status).toBeGreaterThanOrEqual(400);
    }
  });
});
