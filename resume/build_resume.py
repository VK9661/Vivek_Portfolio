"""Build a one-page A4 resume PDF from a JSON file.

Usage: python build_resume.py Vivek_Kumar_General_Resume.json
Requires: pip install weasyprint pypdf
"""
import base64
import json
import sys
from html import escape
from pathlib import Path

from weasyprint import HTML

HERE = Path(__file__).resolve().parent


def font_faces():
    css = []
    for w in (400, 500, 600, 700):
        data = (HERE / "fonts" / f"inter-latin-{w}-normal.woff2").read_bytes()
        b64 = base64.b64encode(data).decode()
        css.append(
            f"@font-face{{font-family:Inter;font-weight:{w};font-style:normal;"
            f"src:url(data:font/woff2;base64,{b64}) format('woff2');}}"
        )
    return "\n".join(css)


CSS = """
@page { size: A4; margin: 15mm; }
* { box-sizing: border-box; }
body { font-family: Inter, sans-serif; font-size: 8.3pt; line-height: 1.46; color: #1a1a1a; margin: 0; }
a { color: inherit; text-decoration: none; }
h1 { font-size: 20pt; font-weight: 700; margin: 0; line-height: 1.15; letter-spacing: -0.2pt; }
.title { font-size: 10pt; font-weight: 500; color: #444; margin: 1pt 0 5pt; }
.contact { display: table; }
.contact span, .contact a.btn { display: table-cell; vertical-align: middle; }
.contact .txt { padding-right: 8pt; color: #333; }
.sep { color: #aaa; padding-right: 8pt; }
.btn { font-size: 7.4pt; font-weight: 600; color: #fff; padding: 2.5pt 7pt; border-radius: 3pt; }
.btn-gap { width: 4pt; }
.port { background: #111; }
.be { background: #1769ff; }
.in { background: #0a66c2; }
h2 { font-size: 7pt; font-weight: 600; text-transform: uppercase; letter-spacing: 1.4pt; color: #222;
     border-bottom: 0.6pt solid #bbb; padding-bottom: 1.5pt; margin: 9pt 0 4pt; }
p { margin: 0; }
table.row { width: 100%; border-collapse: collapse; }
table.row td { padding: 0; vertical-align: baseline; }
table.row td.date { text-align: right; white-space: nowrap; color: #555; font-weight: 500; }
.org { font-weight: 600; }
.sub { color: #555; }
ul { list-style-type: disc; padding-left: 11pt; margin: 1.5pt 0 0; }
li { margin: 0 0 0.6pt; }
.proj { margin-top: 3.5pt; }
.proj:first-of-type { margin-top: 0; }
.ptag { color: #666; font-weight: 400; }
.sk { margin-bottom: 1pt; }
.sk b { font-weight: 600; }
.edu { margin-bottom: 1.5pt; }
/* Minimal Accent theme */
h1 { font-weight: 600; letter-spacing: -0.6pt; font-size: 22pt; }
.title { color: #2b59ff; font-weight: 600; }
h2 { color: #2b59ff; border-bottom: none; letter-spacing: 1.6pt; margin-top: 10pt; }
table.row td.date { color: #2b59ff; }
.btn { border-radius: 10pt; }
.footer { position: fixed; bottom: -9mm; right: 0; font-size: 6.6pt; color: #999; text-align: right; }
"""


def bullets(items):
    return "<ul>" + "".join(f"<li>{escape(b)}</li>" for b in items) + "</ul>"


def build(data):
    L = data["links"]
    head = f"""
<h1>{escape(data['name'])}</h1>
<div class="title">{escape(data['title'])}</div>
<div class="contact">
  <span class="txt">{escape(data['phone'])}</span><span class="sep">|</span>
  <span class="txt"><a href="mailto:{data['email']}">{escape(data['email'])}</a></span><span class="sep">|</span>
  <a class="btn port" href="{L['portfolio']}">Portfolio</a><span class="btn-gap"></span>
  <a class="btn be" href="{L['behance']}">Be</a><span class="btn-gap"></span>
  <a class="btn in" href="{L['linkedin']}">in</a>
</div>"""

    exp = "".join(
        f"""<table class="row"><tr><td><span class="org">{escape(e['company'])}</span>
<span class="sub">· {escape(e['role'])}</span></td><td class="date">{escape(e['dates'])}</td></tr>
<tr><td class="sub" colspan="2">{escape(e['location'])}</td></tr></table>{bullets(e['bullets'])}"""
        for e in data["experience"]
    )

    projects = "".join(
        f"""<div class="proj"><span class="org">{escape(p['name'])}</span>
<span class="ptag">· {escape(p['tag'])}</span>{bullets(p['bullets'])}</div>"""
        for p in data["projects"]
    )

    skills = "".join(
        f'<div class="sk"><b>{escape(g)}:</b> {escape(items)}</div>' for g, items in data["skills"]
    )
    tools = " · ".join(escape(t) for t in data["tools"])

    edu = "".join(
        f"""<table class="row edu"><tr><td><span class="org">{escape(e['school'])}</span>
<span class="sub">· {escape(e['detail'])}, {escape(e['place'])}</span></td>
<td class="date">{escape(e['dates'])}</td></tr></table>"""
        for e in data["education"]
    )

    footer = f'<div class="footer">{escape(L["portfolio"])} | {escape(L["behance"])}</div>'

    return f"""<!doctype html><html><head><meta charset="utf-8">
<title>{escape(data['name'])} – Resume</title>
<style>{font_faces()}{CSS}</style></head><body>
{footer}{head}
<h2>Profile</h2><p>{escape(data['profile'])}</p>
<h2>Work Experience</h2>{exp}
<h2>Projects</h2>{projects}
<h2>Skills</h2>{skills}
<h2>Tools</h2><p>{tools}</p>
<h2>Education</h2>{edu}
</body></html>"""


def main():
    src = Path(sys.argv[1]).resolve()
    data = json.loads(src.read_text(encoding="utf-8"))
    out = src.parent / data["output"]
    HTML(string=build(data)).write_pdf(out)
    print(out)


if __name__ == "__main__":
    main()
