"""Builds the link previews (the image and text shown when a link is shared on WhatsApp,
LinkedIn, X and similar apps). Those apps read the og: tags in a page's <head> and do not
run JavaScript, so every project needs its own static page.

It writes:
  assets/img/share/portfolio.jpg   preview of the portfolio link, from tools/og-portfolio.html
  assets/img/share/<id>.jpg        preview of each project, from tools/og-project.html
  project-<id>.html                project.html with that project's title, summary and image
                                   in the share tags, and the page body (nav, case study, footer)
                                   already written in, so it reads without JavaScript; the scripts
                                   still rebuild the same markup when the page loads

Run it from the repo root after adding a project or editing project.html:
  python tools/build-share.py
"""
import html, io, json, os, pathlib, re, subprocess, tempfile
from html.parser import HTMLParser

from PIL import Image

TOOLS = pathlib.Path(__file__).resolve().parent
ROOT = TOOLS.parent
SHARE = ROOT / 'assets/img/share'
URL = 'https://vivek-portfolio-beta-eight.vercel.app/'
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'


def render(template, out, query=''):
    """Screenshot a 1200 x 630 template with headless Chrome and save it as a JPG."""
    with tempfile.TemporaryDirectory() as tmp:
        png = os.path.join(tmp, 'shot.png')
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
                        '--virtual-time-budget=8000', '--window-size=1200,630', '--user-data-dir=' + os.path.join(tmp, 'profile'),
                        '--screenshot=' + png, (TOOLS / template).as_uri() + query], check=True, capture_output=True)
        Image.open(png).convert('RGB').save(out, quality=86, optimize=True, progressive=True)


def set_meta(page, attr, key, value):
    """Set the content of <meta attr="key">, adding the tag before twitter:card if it is missing."""
    v = html.escape(value, quote=True)
    pat = re.compile(r'(<meta %s="%s" content=")[^"]*(">)' % (attr, re.escape(key)))
    if pat.search(page):
        return pat.sub(lambda m: m.group(1) + v + m.group(2), page, count=1)
    return page.replace('<meta name="twitter:card"', '<meta %s="%s" content="%s">\n<meta name="twitter:card"' % (attr, key, v), 1)


def inner(page, attr, value=None):
    """Return (start, end) of the inner HTML of the first element carrying attr (= value)."""
    lines = [0] + [m.end() for m in re.finditer('\n', page)]  # the parser counts lines by \n only

    class Find(HTMLParser):
        span, tag, depth, start = None, None, 0, None

        def handle_starttag(self, t, attrs):
            if self.span:
                return
            if self.tag is None and any(k == attr and (value is None or v == value) for k, v in attrs):
                l, c = self.getpos()
                self.tag, self.depth, self.start = t, 1, lines[l - 1] + c + len(self.get_starttag_text())
            elif t == self.tag:
                self.depth += 1

        def handle_endtag(self, t):
            if self.span is None and t == self.tag:
                self.depth -= 1
                if not self.depth:
                    l, c = self.getpos()
                    self.span = (self.start, lines[l - 1] + c)

    f = Find(convert_charrefs=False)
    f.feed(page)
    return f.span


def prerender(path):
    """Open the generated page in headless Chrome and write the markup the scripts build back into it.
    Reveal states are left out, so the page still fades in exactly as before."""
    with tempfile.TemporaryDirectory() as tmp:
        dom = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--virtual-time-budget=5000',
                              '--user-data-dir=' + os.path.join(tmp, 'profile'), '--dump-dom', path.as_uri()],
                             check=True, capture_output=True).stdout.decode('utf-8')
    page = io.open(path, encoding='utf-8').read()
    for attr, value in [('data-site-foot', None), ('data-site-cta', None), ('id', 'project'), ('data-site-nav', None)]:
        got, slot = inner(dom, attr, value), inner(page, attr, value)
        if not got or not slot or got[0] == got[1]:
            raise SystemExit('prerender: nothing rendered into %s in %s' % (value or attr, path.name))
        body = re.sub(r'\s(?:is-in|is-mini)(?=[\s"])', '', dom[got[0]:got[1]])
        page = page[:slot[0]] + body + page[slot[1]:]  # bottom-up, so earlier offsets stay valid
    io.open(path, 'w', encoding='utf-8', newline='\n').write(page)


SHARE.mkdir(parents=True, exist_ok=True)
render('og-portfolio.html', SHARE / 'portfolio.jpg')
print('portfolio', os.path.getsize(SHARE / 'portfolio.jpg') // 1024, 'KB')

js = "global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.PROJECTS))"
projects = json.loads(subprocess.check_output(['node', '-e', js, str(ROOT / 'assets/js/data.js')]))
template = io.open(ROOT / 'project.html', encoding='utf-8').read()

for p in projects:
    pid = p['id']
    render('og-project.html', SHARE / (pid + '.jpg'), '?id=' + pid)

    title = '%s: %s | Vivek Kumar' % (p['title'], p['kind'])
    url = URL + 'project-%s.html' % pid
    image = URL + 'assets/img/share/%s.jpg' % pid
    s = re.sub(r'<title>[^<]*</title>', '<title>%s</title>' % html.escape(title, quote=False), template, count=1)
    for attr, key, value in [
        ('name', 'description', p['summary']),
        ('property', 'og:type', 'article'),
        ('property', 'og:title', title),
        ('property', 'og:description', p['summary']),
        ('property', 'og:url', url),
        ('property', 'og:image', image),
        ('property', 'og:image:secure_url', image),
        ('property', 'og:image:type', 'image/jpeg'),
        ('property', 'og:image:alt', '%s: %s by Vivek Kumar' % (p['title'], p['kind'])),
        ('name', 'twitter:title', title),
        ('name', 'twitter:description', p['summary']),
        ('name', 'twitter:image', image),
    ]:
        s = set_meta(s, attr, key, value)
    if '<link rel="canonical"' not in s:
        s = s.replace('<meta property="og:type"', '<link rel="canonical" href="%s">\n<meta property="og:type"' % url, 1)
    s = s.replace('<body data-page="project">', '<body data-page="project" data-project="%s">' % pid, 1)
    s = s.replace('<!doctype html>\n', '<!doctype html>\n<!-- Generated by tools/build-share.py from project.html. Edit project.html, then rerun the script. -->\n', 1)
    io.open(ROOT / ('project-%s.html' % pid), 'w', encoding='utf-8', newline='\n').write(s)
    prerender(ROOT / ('project-%s.html' % pid))
    print(pid, os.path.getsize(SHARE / (pid + '.jpg')) // 1024, 'KB')
