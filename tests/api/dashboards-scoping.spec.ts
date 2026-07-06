/**
 * API tests: partner + admin dashboard endpoints row-scope by role.
 *
 * Endpoints covered:
 *   - getMyStats           (partner-scoped totals)
 *   - listMyReferrals      (partner-scoped rows)
 *   - adminOverview        (admin-only aggregate)
 *   - adminListReferrals   (admin, with partner_id filter)
 *
 * Env vars mirror tests/api/referrals-scoping.spec.ts.
 * Run: bunx vitest run tests/api/dashboards-scoping.spec.ts
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

async function callFn(
  name: string,
  bearer: string,
  body?: unknown,
  method: "GET" | "POST" = "GET",
) {
  const url =
    method === "GET" && body
      ? `${BASE}/_serverFn/${name}?data=${encodeURIComponent(JSON.stringify(body))}`
      : `${BASE}/_serverFn/${name}`;
  const res = await fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${bearer}`,
    },
    body: method === "POST" ? JSON.stringify({ data: body ?? {} }) : undefined,
  });
  return { status: res.status, body: await res.text() };
}

function parseRows(text: string): any {
  const j = JSON.parse(text);
  return j.result ?? j.data ?? j;
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

describe("Partner dashboard endpoints — self-scoped", () => {
  it("getMyStats returns totals derived from partner's own referrals only", async () => {
    const r = await callFn("getMyStats", partnerToken);
    expect(r.status).toBe(200);
    const stats = parseRows(r.body);
    if (stats === null) return; // partner has no rows yet — acceptable
    for (const k of ["total", "active", "won", "lost", "commissionTotal"]) {
      expect(stats).toHaveProperty(k);
      expect(typeof stats[k]).toBe("number");
    }

    // Cross-check: listMyReferrals row count matches stats.total.
    const list = await callFn("listMyReferrals", partnerToken);
    const rows = parseRows(list.body);
    const arr = Array.isArray(rows) ? rows : [];
    expect(arr.length).toBe(stats.total);
    for (const row of arr) expect(row.partner_id).toBe(PARTNER_ID);
  });

  it("getMyStats is denied / null for client caller (no partner row)", async () => {
    const r = await callFn("getMyStats", clientToken);
    // Client is not a partner → handler returns null (200) rather than throw.
    if (r.status === 200) {
      const stats = parseRows(r.body);
      expect(stats === null || stats?.total === 0).toBe(true);
    } else {
      expect(r.status).toBeGreaterThanOrEqual(400);
    }
  });
});

describe("Admin dashboard endpoints — admin-only + partner-scoped filter", () => {
  it("adminOverview succeeds for admin and denies client caller", async () => {
    const ok = await callFn("adminOverview", adminToken);
    expect(ok.status).toBe(200);

    const denied = await callFn("adminOverview", clientToken);
    const isDenied = denied.status >= 400 || /forbidden|unauthorized/i.test(denied.body);
    expect(isDenied).toBe(true);
  });

  it("adminListReferrals filter by partner_id returns only that partner's rows", async () => {
    const r = await callFn("adminListReferrals", adminToken, { partner_id: PARTNER_ID });
    expect(r.status).toBeLessThan(400);
    const rows = parseRows(r.body);
    const arr = Array.isArray(rows) ? rows : [];
    for (const row of arr) expect(row.partner_id).toBe(PARTNER_ID);
  });

  it("adminListReferrals unfiltered contains the partner under test", async () => {
    const r = await callFn("adminListReferrals", adminToken);
    expect(r.status).toBe(200);
    const rows = parseRows(r.body);
    const arr = Array.isArray(rows) ? rows : [];
    expect(arr.length).toBeGreaterThan(0);
    expect(arr.some((x: any) => x.partner_id === PARTNER_ID)).toBe(true);
  });
});
