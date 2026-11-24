#!/usr/bin/env python3
"""
QuestVault E2E Smoke & Offline Sandbox Verification.

Verifies:
1. Built `dist/` serves cleanly on iPad (1024px), Mobile (390px), and Desktop (1280px)
   with 0 pageerror, 0 console.error, strictly 1 <h1>, and 0 horizontal overflow.
2. Lazy-loaded views (LogicLab, Market/Packs, Vault, Progress, Parent Corner,
   Math Run early exit, Chinese Listening) load cleanly without errors.
3. Optional single-file HTML (`--single /path/to/single.html`) renders inside a strict
   offline `<iframe sandbox="allow-scripts">` with all external network blocked and 0 pageerror.
"""

import argparse
import http.server
import os
import sys
import threading
import time
from playwright.sync_api import sync_playwright


def make_handler(dist_dir: str):
    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=dist_dir, **kwargs)

        def log_message(self, format, *args):
            pass

    return QuietHandler


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dist", default="dist", help="Path to built Vite dist/ directory")
    parser.add_argument("--single", default="", help="Optional path to SINGLE_FILE=1 index.html")
    args = parser.parse_args()

    dist_dir = os.path.abspath(args.dist)
    if not os.path.isfile(os.path.join(dist_dir, "index.html")):
        print(f"ERROR: {dist_dir}/index.html not found. Run `npm run build` first.")
        return 1

    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), make_handler(dist_dir))
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base_url = f"http://127.0.0.1:{port}/"
    errors: list[str] = []

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=["--disable-dev-shm-usage", "--disable-gpu"],
            )

            viewports = [
                ("ipad", {"width": 1024, "height": 768}),
                ("mobile", {"width": 390, "height": 844}),
                ("desktop", {"width": 1280, "height": 800}),
            ]

            for label, vp in viewports:
                ctx = browser.new_context(viewport=vp)
                page = ctx.new_page()
                page_errs: list[str] = []
                page.on("pageerror", lambda e: page_errs.append(str(e)))
                page.on("console", lambda m: page_errs.append(m.text) if m.type == "error" else None)

                page.goto(base_url, wait_until="networkidle")
                page.wait_for_selector("text=QuestVault", timeout=10000)

                h1_count = page.evaluate("document.querySelectorAll('h1').length")
                if h1_count != 1:
                    errors.append(f"[{label}] Expected 1 <h1>, found {h1_count}")

                form_count = page.evaluate("document.querySelectorAll('form, [type=\"submit\"]').length")
                if form_count != 0:
                    errors.append(f"[{label}] Forbidden <form> or type='submit' detected ({form_count})")

                overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
                if overflow:
                    errors.append(f"[{label}] Horizontal overflow detected")

                if label == "ipad":
                    # TopBar subject dropdown ARIA + Escape
                    page.locator("header button[aria-haspopup='menu']").first.click()
                    page.wait_for_selector("[role='menu']", timeout=5000)
                    page.keyboard.press("Escape")
                    page.wait_for_timeout(120)
                    if page.locator("[role='menu']").count() != 0:
                        errors.append("[ipad] TopBar subject menu did not close on Escape")

                    # Collapsible 7-Day Adventure Map
                    page.get_by_role("button", name="Open Map").click()
                    page.wait_for_selector("svg[aria-label*='Adventure Map']", timeout=5000)
                    page.get_by_role("button", name="Hide Map").click()

                    # Collapsible 5-game Arcade Hall
                    page.get_by_role("button", name="Arcade Games (5)").click()
                    page.wait_for_selector("text=Tower Defense", timeout=5000)

                    # Lazy routes: LogicLab, Packs, Vault, Progress, Parent
                    page.get_by_role("button", name="Logic & Spatial").click()
                    page.locator("h1").filter(has_text="邏輯與空間").or_(page.locator("h1").filter(has_text="Logic")).first.wait_for(timeout=10000)
                    page.get_by_role("button", name="返回首頁").or_(page.get_by_role("button", name="Home")).first.click()
                    page.locator("h1", has_text="Hi, Player!").wait_for(timeout=10000)

                    page.get_by_role("button", name="Packs").first.click()
                    page.wait_for_selector("text=Pack Market", timeout=10000)

                    page.get_by_role("button", name="Vault").first.click()
                    page.wait_for_selector("input[aria-label='Search Vault collectibles']", timeout=10000)

                    # Phase 9B Critter Room 2.0 check
                    page.get_by_role("button", name="盲盒小屋").click()
                    page.wait_for_selector("text=點心 3/3", timeout=10000)
                    page.wait_for_selector("text=今日獎勵 0/25", timeout=10000)
                    page.wait_for_selector("text=小屋擺飾貼紙（16 件）", timeout=10000)

                    page.get_by_role("button", name="Progress").first.click()
                    page.wait_for_selector("text=Vault Backup", timeout=10000)

                    page.get_by_role("button", name="Parent Corner").first.click()
                    page.wait_for_selector("text=Parent", timeout=10000)
                    page.get_by_role("button", name="Quests").first.click()
                    page.locator("h1", has_text="Hi, Player!").wait_for(timeout=10000)

                    # Math early exit
                    page.get_by_role("button", name="Math").first.click()
                    page.wait_for_selector("text=Math Quests", timeout=10000)
                    page.locator("main button", has_text="Play ").first.click()
                    page.get_by_role("button", name="Exit").first.wait_for(timeout=10000)
                    page.get_by_role("button", name="Exit").first.click()
                    page.locator("h1", has_text="Hi, Player!").wait_for(timeout=10000)

                    # Chinese Listening lazy route
                    page.get_by_role("button", name="中文").first.click()
                    page.get_by_role("button", name="聽音辨字").click()
                    page.wait_for_selector("text=聽音辨字特訓", timeout=10000)

                if page_errs:
                    errors.append(f"[{label}] page/console errors: {page_errs}")
                ctx.close()

            # Optional strict offline <iframe sandbox="allow-scripts"> check
            if args.single:
                with open(args.single, "r", encoding="utf-8") as f:
                    single_html = f.read()

                ctx = browser.new_context(viewport={"width": 1024, "height": 768})
                page = ctx.new_page()
                sandbox_page_errs: list[str] = []
                page.on("pageerror", lambda e: sandbox_page_errs.append(str(e)))

                def block_external(route):
                    if route.request.url.startswith(("data:", "about:", "blob:")):
                        route.continue_()
                    else:
                        route.abort()

                page.route("**/*", block_external)
                page.set_content(
                    '<iframe id="qv" sandbox="allow-scripts" style="width:100%;height:100vh;border:0"></iframe>'
                )
                page.eval_on_selector("#qv", "(el, html) => { el.srcdoc = html; }", single_html)

                frame = page.frame_locator("#qv")
                frame.locator("h1", has_text="Hi, Player!").wait_for(timeout=15000)
                frame.get_by_role("button", name="Packs").first.click()
                frame.get_by_text("Pack Market").first.wait_for(timeout=10000)
                time.sleep(0.25)

                if sandbox_page_errs:
                    errors.append(f"[sandbox] pageerrors: {sandbox_page_errs}")
                ctx.close()

            browser.close()
    finally:
        server.shutdown()

    if errors:
        print("E2E SMOKE FAILED:", errors)
        return 1

    print("E2E SMOKE PASSED: multi-viewport lazy routes + offline sandbox 0 pageerror!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
