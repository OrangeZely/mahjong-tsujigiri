// Cloudflare Worker の入口。
// サイト本体は next build の静的書き出し（out/）で、Worker を通さずアセット配信層が返す。
// wrangler.jsonc の run_worker_first で /admin 配下だけがここに届く。
import { adminRoute } from './admin.js';

const worker = {
  async fetch(req, env) {
    const url = new URL(req.url);
    const res = await adminRoute(req, env, url);
    return res || env.ASSETS.fetch(req);
  },
};

export default worker;
