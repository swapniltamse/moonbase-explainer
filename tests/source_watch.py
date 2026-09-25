"""Watch the NASA web pages the site quotes. Each entry is a phrase the site
depends on; if a page stops saying it, the site may be out of date. Run monthly
by CI, which opens an issue listing what changed."""
import re, sys, html, urllib.request

WATCH = {
    'https://www.nasa.gov/moonbase-phases/': ['Now–2029', '2029-2032', '2032-Beyond', 'Altus-1 is the first satellite'],
    'https://www.nasa.gov/moonbase-systems/': ['five-satellite orbital relay constellation', 'second provider constellation'],
    'https://www.nasa.gov/humans-in-space/artemis/': ['Demonstration mission in low Earth orbit', 'first Artemis lunar landing for 2028'],
}

def text(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (moonbase-explainer source watch)'})
    raw = urllib.request.urlopen(req, timeout=60).read().decode('utf-8', 'ignore')
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', raw)))

if __name__ == '__main__':
    changed = []
    for url, phrases in WATCH.items():
        try: body = text(url)
        except Exception as e: changed.append(f'{url}: could not load ({e})'); continue
        changed += [f'{url}: no longer says "{p}"' for p in phrases if p not in body]
    for c in changed: print('CHANGED', c)
    total = sum(len(v) for v in WATCH.values())
    print(f'{total - len(changed)}/{total} watched phrases still present')
    sys.exit(1 if changed else 0)
