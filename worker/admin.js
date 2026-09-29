// 運営ダッシュボード /admin
//
// 認証: 管理用パスワード（Secret ADMIN_PASSWORD）→ 署名付きCookie（12時間）。
//   ADMIN_PASSWORD が未設定なら /admin 自体が存在しない（404）。
// データ: Supabase の admin_play_stats()（supabase/migrations/20260929_play_events.sql）を
//   service_role キー（Secret SUPABASE_SERVICE_ROLE_KEY）で呼ぶ。キーはブラウザに出さない。
// 表示するのは数値だけ。play_events にはプレイヤー名も入っていない。

const COOKIE = 'tj_admin';
const SESSION_SEC = 12 * 3600;

const MODES = [
  { id: 'speed', label: '清一色モード', color: '#DC2626' },
  { id: 'casual', label: '何切るモード', color: '#16A34A' },
  { id: 'fu', label: '符計算モード', color: '#7C3AED' },
];
const modeLabel = (id) => MODES.find(m => m.id === id)?.label || id;

const esc = (t) => String(t ?? '').replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const n = (v) => Number(v || 0).toLocaleString('ja-JP');
const pct = (a, b) => (b > 0 ? (a / b * 100).toFixed(1) + '%' : '-');

const HTML_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'same-origin',   // no-referrer だとフォーム送信が Origin: null になりログインできない
};

/* ---------------- 認証 ---------------- */

const hex = (buf) => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg)));
}

/** 長さや先頭一致で処理時間が変わらないよう、ダイジェスト同士を全桁比較する */
async function safeEqual(a, b) {
  const [x, y] = await Promise.all([hmac('cmp', a), hmac('cmp', b)]);
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return d === 0;
}

