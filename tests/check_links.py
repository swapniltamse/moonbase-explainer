"""Check every external link on the site (HTML pages and the data files that
render links) still resolves. Retries once to ride out transient failures."""
import re, sys, time, urllib.request, urllib.error
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parent.parent
FILES = [p for p in ROOT.rglob('*') if p.suffix in ('.html', '.js') and 'node_modules' not in p.parts
         and p.name != 'three.min.js' and 'tests' not in p.parts]
SKIP = ('https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://cdn.vercel-insights.com', 'http://www.w3.org')
URL = re.compile(r'https?://[^\s"\'<>`)\\]+')

def urls():
    found = {}
    for f in FILES:
        for u in URL.findall(f.read_text(encoding='utf-8', errors='ignore')):
            u = u.rstrip('.,;:')
            if not u.startswith(SKIP) and '${' not in u: found.setdefault(u, f.relative_to(ROOT).as_posix())
    return found

def check(u):
    for attempt in range(2):
        try:
            req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (moonbase-explainer link check)'})
            with urllib.request.urlopen(req, timeout=40) as r:
                return u, r.status, None
        except urllib.error.HTTPError as e:
            if e.code in (403, 405, 429) and attempt == 0: time.sleep(3); continue
            return u, e.code, str(e.reason)
        except Exception as e:
            if attempt == 0: time.sleep(3); continue
            return u, None, str(e)
    return u, None, 'unreachable'

if __name__ == '__main__':
    found = urls()
    with ThreadPoolExecutor(8) as ex: results = list(ex.map(check, found))
    bad = [(u, s, e) for u, s, e in results if s is None or s >= 400]
    for u, s, e in bad: print(f'BROKEN {s or "-"} {u}  (in {found[u]}; {e})')
    print(f'{len(found) - len(bad)}/{len(found)} external links OK')
    sys.exit(1 if bad else 0)
