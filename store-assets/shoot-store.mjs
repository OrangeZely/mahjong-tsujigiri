// ストア用スクリーンショットの撮影＋見出し合成。
// 使い方: node store-assets/shoot-store.mjs [en|ja] [ターゲット名]
// ターゲット名を渡すとそのサイズだけ撮る（例: shipaton）。
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
// 全サイズを「見出し＋アプリ画面」の構成にする。Appleは「実際に使っている様子で主要機能を
// 見せること」を求めるので、各画像が1つの機能を言葉でも伝えるようにする。
const TARGETS = [
  { name: 'appstore-6.9',  out: [1320, 2868], css: [440, 956],   scale: 3 },
  { name: 'appstore-6.5',  out: [1284, 2778], css: [428, 926],   scale: 3 },
  { name: 'appstore-ipad13', out: [2064, 2752], css: [1032, 1376], scale: 2 },
  { name: 'playstore',     out: [1170, 2532], css: [390, 844],   scale: 3 },
];

// 撮る画面と見出し。h は端末の高さに対する割合（内容が短い画面は詰めて空白を減らす）。
// wait は画面に入ってから実行する操作（JS式か "wait:ミリ秒"）。
const START = `(()=>{const b=[...document.querySelectorAll('button')].find(b=>/Begin|斬！/.test(b.textContent));b&&b.click();return !!b})()`;
const SCREENS = {
  en: [
    { key: '1-home', path: '/', h: 1, caption: 'Three ways to train', sub: 'Full flush, discards, and fu',
      wait: [`document.querySelectorAll('button, a').length`, 'scroll-modes'] },
    { key: '2-discard', path: '/game/?mode=casual', h: 0.42, caption: 'Pick the right discard', sub: 'Sharpen tile efficiency in 60 seconds',
      wait: [START, 'wait:2500'] },
    { key: '3-fu', path: '/fu-game/', h: 0.74, caption: 'Master fu calculation', sub: 'Read the hand, choose the fu',
      wait: [START, 'wait:2500'] },
    { key: '4-ranking', path: '/ranking/', h: 1, caption: 'Climb the ranks', sub: 'Compare scores with other players',
      wait: ['wait:2500'] },
  ],
  ja: [
    { key: '1-home', path: '/', h: 1, caption: '3つの特訓', sub: '清一色・何切る・符計算',
      wait: [`document.querySelectorAll('button, a').length`, 'scroll-modes'] },
    { key: '2-discard', path: '/game/?mode=casual', h: 0.42, caption: '最善の一打を選べ', sub: '60秒で牌効率を鍛える',
      wait: [START, 'wait:2500'] },
    { key: '3-fu', path: '/fu-game/', h: 0.74, caption: '符計算をマスター', sub: '手牌を読んで符を答える',
      wait: [START, 'wait:2500'] },
    { key: '4-ranking', path: '/ranking/', h: 1, caption: '段位を駆け上がれ', sub: 'スコアで腕試し',
      wait: ['wait:2500'] },
  ],
};

// Web専用の「アプリを入手」バナー（App Storeへのリンク）はネイティブアプリには存在しない。
// 写り込むと「アプリの実際の画面」ではなくなるので撮影前に取り除く。
const STRIP_WEB_ONLY = `document.querySelectorAll('a[href*="apps.apple.com"]').forEach(e => e.remove())`;
// 3つの遊びかたカードが上から見えるよう、最初のカードの少し上までスクロールする。
const SCROLL_TO_MODES = `(()=>{const c=[...document.querySelectorAll('h2, h3, div')].find(e=>/^(Full Flush|清一色モード)$/.test(e.textContent.trim()));if(!c)return 'no-card';const y=c.getBoundingClientRect().top+window.scrollY;window.scrollTo(0,Math.max(0,y-290));return y})()`;

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
  const viewH = Math.round(height * screen.h);
  await S('Emulation.setDeviceMetricsOverride', {
    width, height: viewH, deviceScaleFactor: target.scale, mobile: target.scale === 3,
  });
  await S('Page.addScriptToEvaluateOnNewDocument', { source: 'try{localStorage.clear();sessionStorage.clear()}catch(e){}' });
  await S('Page.navigate', { url: BASE + PREFIX + screen.path });
  await sleep(3500);

  const evalJs = async (expression) => (await S('Runtime.evaluate', { expression, returnByValue: true })).result.value;

  for (const step of screen.wait) {
    if (step.startsWith('wait:')) await sleep(Number(step.slice(5)));
    else if (step === 'scroll-modes') { await evalJs(STRIP_WEB_ONLY); await evalJs(SCROLL_TO_MODES); await sleep(600); }
    else await evalJs(step);
  }
  await evalJs(STRIP_WEB_ONLY);   // 操作の後に現れる場合に備え、撮る直前にもう一度
  await sleep(300);

  const { data } = await S('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const raw = path.join(RAW, `${target.name}-${screen.key}.png`);
  fs.writeFileSync(raw, Buffer.from(data, 'base64'));
  await client.send('Target.closeTarget', { targetId });
  return raw;
}

function compose(raw, target, screen) {
  const [W, H] = target.out;
  const [cssW, cssH] = target.css;
  const shotW = Math.round(W * 0.86);
  // 生画像は cssW x (cssH*h) なので、その縦横比のまま載せる。
  const shotH = Math.round(shotW * (cssH * screen.h) / cssW);
  const x = Math.round((W - shotW) / 2);
  const top = Math.round(H * 0.118);                         // 見出しの下端
  const free = H - top - Math.round(H * 0.03);               // 画像を置ける縦の余白
  const y = top + Math.max(0, Math.round((free - shotH) / 2)); // 短い画面は縦中央に置く
  const rx = Math.round(W * 0.037);
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#0f4d31"/><stop offset="55%" stop-color="#08301e"/><stop offset="100%" stop-color="#061a12"/>
</linearGradient>
<clipPath id="round"><rect x="${x}" y="${y}" width="${shotW}" height="${shotH}" rx="${rx}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<text x="${W / 2}" y="${Math.round(H * 0.059)}" font-family="${FONT}" font-size="${Math.round(W * 0.065)}" font-weight="bold" fill="#f5c542" text-anchor="middle">${screen.caption}</text>
<text x="${W / 2}" y="${Math.round(H * 0.09)}" font-family="${FONT}" font-size="${Math.round(W * 0.034)}" fill="#dbeadd" text-anchor="middle">${screen.sub}</text>
<rect x="${x}" y="${y}" width="${shotW}" height="${shotH}" rx="${rx}" fill="none" stroke="#f5c542" stroke-width="3" opacity="0.55"/>
<image x="${x}" y="${y}" width="${shotW}" height="${shotH}" preserveAspectRatio="none" clip-path="url(#round)" xlink:href="${raw}"/>
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
  const only = process.argv[3];
  for (const target of TARGETS.filter(t => !only || t.name === only)) {
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
