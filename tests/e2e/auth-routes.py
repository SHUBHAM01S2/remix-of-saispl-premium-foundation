"""
End-to-end auth-routing smoke tests.

Runs against the local dev server (http://localhost:8080) with headless
Chromium via Playwright. It enforces the invariants the product owner has
locked in:

  1. Public Navbar "Sign In" → /client-portal (never /shivi).
  2. Mobile menu "Sign In" → /client-portal.
  3. No public route (/, /about, /services, /pricing, /contact) references
     /shivi anywhere in the rendered HTML or link hrefs.
  4. /admin (unauthenticated) does NOT reveal the admin dashboard —
     the shell is not rendered.
  5. /shivi renders the admin sign-in card.
  6. /client-portal renders the client sign-in card.

Authenticated flows (client sign-in landing at /client-portal, admin
sign-in landing at /admin, and each role being blocked from the other
surface) are NOT covered here because this Supabase project is
"external_unmanaged" from Lovable's perspective and no test session can
be minted in CI. Those flows are enforced by:

  - src/routes/_authenticated/route.tsx    (session gate)
  - src/routes/_authenticated/admin.tsx    (isAdminRole → WrongRoleNotice)
  - src/routes/client-portal.tsx           (admin signed-in → sign out + notice)
  - src/routes/shivi.tsx                   (client signed-in → WrongRoleNotice)

Run:  python3 tests/e2e/auth-routes.py
"""

import asyncio
import json
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE = "http://localhost:8080"
SHOTS = Path(__file__).parent / "artifacts"
SHOTS.mkdir(parents=True, exist_ok=True)

PUBLIC_ROUTES = ["/", "/about", "/services", "/pricing", "/contact"]


async def run() -> int:
    failures: list[str] = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        status = "PASS" if cond else "FAIL"
        print(f"  [{status}] {name}" + (f"  ({detail})" if detail else ""))
        if not cond:
            failures.append(name)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()

        print("\n[1] Navbar Sign In target")
        await page.goto(BASE + "/", wait_until="domcontentloaded")
        await page.wait_for_timeout(400)
        signin = page.get_by_role("link", name="Sign In").first
        href = await signin.get_attribute("href")
        check("navbar Sign In href == /client-portal", href == "/client-portal", href or "missing")
        await signin.click()
        await page.wait_for_load_state("domcontentloaded")
        check(
            "navbar Sign In lands on /client-portal",
            page.url.endswith("/client-portal"),
            page.url,
        )

        print("\n[2] Public pages must not link to /shivi")
        for path in PUBLIC_ROUTES:
            await page.goto(BASE + path, wait_until="domcontentloaded")
            await page.wait_for_timeout(200)
            html = await page.content()
            hrefs = await page.eval_on_selector_all(
                "a[href]", "els => els.map(e => e.getAttribute('href'))"
            )
            shivi_hrefs = [h for h in hrefs if h and "shivi" in h]
            check(f"{path} html has no /shivi", "/shivi" not in html)
            check(f"{path} has no anchor to /shivi", not shivi_hrefs, json.dumps(shivi_hrefs))

        print("\n[3] Mobile menu Sign In target")
        mobile = await ctx.new_page()
        await mobile.set_viewport_size({"width": 390, "height": 900})
        await mobile.goto(BASE + "/", wait_until="domcontentloaded")
        await mobile.wait_for_timeout(400)
        try:
            await mobile.locator('button[aria-label*="menu" i]').first.click(timeout=2000)
            await mobile.wait_for_timeout(300)
        except Exception as e:
            print(f"  (could not open mobile menu: {e})")
        m_hrefs = await mobile.eval_on_selector_all(
            "a[href]", "els => els.map(e => e.getAttribute('href'))"
        )
        check("mobile menu contains /client-portal", "/client-portal" in m_hrefs)
        check(
            "mobile menu has no /shivi link",
            not any(h and "shivi" in h for h in m_hrefs),
        )
        await mobile.screenshot(path=str(SHOTS / "mobile_menu.png"))
        await mobile.close()

        print("\n[4] /admin unauthenticated does not expose the dashboard")
        await page.goto(BASE + "/admin", wait_until="domcontentloaded")
        await page.wait_for_timeout(600)
        body = (await page.locator("body").inner_text()).lower()
        check("admin dashboard not rendered", "control panel" not in body)
        check("admin sidebar links not rendered", "client onboarding" not in body)
        await page.screenshot(path=str(SHOTS / "admin_unauth.png"))

        print("\n[5] /shivi renders the private sign-in card")
        await page.goto(BASE + "/shivi", wait_until="networkidle")
        await page.wait_for_selector('input[type="email"]', timeout=5000)
        body = await page.locator("body").inner_text()
        check("shivi renders 'Restricted area'", "Restricted area" in body)
        check("shivi renders an email input", await page.locator('input[type="email"]').count() > 0)
        await page.screenshot(path=str(SHOTS / "shivi.png"))

        print("\n[6] /client-portal renders the client sign-in card")
        await page.goto(BASE + "/client-portal", wait_until="networkidle")
        await page.wait_for_selector('input[type="email"]', timeout=5000)
        check(
            "client portal renders an email input",
            await page.locator('input[type="email"]').count() > 0,
        )
        await page.screenshot(path=str(SHOTS / "client_portal.png"))

        await browser.close()

    print(f"\nRESULT: {'ALL PASS' if not failures else f'{len(failures)} FAILED'}")
    for f in failures:
        print(f"  - {f}")
    return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(run()))
