"""Check that every quoted fact the site relies on still appears, verbatim, on
the PDF page it is cited to.

  python tests/verify_quotes.py            download each source PDF and verify
  python tests/verify_quotes.py --build    rebuild tests/quotes.json from local
                                           PDFs given in LOCAL (maintainer only)

Text is compared after collapsing whitespace and unfolding ligatures, because
PDF text extraction is not byte-stable across documents.
"""
import json, re, sys, io, urllib.request
from pathlib import Path
from pypdf import PdfReader

HERE = Path(__file__).parent
QUOTES = HERE / 'quotes.json'

DOCS = {
    'T':   'https://www.nasa.gov/wp-content/uploads/2026/08/scan-cislunar-industry-demand-signal.pdf',
    'UG':  'https://www.nasa.gov/wp-content/uploads/2026/04/moon-base-architecture-users-guide.pdf',
    'LN':  'https://www.nasa.gov/wp-content/uploads/2025/02/lunanet-interoperability-specification-v5-baseline.pdf',
    'AFS': 'https://www.nasa.gov/wp-content/uploads/2025/02/lunanet-signal-in-space-recommended-standard-augmented-forward-signal-vol-a.pdf',
    'SRD': 'https://www.nasa.gov/wp-content/uploads/2025/08/lunar-relay-services-requirements-document-srd.pdf',
    'ADD': 'https://www.nasa.gov/wp-content/uploads/2025/12/add-revision-c-20251211.pdf',
    'FS':  'https://www.nasa.gov/wp-content/uploads/2026/03/building-the-moon-base-1.pdf',
}

# What the site quotes or cites, per source. Pages are filled in by --build.
CLAIMS = {
    'T': ['Phase 1 (Now-2028)', '1250+ Mbps (Goal)', '3100 GB/day', '50 cm (Threshold)', 'Time to First Fix',
          'LTC Trace to UTC', 'Lunar South Pole Region: Latitude', 'Wi-Fi, 3GPP'],
    'UG': ['25 LAUNCHES', '21 LANDINGS', 'enable > 500Mbps', 'HQ-MoonBase@nasa.gov', 'survival through 120+ hours of darkness'],
    'LN': ['network of cooperating networks', 'LunaNet 1.0, will include', 'appears as a single provider',
           'explicitly deals with long delays', 'IPv6', 'Bundle Protocol version 7', 'restricts use of S-band to lunar proximity',
           '15.625', 'optical link interfaces are TBD', 'IP over Wi-Fi', '22.55-23.15'],
    'AFS': ['2492.028 MHz', 'Similar to the GPS C/A code', 'Clock and ephemeris', '40 {LSIS-TBC-2001}', '5.115'],
    'SRD': ['a few relays in lunar orbit', 'below - 80 degrees', 'full global coverage', '5 seconds end-to-end',
            'Earth Independent Services', 'DTN BPv7 with custody', 'FIPS 140-3 certified', 'no decryption of user data',
            'LCRNS.3.0730', 'within 5 minutes', '50 meters [TBR]'],
    'ADD': ['80° S to the South Pole', '75° S and up to 200 km', 'called Moonlight', '3GPP/5G', 'FN-C-205',
            '25 to 50 Mbps within 10 km', '40% of 24 hours', 'within 10m, 3 sigma', 'LROC NAC is ~.5 m/pixel',
            'Sustained, site-specific sub-meter'],
    'FS': ['38 tons of cargo per year', 'including 21 landings', 'up to 60 tons of cargo'],
}

def norm(s):
    s = s.replace('ﬁ', 'fi').replace('ﬂ', 'fl').replace('’', "'")
    return re.sub(r'\s+', ' ', s)

def pages_of(pdf_bytes):
    return [norm(p.extract_text() or '') for p in PdfReader(io.BytesIO(pdf_bytes)).pages]

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'moonbase-explainer source check (github.com/swapniltamse/moonbase-explainer)'})
    return urllib.request.urlopen(req, timeout=180).read()

def build(local):
    out = []
    for tag, claims in CLAIMS.items():
        pages = pages_of(Path(local[tag]).read_bytes())
        for c in claims:
            hits = [i + 1 for i, t in enumerate(pages) if norm(c) in t]
            if not hits:
                print(f'NOT FOUND, skipped: {tag} {c!r}'); continue
            out.append({'doc': tag, 'text': c, 'pages': hits})
    QUOTES.write_text(json.dumps({'docs': DOCS, 'quotes': out}, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'wrote {len(out)} quotes to {QUOTES}')

def verify():
    data = json.loads(QUOTES.read_text(encoding='utf-8'))
    failures, cache = [], {}
    for q in data['quotes']:
        tag = q['doc']
        if tag not in cache:
            try: cache[tag] = pages_of(fetch(data['docs'][tag]))
            except Exception as e:
                cache[tag] = None; failures.append(f'{tag}: could not download or read {data["docs"][tag]} ({e})')
        pages = cache[tag]
        if pages is None: continue
        missing = [p for p in q['pages'] if p > len(pages) or norm(q['text']) not in pages[p - 1]]
        if missing: failures.append(f'{tag} p{missing}: {q["text"]!r} is no longer on the cited page')
    n = len(data['quotes'])
    if failures:
        print(f'{len(failures)} problem(s) across {n} quotes:'); [print(' -', f) for f in failures]; sys.exit(1)
    print(f'all {n} quotes found on their cited pages')

if __name__ == '__main__':
    if '--build' in sys.argv:
        sp = sys.argv[sys.argv.index('--build') + 1]
        build({k: str(Path(sp) / v) for k, v in {'T': 'scan.pdf', 'UG': 'moonbase-guide.pdf', 'LN': 'refs/lunanet_v5.pdf',
               'AFS': 'refs/afs.pdf', 'SRD': 'refs/srd.pdf', 'ADD': 'refs/add.pdf', 'FS': 'refs/factsheet.pdf'}.items()})
    else:
        verify()
