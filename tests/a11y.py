"""WCAG 2.1 AA audit with axe-core on every page, in both themes, plus a check
that no page scrolls sideways on a phone. Serves the repo locally first."""
import os, sys, threading, functools, http.server, asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
PAGES = ['', 'standards/', 'sources/', 'how-it-works/']
AXE = 'https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js'
TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']

def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    handler = functools.partial(Quiet, directory=str(ROOT))
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f'http://127.0.0.1:{srv.server_address[1]}/'

async def main(base):
    problems = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        for path in PAGES:
            for theme in ('dark', 'light'):
                pg = await b.new_page(viewport={'width': 1280, 'height': 900})
                errors = []
                pg.on('pageerror', lambda e: errors.append(str(e)))
                await pg.goto(f'{base}{path}?theme={theme}', wait_until='networkidle')
                await pg.wait_for_timeout(1200)
                await pg.add_script_tag(url=AXE)
                r = await pg.evaluate("t => axe.run(document, {runOnly: {type: 'tag', values: t}})", TAGS)
                for v in r['violations']:
                    problems += 1
                    print(f'/{path} [{theme}] {v["impact"]} {v["id"]}: {v["help"]} ({len(v["nodes"])} nodes)')
                for e in errors:
                    problems += 1; print(f'/{path} [{theme}] script error: {e}')
                await pg.close()
            m = await b.new_page(viewport={'width': 390, 'height': 844})
            await m.goto(f'{base}{path}', wait_until='networkidle'); await m.wait_for_timeout(800)
            sw = await m.evaluate('document.documentElement.scrollWidth')
            if sw > 390:
                problems += 1; print(f'/{path} scrolls sideways on a 390 px phone ({sw} px wide)')
            await m.close()
        await b.close()
    print(f'{len(PAGES)} pages x 2 themes audited: {problems} problem(s)')
    return problems

if __name__ == '__main__':
    sys.exit(1 if asyncio.run(main(serve())) else 0)
