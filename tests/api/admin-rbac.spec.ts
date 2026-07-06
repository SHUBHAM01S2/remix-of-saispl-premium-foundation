/**
 * API-level RBAC tests.
 *
 * Calls admin-only TanStack server functions directly (bypassing the UI) with
 * a client user's bearer token, and asserts the server returns 4xx / an
 * "unauthorized"-style error. Passing means the API guards hold even when a
 * client account is technically signed in and hits the endpoints directly.
 *
 * Env vars:
 *   BASE_URL                     default http://localhost:8080
 *   VITE_SUPABASE_URL            supabase project url (for auth)
 *   VITE_SUPABASE_PUBLISHABLE_KEY
 *   TEST_CLIENT_EMAIL            client account (NOT in `admins`)
 *   TEST_CLIENT_PASSWORD
 *
 * Run: bunx vitest run tests/api/admin-rbac.spec.ts
 * (or import into your existing runner)
 */
import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const BASE = process.env.BASE_URL ?? "http://localhost:8080";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
const EMAIL = process.env.TEST_CLIENT_EMAIL!;
const PASS = process.env.TEST_CLIENT_PASSWORD!;

// Every server function that a client user MUST NOT be able to call.
// (`_serverFn=` names come from src/lib/*-admin.functions.ts export names.)
const ADMIN_ONLY_FNS: { name: string; method: "GET" | "POST"; body?: unknown }[] = [
  { name: "getDashboardStats", method: "GET" },
  { name: "getRecentActivity", method: "GET" },
  { name: "listAdmins", method: "GET" },
  { name: "listAdminRoleAudit", method: "GET" },
  { name: "updateAdminRole", method: "POST", body: { id: "00000000-0000-0000-0000-000000000000", role: "editor" } },
  { name: "deleteAdmin", method: "POST", body: { id: "00000000-0000-0000-0000-000000000000" } },
  { name: "addAdminByUserId", method: "POST", body: { userId: "00000000-0000-0000-0000-000000000000", email: "x@x.com", role: "editor" } },
  { name: "adminListReferrals", method: "GET" },
];

let bearer = "";

beforeAll(async () => {
  for (const [k, v] of Object.entries({ SUPABASE_URL, SUPABASE_KEY, EMAIL, PASS })) {
    if (!v) throw new Error(`Missing env: ${k}`);
  }
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });
  const { data, error } = await sb.auth.signInWithPassword({ email: EMAIL, password: PASS });
  if (error || !data.session) throw new Error("client sign-in failed: " + error?.message);
  bearer = data.session.access_token;
});

async function callServerFn(name: string, method: "GET" | "POST", body?: unknown) {
  const url = `${BASE}/_serverFn/${name}`;
  const init: RequestInit = {
    method,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${bearer}`,
    },
  };
  if (method === "POST") init.body = JSON.stringify({ data: body ?? {} });
  return fetch(url, init);
}

describe("RBAC — admin server functions reject client callers", () => {
  for (const fn of ADMIN_ONLY_FNS) {
    it(`${fn.method} ${fn.name} → forbidden for client`, async () => {
      const res = await callServerFn(fn.name, fn.method, fn.body);
      const text = await res.text();
      // Accept any non-2xx OR a 200 that surfaces "Forbidden"/"unauthorized"
      // (server fns often serialize thrown Errors as JSON with status 500).
      const ok200Denied =
        res.status === 200 &&
        /forbidden|unauthorized|not.*admin|permission/i.test(text);
      expect(
        res.status >= 400 || ok200Denied,
        `Expected denial, got ${res.status}: ${text.slice(0, 200)}`,
      ).toBe(true);
      // Never leak admin data (email lists, role rows, dashboard counts).
      expect(text).not.toMatch(/"role"\s*:\s*"super_admin"/);
    });
  }
});
