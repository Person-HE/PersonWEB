/**
 * 活数据同步端点 —— Pages Cron Trigger 配置为每小时 GET /cron。
 * Pages 的 cron 与 Workers 不同：到点向站点路径发 GET 请求，因此这里是 onRequestGet。
 *
 * 若设置了 CRON_SECRET 密钥，则必须 ?key= 匹配才执行（防外部刷调用）；未设置则开放。
 */
import { refreshGithub, refreshBlog } from './_live';
import type { APIContext } from './_helper';

export async function onRequestGet(context: APIContext): Promise<Response> {
  const { env, request } = context;
  if (env.CRON_SECRET) {
    const key = new URL(request.url).searchParams.get('key');
    if (key !== env.CRON_SECRET) {
      return new Response('forbidden', { status: 403 });
    }
  }

  const results = await Promise.allSettled([refreshGithub(env), refreshBlog(env)]);
  const body = {
    ok: results.every((r) => r.status === 'fulfilled'),
    github: results[0].status === 'fulfilled' ? results[0].value.fetchedAt : String(results[0].reason),
    blog: results[1].status === 'fulfilled' ? results[1].value.fetchedAt : String(results[1].reason),
  };
  for (const r of results) {
    if (r.status === 'rejected') console.error('[cron] live sync failed:', r.reason);
  }
  return new Response(JSON.stringify(body), {
    status: body.ok ? 200 : 502,
    headers: { 'Content-Type': 'application/json' },
  });
}
