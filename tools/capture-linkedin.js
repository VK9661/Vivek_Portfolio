// Captures LinkedIn images of the portfolio with headless Chrome over the DevTools protocol.
// Usage (with the local server running: node tools/serve.js):
//   node tools/capture-linkedin.js linkedin-images
// Writes 01-10 desktop shots (2800x1750) and a phone mockup (2800x1800).
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const OUT = path.resolve(process.argv[2] || 'linkedin-images');
const BASE = 'http://localhost:5173/';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vkshot-'));
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--user-data-dir=' + profile,
  '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });

let ws, id = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params }));
});
const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

async function connect() {
  for (let t = 0; t < 50; t++) {
    try {
      const list = await (await fetch('http://127.0.0.1:' + PORT + '/json')).json();
      const page = list.find((p) => p.type === 'page');
      if (page) {
        ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((r) => ws.addEventListener('open', r));
        ws.addEventListener('message', (m) => {
          const d = JSON.parse(m.data);
          if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); d.error ? p.rej(new Error(d.error.message)) : p.res(d.result); }
        });
        return;
      }
    } catch (e) {}
    await sleep(200);
  }
  throw new Error('Chrome did not start');
}

async function viewport(w, h, dpr, mobile) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: !!mobile });
  await send('Emulation.setTouchEmulationEnabled', { enabled: !!mobile });
}
async function go(url) {
  await send('Page.navigate', { url });
  await sleep(1800);
  await evaluate('document.fonts ? document.fonts.ready.then(() => 1) : 1');
  await evaluate("(function(){var s=document.createElement('style');s.textContent='.cur{display:none!important}';document.head.appendChild(s);return 1})()");
}
async function shot(name, clip) {
  const params = { format: 'png', captureBeyondViewport: false };
  if (clip) params.clip = clip;
  const r = await send('Page.captureScreenshot', params);
  fs.writeFileSync(path.join(OUT, name), Buffer.from(r.data, 'base64'));
  console.log('saved', name);
}
// Scroll so the selector sits just under the floating nav, then let reveals finish
async function scrollTo(sel, offset = 110) {
  await evaluate(`(function(){var el=document.querySelector(${JSON.stringify(sel)}); var y=el?el.getBoundingClientRect().top+scrollY-${offset}:0; if(window.__lenis){window.__lenis.scrollTo(y,{immediate:true});} window.scrollTo(0,y); return y;})()`);
  await sleep(2200);
}

(async () => {
  await connect();
  await send('Page.enable'); await send('Runtime.enable');

  // Skip the one-time intro for every capture
  await viewport(1400, 875, 2);
  await go(BASE + 'index.html');
  await evaluate("sessionStorage.setItem('vk-intro','1'); 1");

  // 01 Hero, with the cursor glow + confetti caught mid-motion
  await go(BASE + 'index.html');
  await sleep(2600);
  for (let i = 0; i < 16; i++) {
    const x = 470 + i * 26, y = 640 - i * 14;
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await sleep(40);
  }
  await sleep(120);
  await shot('01_hero.png');

  // 02 Selected work
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: 2 });
  await scrollTo('#work .sec-head', 100);
  await shot('02_selected_work.png');

  // 03 Also in the drawer
  await scrollTo('#drawer-title', 130);
  await shot('03_drawer.png');

  // 04 Project page hero (VOLT 47)
  await go(BASE + 'project.html?id=volt-47');
  await sleep(1500);
  await shot('04_project_volt47.png');

  // 05 Project write-up (ShopUp facts + sections)
  await go(BASE + 'project.html?id=shopup');
  await scrollTo('.facts', 112); await sleep(3000);
  await shot('05_project_writeup.png');

  // 06 Services
  await go(BASE + 'services.html');
  await sleep(800);
  await shot('06_services.png');

  // 07 About
  await go(BASE + 'about.html');
  await sleep(800);
  await shot('07_about.png');

  // 08 Journal reading list
  await go(BASE + 'journal.html');
  await scrollTo('#read-filters', 330);
  await shot('08_journal.png');

  // 09 Contact
  await go(BASE + 'contact.html');
  await sleep(800);
  await shot('09_contact.png');

  // Mobile screens for the phone mockup (390 x 844 @3x)
  await viewport(390, 844, 3, true);
  await go(BASE + 'index.html');
  await sleep(2600);
  await shot('m1_home.png');
  await scrollTo('#work .sec-head', 150);
  await shot('m2_work.png');
  await go(BASE + 'project.html?id=volt-47');
  await sleep(1500);
  await shot('m3_project.png');

  // 10 Phone mockup, composed from the three mobile screens
  await viewport(1400, 900, 2);
  fs.copyFileSync(path.join(__dirname, 'mockup-template.html'), path.join(OUT, '_mockup.html'));
  await send('Page.navigate', { url: 'file:///' + path.join(OUT, '_mockup.html').replace(/\\/g, '/') });
  await sleep(1500);
  await shot('10_mobile_mockup.png');
  ['_mockup.html', 'm1_home.png', 'm2_work.png', 'm3_project.png'].forEach((f) => { try { fs.unlinkSync(path.join(OUT, f)); } catch (e) {} });

  ws.close(); chrome.kill();
  process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