function readCookie(req, name) {
  for (const part of (req.headers.get('Cookie') || '').split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

async function isAuthed(env, req) {
  const raw = readCookie(req, COOKIE);
  if (!raw) return false;
  const [exp, sig] = raw.split('.');
  if (!exp || !sig || !(Number(exp) > Date.now() / 1000)) return false;
  return safeEqual(sig, await hmac(env.ADMIN_PASSWORD, 'admin:' + exp));
}

async function sessionCookie(env, secure) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_SEC;
  const sig = await hmac(env.ADMIN_PASSWORD, 'admin:' + exp);
  return `${COOKIE}=${exp}.${sig}; Path=/admin; HttpOnly;${secure ? ' Secure;' : ''} SameSite=Strict; Max-Age=${SESSION_SEC}`;
}

async function login(env, req, url) {
  // 別サイトのフォームからの送信は受け付けない
  const origin = req.headers.get('Origin');
  let originHost = null;
  try { originHost = origin ? new URL(origin).host : null; } catch {}
  if (origin && originHost !== url.host) return new Response('forbidden', { status: 403 });

  // 総当たり対策。D1 が無いので Workers の Rate Limiting バインディングで IP ごとに絞る
  const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
  if (env.LOGIN_LIMITER) {
    const { success } = await env.LOGIN_LIMITER.limit({ key: ip });
    if (!success) return loginPage('試行回数が多すぎます。1分ほど待ってからやり直してください。', 429);
  }

  const form = await req.formData().catch(() => null);
  const pw = String(form?.get('password') || '');
  if (!pw || !(await safeEqual(pw, env.ADMIN_PASSWORD))) {
    return loginPage('パスワードが違います。', 401);
  }
  return new Response(null, {
    status: 303,
    headers: {
      Location: '/admin',
      'Set-Cookie': await sessionCookie(env, url.protocol === 'https:'),
      'Cache-Control': 'no-store',
    },
  });
}

function logout() {
  return new Response(null, {
    status: 303,
    headers: {
      Location: '/admin',
      'Set-Cookie': `${COOKIE}=; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
      'Cache-Control': 'no-store',
    },
  });
}

const BASE_CSS = `
  :root{--bg:#F8FAFC;--panel:#fff;--line:#E2E8F0;--text:#0F172A;--muted:#64748B;--faint:#94A3B8;--accent:#CA8A04}
  body{font-family:-apple-system,'Hiragino Sans',sans-serif;background:var(--bg);color:var(--text);margin:0;font-size:14px}`;

function loginPage(message = '', status = 200) {
  return new Response(`<!doctype html><html lang="ja"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>運営ダッシュボード｜麻雀 辻斬る！</title>
<style>${BASE_CSS}
  body{min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box}
  form{background:#fff;border:1px solid var(--line);border-radius:14px;padding:26px;width:100%;max-width:340px}
  h1{font-size:18px;margin:0 0 4px} p{color:var(--muted);font-size:13px;margin:0 0 18px}
  input{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #CBD5E1;border-radius:9px;font-size:16px}
  button{margin-top:12px;width:100%;padding:11px;border:0;border-radius:9px;background:#111827;color:#FACC15;
    font-weight:700;font-size:15px;cursor:pointer}
  .err{color:#B91C1C;font-size:13px;margin:10px 0 0}
</style>
<form method="post" action="/admin/login">
  <h1>運営ダッシュボード</h1><p>麻雀 辻斬る！</p>
  <input type="password" name="password" placeholder="管理用パスワード" autocomplete="current-password" autofocus required>
  <button type="submit">ログイン</button>
  ${message ? `<div class="err">${esc(message)}</div>` : ''}
</form>`, { status, headers: HTML_HEADERS });
}

/* ---------------- ルーティング ---------------- */

/** /admin 配下を処理する。該当しなければ null（呼び出し側が静的ファイルを返す）。 */
export async function adminRoute(req, env, url) {
  const p = url.pathname.replace(/\/+$/, '');
  if (p !== '/admin' && p !== '/admin/login' && p !== '/admin/logout') return null;
  if (!env.ADMIN_PASSWORD) return new Response('not found', { status: 404 });

  if (p === '/admin/login' && req.method === 'POST') return login(env, req, url);
  if (p === '/admin/logout' && req.method === 'POST') return logout();
  if (p === '/admin' && (req.method === 'GET' || req.method === 'HEAD')) {
    return (await isAuthed(env, req)) ? dashboard(env) : loginPage();
  }
  return new Response('not found', { status: 404 });
}

/* ---------------- 集計の取得 ---------------- */

async function fetchStats(env) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env.SUPABASE_URL || !key) throw new Error('SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が未設定です');
  // 新形式の secret キー（sb_secret_...）は JWT ではないので Authorization に入れない
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  if (!key.startsWith('sb_')) headers.Authorization = `Bearer ${key}`;
  const res = await fetch(`${env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/rpc/admin_play_stats`, {
    method: 'POST', headers, body: '{}',
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

function errorPage(message) {
  return new Response(`<!doctype html><html lang="ja"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>運営ダッシュボード｜麻雀 辻斬る！</title>
<style>${BASE_CSS} .wrap{max-width:720px;margin:40px auto;padding:0 16px} pre{white-space:pre-wrap;background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px}</style>
<div class="wrap"><h1>集計を取得できませんでした</h1><pre>${esc(message)}</pre>
<p>Supabase にマイグレーション <code>20260929_play_events.sql</code> を適用済みか、Worker の Secret を確認してください。</p></div>`,
  { status: 502, headers: HTML_HEADERS });
}

/* ---------------- 画面 ---------------- */

async function dashboard(env) {
  let s;
  try { s = await fetchStats(env); } catch (e) { return errorPage(e.message); }

  const byMode = new Map((s.by_mode || []).map(r => [r.mode, r]));
  const sum = (k) => MODES.reduce((a, m) => a + (byMode.get(m.id)?.[k] || 0), 0);
  const total30 = sum('d30');
  const f = s.funnel_d30 || {};
  const pl = s.players || {};
  const daily = s.daily || [];
  const hasData = total30 > 0 || daily.some(d => d.speed || d.casual || d.fu);

  const card = (label, value, sub = '') =>
    `<div class="card"><div class="k">${esc(label)}</div><div class="v">${value}</div>
     ${sub ? `<div class="s">${sub}</div>` : ''}</div>`;

  const modeRows = MODES.map(m => {
    const r = byMode.get(m.id) || {};
    return `<tr>
      <td><i class="sw" style="background:${m.color}"></i>${esc(m.label)}</td>
      <td class="num">${n(r.today)}</td><td class="num">${n(r.d7)}</td><td class="num"><b>${n(r.d30)}</b></td>
      <td class="num">${pct(r.d30, total30)}</td>
      <td class="num">${n(r.players_d30)}</td>
      <td class="num">${pct(r.oni_d30, r.d30)}</td>
      <td class="num">${n(r.ad_d30)}</td></tr>`;
  }).join('');

  const shareBar = total30 > 0 ? `<div class="share">${MODES.map(m => {
    const v = byMode.get(m.id)?.d30 || 0;
    return v ? `<span style="width:${(v / total30 * 100).toFixed(2)}%;background:${m.color}" title="${esc(m.label)} ${n(v)}回"></span>` : '';
  }).join('')}</div>` : '';

  const resultRows = (s.results || []).map(r => `<tr>
      <td>${esc(modeLabel(r.mode))}${r.oni ? ' <span class="tag oni">鬼斬り</span>' : ''}</td>
      <td class="num">${n(r.finishes)}</td>
      <td class="num">${r.avg_correct ?? '-'}</td>
      <td class="num">${r.avg_answered ?? '-'}</td>
      <td class="num">${r.accuracy != null ? r.accuracy + '%' : '-'}</td>
      <td class="num">${n(r.avg_score)}</td></tr>`).join('')
    || '<tr><td colspan="6" class="dim">直近30日に終了したプレイはありません</td></tr>';

  const freq = s.frequency_d7 || {};
  const freqTotal = Object.values(freq).reduce((a, b) => a + b, 0);
  const freqRows = ['1', '2-4', '5-9', '10-19', '20+'].map(k => `<tr>
      <td>${k}回</td><td class="num">${n(freq[k])}</td><td class="num">${pct(freq[k], freqTotal)}</td></tr>`).join('');

  const splitRows = (obj, labels) => {
    const t = Object.values(obj || {}).reduce((a, b) => a + b, 0);
    const rows = Object.entries(labels).map(([k, label]) =>
      `<tr><td>${label}</td><td class="num">${n(obj?.[k])}</td><td class="num">${pct(obj?.[k], t)}</td></tr>`).join('');
    return rows;
  };

  const ranking = s.ranking_entries || {};
  const rankingRows = MODES.map(m => `<tr><td>${esc(m.label)}</td>
      <td class="num">${n(ranking[m.id]?.d30)}</td><td class="num">${n(ranking[m.id]?.all)}</td></tr>`).join('');

  return new Response(`<!doctype html><html lang="ja"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>運営ダッシュボード｜麻雀 辻斬る！</title>
<style>${BASE_CSS}
  body{padding:24px 16px}
  .wrap{max-width:1200px;margin:0 auto}
  header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
  h1{font-size:20px;margin:0 0 2px}
  .sub{color:var(--muted);font-size:13px;margin:0 0 20px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;margin-bottom:22px}
  .card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 16px}
  .card .k{font-size:12px;color:var(--muted);font-weight:600}
  .card .v{font-size:24px;font-weight:800;margin-top:2px;font-variant-numeric:tabular-nums}
  .card .s{font-size:11.5px;color:var(--faint);margin-top:2px}
  h2{font-size:15px;margin:26px 0 10px}
  .panel{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:14px}
  .panel h3{font-size:13px;margin:0 0 8px;color:#334155}
  .two{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}
  .legend{font-size:11.5px;color:var(--muted);margin-top:6px;display:flex;flex-wrap:wrap;gap:4px 14px}
  .sw{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:6px;vertical-align:-1px}
  .share{display:flex;gap:2px;height:12px;border-radius:6px;overflow:hidden;margin:4px 0 12px}
  .share span{display:block;height:100%}
  .scroll{overflow-x:auto;border:1px solid var(--line);border-radius:10px;background:#fff}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{background:var(--bg);text-align:left;padding:9px 10px;font-size:11.5px;color:var(--muted);border-bottom:2px solid var(--line);white-space:nowrap}
  td{padding:9px 10px;border-bottom:1px solid #F1F5F9;white-space:nowrap}
  tr:last-child td{border-bottom:none}
  .num{text-align:right;font-variant-numeric:tabular-nums} th.num{text-align:right}
  .dim{color:var(--faint);font-size:12px}
  .tag{font-size:10.5px;padding:1px 7px;border-radius:6px;background:#F1F5F9;color:#475569}
  .tag.oni{background:#FEE2E2;color:#B91C1C}
  .empty{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:9px;padding:11px 13px;font-size:13px;color:#1E3A8A;margin-bottom:18px;line-height:1.8}
  .note{background:#FFFBEB;border:1px solid #FDE68A;border-radius:9px;padding:11px 13px;font-size:12.5px;color:#78350F;margin-top:22px;line-height:1.8}
  form.out button{background:none;border:1px solid #CBD5E1;border-radius:8px;padding:6px 12px;color:#475569;cursor:pointer;font-size:12.5px}
  svg{width:100%;height:auto;display:block}
  .bar:hover{opacity:.7}
</style>
<div class="wrap">
  <header>
    <div>
      <h1>運営ダッシュボード</h1>
      <p class="sub">麻雀 辻斬る！ ／ ${esc(s.today)}（日本時間）時点 ／ 集計は表示のたびに実行</p>
    </div>
    <form class="out" method="post" action="/admin/logout"><button>ログアウト</button></form>
  </header>

  ${hasData ? '' : `<div class="empty">まだプレイの記録がありません。記録はWeb版では反映した時点から、iOS／Android版は記録に対応した次のバージョン（1.2.1）から始まります。
  それ以前のモード別の傾向は、下の「ランキング登録数」で見られます。</div>`}

  <div class="grid">
    ${card('今日のプレイ', n(sum('today')) + '回', `プレイした人 ${n(pl.dau)}人`)}
    ${card('直近7日のプレイ', n(sum('d7')) + '回', `プレイした人 ${n(pl.wau)}人`)}
    ${card('直近30日のプレイ', n(total30) + '回', `プレイした人 ${n(pl.mau)}人 ／ 累計 ${n(pl.total)}台`)}
    ${card('最後まで遊んだ率', pct(f.finishes, f.starts), `30日 ${n(f.finishes)}／${n(f.starts)}回`)}
    ${card('回数上限に到達', n(f.limit_hits) + '回', `30日 ${n(f.limit_hit_players)}人`)}
    ${card('広告で追加プレイ', n(f.ad_plays) + '回', `30日のプレイの ${pct(f.ad_plays, f.starts)}`)}
    ${card('プレミアムの人', n(pl.premium_d30) + '人', '直近30日にプレイした人のうち')}
  </div>

  <h2>モード別のプレイ数</h2>
  <div class="panel">
    <h3>直近30日の割合</h3>
    ${shareBar || '<p class="dim">データがありません</p>'}
    <div class="scroll"><table>
      <thead><tr><th>モード</th><th class="num">今日</th><th class="num">7日</th><th class="num">30日</th><th class="num">割合</th>
        <th class="num">プレイした人</th><th class="num">鬼斬り率</th><th class="num">広告で追加</th></tr></thead>
      <tbody>${modeRows}</tbody></table></div>
  </div>

  <div class="panel"><h3>日別のプレイ数（直近30日・モード別）</h3>
    ${stackedBars(daily)}
    <div class="legend">${MODES.map(m => `<span><i class="sw" style="background:${m.color}"></i>${esc(m.label)}</span>`).join('')}</div>
  </div>

  <div class="panel"><h3>プレイした人と新しい人（直近30日）</h3>
    ${pairBars(daily)}
    <div class="legend"><span><i class="sw" style="background:#0F172A"></i>その日にプレイした人</span>
      <span><i class="sw" style="background:#94A3B8"></i>初めてプレイした人</span></div>
  </div>

  <h2>成績（直近30日・最後まで遊んだプレイ）</h2>
  <div class="scroll"><table>
    <thead><tr><th>モード</th><th class="num">回数</th><th class="num">平均正解数</th><th class="num">平均回答数</th>
      <th class="num">正答率</th><th class="num">平均スコア</th></tr></thead>
    <tbody>${resultRows}</tbody></table></div>

  <h2>遊び方の内訳</h2>
  <div class="two">
    <div class="scroll"><table>
      <thead><tr><th>1人あたり直近7日のプレイ</th><th class="num">人数</th><th class="num">割合</th></tr></thead>
      <tbody>${freqRows}</tbody></table></div>
    <div class="scroll"><table>
      <thead><tr><th>端末（30日のプレイ）</th><th class="num">回数</th><th class="num">割合</th></tr></thead>
      <tbody>${splitRows(s.platform_d30, { ios: 'iOS', android: 'Android', web: 'Web' })}</tbody></table></div>
    <div class="scroll"><table>
      <thead><tr><th>言語（30日のプレイ）</th><th class="num">回数</th><th class="num">割合</th></tr></thead>
      <tbody>${splitRows(s.locale_d30, { ja: '日本語', en: '英語' })}</tbody></table></div>
  </div>

  <h2>ランキング登録数（参考）</h2>
  <div class="scroll"><table>
    <thead><tr><th>モード</th><th class="num">直近30日</th><th class="num">累計</th></tr></thead>
    <tbody>${rankingRows}</tbody></table></div>

  <div class="note">
    <b>数字の見方</b><br>
    ・「プレイ」は「斬！」を押してゲームを始めた回数です。途中でやめた回も含みます。<br>
    ・「プレイした人」は端末の数です。アプリを入れ直したり、ブラウザのデータを消したりすると別の人として数えます。<br>
    ・「回数上限に到達」は、無料の1日5回を使い切った画面が表示された回数です。<br>
    ・iOS／Android版の記録は、記録に対応したバージョン（1.2.1）から始まります。それまではWeb版だけの数字です。<br>
    ・「ランキング登録数」は、プレイ後に名前を入れてランキングに載せた回数です。記録を始める前の傾向を見るための参考値です。
  </div>
</div>`, { status: 200, headers: HTML_HEADERS });
}

/* ---------------- グラフ（SVG） ---------------- */

const W = 600, H = 160, padL = 30, padB = 18, padT = 8;

function niceStep(max) {
  const raw = max / 2;
  const mag = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1))));
  return [1, 2, 5, 10].map(m => m * mag).find(s => s >= raw) || mag;
}

function frame(daily, max) {
  const step = niceStep(Math.max(1, max));
  const top = Math.max(1, Math.ceil(max / step) * step);
  const ih = H - padB - padT;
  const y = (v) => padT + ih - (v / top) * ih;
  const grid = [0, top / 2, top].filter(v => Number.isInteger(v)).map(v =>
    `<line x1="${padL}" x2="${W}" y1="${y(v)}" y2="${y(v)}" stroke="#E2E8F0" stroke-width="1"/>
     <text x="${padL - 4}" y="${y(v) + 3}" text-anchor="end" font-size="9" fill="#94A3B8">${v}</text>`).join('');
  const slot = (W - padL) / Math.max(1, daily.length);
  const labels = [0, 10, 20, 29].filter(i => i < daily.length).map(i =>
    `<text x="${(padL + i * slot + slot / 2).toFixed(1)}" y="${H - 4}" text-anchor="middle" font-size="9" fill="#94A3B8">${esc(String(daily[i].day).slice(5))}</text>`).join('');
  return { top, ih, slot, grid, labels };
}

/** モード別の積み上げ棒。ホバーで日付と内訳を表示 */
function stackedBars(daily) {
  const max = Math.max(0, ...daily.map(d => MODES.reduce((a, m) => a + (d[m.id] || 0), 0)));
  const { top, ih, slot, grid, labels } = frame(daily, max);
  const bw = Math.max(2, slot - 3);
  const rects = daily.map((d, i) => {
    let acc = 0;
    const tip = `${d.day}: ` + MODES.map(m => `${m.label} ${d[m.id] || 0}`).join(' / ');
    return MODES.map(m => {
      const v = d[m.id] || 0;
      if (!v) return '';
      const h = (v / top) * ih;
      const yTop = padT + ih - acc - h;
      acc += h;
      return `<rect class="bar" x="${(padL + i * slot + 1.5).toFixed(1)}" y="${yTop.toFixed(1)}" width="${bw.toFixed(1)}"
        height="${Math.max(1, h - 1).toFixed(1)}" fill="${m.color}"><title>${esc(tip)}</title></rect>`;
    }).join('');
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="モード別の日別プレイ数">${grid}${rects}${labels}</svg>`;
}

/** 2系列を横に並べた棒 */
function pairBars(daily) {
  const series = [{ key: 'players', color: '#0F172A' }, { key: 'new_players', color: '#94A3B8' }];
  const max = Math.max(0, ...daily.flatMap(d => series.map(s => d[s.key] || 0)));
  const { top, ih, slot, grid, labels } = frame(daily, max);
  const bw = Math.max(2, (slot - 3) / series.length);
  const rects = daily.map((d, i) => series.map((s, j) => {
    const v = d[s.key] || 0;
    const h = v > 0 ? Math.max(1.5, (v / top) * ih) : 0;
    return `<rect class="bar" x="${(padL + i * slot + 1.5 + j * bw).toFixed(1)}" y="${(padT + ih - h).toFixed(1)}"
      width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="${s.color}"><title>${esc(d.day)}: ${v}</title></rect>`;
  }).join('')).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="日別のプレイした人数">${grid}${rects}${labels}</svg>`;
}
