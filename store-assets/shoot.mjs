// CDP-driven mobile screenshots for Play Store
// Node 22+ (global fetch / WebSocket)
const PORT = 9222;
const BASE = 'https://mahjong-tsujigiri.vercel.app';
const OUT = new URL('.', import.meta.url).pathname;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/json/version`);
      const j = await res.json();
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
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
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

async function shoot(client, name, path, { waitText, clickText, afterClickText, extraWait = 0 } = {}) {
  const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await client.send('Target.attachToTarget', { targetId, flatten: true });
  const S = (m, p) => client.send(m, p, sessionId);
  await S('Page.enable');
  await S('Runtime.enable');
  await S('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
  await S('Page.navigate', { url: BASE + path });
  await sleep(2500);

  const evalJs = async (expr) => {
    const r = await S('Runtime.evaluate', { expression: expr, returnByValue: true });
    return r.result.value;
  };

  if (waitText) {
    for (let i = 0; i < 40; i++) {
      if (await evalJs(`document.body.innerText.includes(${JSON.stringify(waitText)})`)) break;
      await sleep(300);
    }
  }
  if (clickText) {
    await evalJs(`(()=>{const btns=[...document.querySelectorAll('button')].filter(e=>e.offsetParent!==null);let t=btns.find(e=>e.textContent.trim().startsWith(${JSON.stringify(clickText)}));if(!t)t=btns.find(e=>e.textContent.includes(${JSON.stringify(clickText)}));if(t)t.click();return t?t.textContent.trim():'none';})()`);
    await sleep(1500);
    if (afterClickText) {
      for (let i = 0; i < 40; i++) {
        if (await evalJs(`document.body.innerText.includes(${JSON.stringify(afterClickText)})`)) break;
        await sleep(300);
      }
    }
  }
  if (extraWait) await sleep(extraWait);

  const { data } = await S('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const fs = await import('node:fs');
  fs.writeFileSync(OUT + `shot-${name}.png`, Buffer.from(data, 'base64'));
  console.log(`saved shot-${name}.png`);
  await client.send('Target.closeTarget', { targetId });
}

const wsUrl = await getWsUrl();
const client = makeClient(wsUrl);
await client.ready;

await shoot(client, 'game', '/game?mode=casual', { clickText: '斬！', afterClickText: '切る牌をタップ', extraWait: 3000 });

client.ws.close();
console.log('done');
process.exit(0);
