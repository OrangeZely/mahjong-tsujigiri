// ストア用スクリーンショットの撮影＋見出し合成。
// 使い方: node store-assets/shoot-store.mjs [en|ja]
// Chromeをheadlessで起動してCDPで操作し、各ストアの規定サイズで書き出す。
// 公開中のサイトを撮るので、撮る前にデプロイを済ませておくこと。
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const LOCALE = process.argv[2] === 'ja' ? 'ja' : 'en';
const BASE = 'https://tsujigiri.orangezely.com';
const PREFIX = LOCALE === 'ja' ? '' : '/en';
const OUT = path.join(import.meta.dirname, LOCALE === 'ja' ? '' : 'en');
const RAW = fs.mkdtempSync(path.join(os.tmpdir(), 'tsujigiri-shots-'));
const PORT = 9223;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// 各ストアが要求する最終ピクセルサイズと、それを作るための端末エミュレーション。
// frame: 'plain' はアプリ画面をそのまま出す。既存の日本語App Storeスクショに合わせている。
// frame: 'caption' は見出しを乗せた背景に画面をはめ込む。Play Store側の既存スタイル。
const TARGETS = [
  { name: 'appstore-6.9',  out: [1320, 2868], css: [440, 956],   scale: 3, frame: 'plain' },
  { name: 'appstore-6.5',  out: [1284, 2778], css: [428, 926],   scale: 3, frame: 'plain' },
  { name: 'appstore-ipad13', out: [2064, 2752], css: [1032, 1376], scale: 2, frame: 'plain' },
  { name: 'playstore',     out: [1170, 2532], css: [390, 844],   scale: 3, frame: 'caption' },
];

// 撮る画面と、その上に乗せる見出し。
const SCREENS = {
  en: [
    { key: '1-home', path: '/', caption: 'Three ways to train', sub: 'Full flush, discards, and fu' },
    { key: '2-game', path: '/game/?mode=casual', caption: 'How many in 60 seconds?', sub: 'Tile efficiency you learn by playing', start: true },
    { key: '3-ranking', path: '/ranking/', caption: 'Climb the ranks', sub: 'Compare scores with other players' },
  ],
  ja: [
    { key: '1-home', path: '/', caption: '3つの特訓', sub: '清一色・何切る・符計算' },
    { key: '2-game', path: '/game/?mode=casual', caption: '60秒で何問斬れる', sub: '牌効率が自然と身につく', start: true },
    { key: '3-ranking', path: '/ranking/', caption: '全国の剣客と競う', sub: 'スコアと段位で腕試し' },
  ],
};

const FONT = LOCALE === 'ja'
  ? "'Hiragino Kaku Gothic ProN',sans-serif"
  : "'Helvetica Neue',Helvetica,Arial,sans-serif";

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const j = await (await fetch(`http://localhost:${PORT}/json/version`)).json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('Chrome CDP not reachable');
}

function makeClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const ready = new Promise(res => ws.addEventListener('open', () => res()));
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });
  const send = (method, params = {}, sessionId) => {
    const mid = ++id;
    return new Promise((resolve, reject) => {
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
    });
  };
  return { ws, ready, send };
}

async function shoot(client, target, screen) {
  const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await client.send('Target.attachToTarget', { targetId, flatten: true });
  const S = (m, p) => client.send(m, p, sessionId);
  await S('Page.enable');
  await S('Runtime.enable');
  const [width, height] = target.css;
  await S('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: target.scale, mobile: target.scale === 3,
  });
  await S('Page.navigate', { url: BASE + PREFIX + screen.path });
  await sleep(3000);

  const evalJs = async (expression) => (await S('Runtime.evaluate', { expression, returnByValue: true })).result.value;

  if (screen.start) {
    // 開始ボタンを押して盤面が出るまで待つ。文言はロケールで変わるのでaria/文字列に依存しない。
    await evalJs(`(()=>{const b=[...document.querySelectorAll('button')].filter(e=>e.offsetParent);const t=b.find(e=>/⚔️|斬/.test(e.textContent));if(t)t.click();return !!t;})()`);
    for (let i = 0; i < 40; i++) {
      if (await evalJs(`document.querySelectorAll('img[src*="/tiles/"], [class*="tile"]').length > 5`)) break;
      await sleep(300);
    }
    await sleep(2500);
  }

  const { data } = await S('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const raw = path.join(RAW, `${target.name}-${screen.key}.png`);
  fs.writeFileSync(raw, Buffer.from(data, 'base64'));
  await client.send('Target.closeTarget', { targetId });
  return raw;
}

function compose(raw, target, screen) {
  const [W, H] = target.out;
  if (target.frame === 'plain') {
    const dest = path.join(OUT, `${target.name}-${screen.key}.png`);
    fs.copyFileSync(raw, dest);
    return Promise.resolve(dest);
  }
  const shotW = Math.round(W * 0.86);
  const shotH = Math.round(shotW * target.out[1] / target.out[0]);
  const x = Math.round((W - shotW) / 2);
  const y = Math.round(H * 0.118);
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#0f4d31"/><stop offset="55%" stop-color="#08301e"/><stop offset="100%" stop-color="#061a12"/>
</linearGradient>
<clipPath id="round"><rect x="${x}" y="${y}" width="${shotW}" height="${shotH}" rx="${Math.round(W * 0.037)}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<text x="${W / 2}" y="${Math.round(H * 0.059)}" font-family="${FONT}" font-size="${Math.round(W * 0.065)}" font-weight="bold" fill="#f5c542" text-anchor="middle">${screen.caption}</text>
<text x="${W / 2}" y="${Math.round(H * 0.09)}" font-family="${FONT}" font-size="${Math.round(W * 0.034)}" fill="#dbeadd" text-anchor="middle">${screen.sub}</text>
<rect x="${x}" y="${y}" width="${shotW}" height="${shotH}" rx="${Math.round(W * 0.037)}" fill="none" stroke="#f5c542" stroke-width="3" opacity="0.55"/>
<image x="${x}" y="${y}" width="${shotW}" height="${shotH}" preserveAspectRatio="xMidYMin slice" clip-path="url(#round)" xlink:href="${raw}"/>
</svg>`;
  const tmp = path.join(RAW, 'compose.svg');
  fs.writeFileSync(tmp, svg);
  const dest = path.join(OUT, `${target.name}-${screen.key}.png`);
  const r = spawn('rsvg-convert', ['-w', String(W), '-h', String(H), tmp, '-o', dest]);
  return new Promise((resolve, reject) => {
    r.on('exit', (code) => code === 0 ? resolve(dest) : reject(new Error(`rsvg-convert exited ${code}`)));
  });
}

fs.mkdirSync(OUT, { recursive: true });
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'tsujigiri-chrome-'));
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--hide-scrollbars', '--force-device-scale-factor=1',
], { stdio: 'ignore' });

try {
  const client = makeClient(await getWsUrl());
  await client.ready;
  for (const target of TARGETS) {
    for (const screen of SCREENS[LOCALE]) {
      const raw = await shoot(client, target, screen);
      const dest = await compose(raw, target, screen);
      console.log(`saved ${path.relative(process.cwd(), dest)}`);
    }
  }
  client.ws.close();
} finally {
  chrome.kill();
}
console.log(`done (raw shots in ${RAW})`);
process.exit(0);
