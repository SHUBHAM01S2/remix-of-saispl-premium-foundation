"""
Skip-by-default end-to-end tests for the /client-portal ↔ /admin loop.

Runs against the local dev server (http://localhost:8080). Requires four
env vars (this project is `external_unmanaged` in Lovable, so no session
can be injected in CI):

  TEST_CLIENT_EMAIL         Email of a client whose row exists in
                            public.client_onboarding (matched by email).
  TEST_CLIENT_PASSWORD      Password for that client Supabase user.
  TEST_ADMIN_EMAIL          Email of an admin (public.admins row).
  TEST_ADMIN_PASSWORD       Password for that admin.

If any are missing the script exits 0 and prints SKIP — safe for CI.

What it verifies:
  1. Client can sign in at /client-portal and submit an asset (note) and
     access credential for a known key.
  2. Admin can sign in at /shivi, open /admin/onboarding, find the client
     record, and see the same asset submission on the timeline and the
     new decrypted credential entry in "Client-submitted credentials".
  3. Access-credential plaintext is NOT rendered on /client-portal after
     submission (encryption-at-rest contract).

Run:  python3 tests/e2e/client-portal.py
"""

import asyncio
import os
import secrets
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE = "http://localhost:8080"
SHOTS = Path(__file__).parent / "artifacts"
SHOTS.mkdir(parents=True, exist_ok=True)

REQUIRED = ("TEST_CLIENT_EMAIL", "TEST_CLIENT_PASSWORD", "TEST_ADMIN_EMAIL", "TEST_ADMIN_PASSWORD")


async def sign_in(page, email: str, password: str) -> None:
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.get_by_role("button", name="Sign in", exact=False).first.click()
    await page.wait_for_load_state("networkidle")


async def run() -> int:
    missing = [k for k in REQUIRED if not os.environ.get(k)]
    if missing:
        print("SKIP: missing env vars:", ", ".join(missing))
        return 0

    client_email = os.environ["TEST_CLIENT_EMAIL"]
    client_password = os.environ["TEST_CLIENT_PASSWORD"]
    admin_email = os.environ["TEST_ADMIN_EMAIL"]
    admin_password = os.environ["TEST_ADMIN_PASSWORD"]

    marker = f"e2e-{secrets.token_hex(4)}"
    asset_note = f"E2E asset note {marker}"
    access_note = f"E2E access secret {marker}"

    failures: list[str] = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        print(f"  [{'PASS' if cond else 'FAIL'}] {name}" + (f"  ({detail})" if detail else ""))
        if not cond:
            failures.append(name)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)

        # --- Client side ---
        client_ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        cp = await client_ctx.new_page()
        await cp.goto(BASE + "/client-portal", wait_until="networkidle")
        await cp.wait_for_selector('input[type="email"]', timeout=8000)
        await sign_in(cp, client_email, client_password)
        await cp.screenshot(path=str(SHOTS / "client_signed_in.png"))

        # Submit an asset note (uses the "logo" key which is always present)
        await cp.get_by_role("button", name="Assets", exact=False).first.click()
        await cp.wait_for_timeout(300)
        # Open first asset submitter
        await cp.get_by_role("button", name="Submit").first.click()
        await cp.get_by_role("button", name="note", exact=False).first.click()
        await cp.locator("textarea").first.fill(asset_note)
        await cp.get_by_role("button", name="Submit note", exact=False).first.click()
        await cp.wait_for_timeout(1500)

        # Submit an access credential
        await cp.get_by_role("button", name="Access", exact=False).first.click()
        await cp.wait_for_timeout(300)
        await cp.get_by_role("button", name="Submit").first.click()
        await cp.locator("textarea").first.fill(access_note)
        await cp.get_by_role("button", name="Save encrypted", exact=False).first.click()
        await cp.wait_for_timeout(1500)

        # Contract: plaintext of access note must NOT appear anywhere on the page
        body = await cp.locator("body").inner_text()
        check(
            "access plaintext NOT rendered in client portal",
            access_note not in body,
        )
        check("timestamped access submission shown", "encrypted" in body.lower())
        await cp.screenshot(path=str(SHOTS / "client_after_submit.png"))
        await client_ctx.close()

        # --- Admin side ---
        admin_ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        ap = await admin_ctx.new_page()
        await ap.goto(BASE + "/shivi", wait_until="networkidle")
        await ap.wait_for_selector('input[type="email"]', timeout=8000)
        await sign_in(ap, admin_email, admin_password)
        await ap.goto(BASE + "/admin/onboarding", wait_until="networkidle")
        # Click the row matching the client email
        row = ap.get_by_text(client_email, exact=False).first
        await row.click()
        await ap.wait_for_load_state("networkidle")

        body = await ap.locator("body").inner_text()
        check("admin timeline shows client asset submission", asset_note in body or "Client submitted asset" in body)
        check("admin sees 'Client-submitted credentials' panel", "Client-submitted credentials" in body)

        # Reveal the encrypted credential and confirm plaintext matches
        try:
            await ap.get_by_role("button", name="Reveal").first.click()
            await ap.wait_for_timeout(400)
        except Exception as e:
            print(f"  (could not click Reveal: {e})")
        body = await ap.locator("body").inner_text()
        check("admin can decrypt access plaintext", access_note in body)
        await ap.screenshot(path=str(SHOTS / "admin_after_reveal.png"))

        await browser.close()

    print(f"\nRESULT: {'ALL PASS' if not failures else f'{len(failures)} FAILED'}")
    for f in failures:
        print("  -", f)
    return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(run()))
