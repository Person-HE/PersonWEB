/**
 * GET  /api/blog          读取博客文章目录快照
 * POST /api/blog/refresh  手动触发同步（需登录）
 */
import { KV_BLOG, refreshBlog } from '../../_live';
import { json, requireAuth } from '../../_helper';
import type { APIContext } from '../../_helper';

export async function onRequestGet(ctx: APIContext): Promise<Response> {
  const feed = await ctx.env.KV.get(KV_BLOG, 'json');
  if (!feed) return json({ error: '快照未生成，等待定时任务或手动刷新' }, 503);
  return json(feed, 200);
}

export async function onRequestPost(ctx: APIContext): Promise<Response> {
  const user = await requireAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!user) return json({ error: '未登录' }, 401);
  try {
    const feed = await refreshBlog(ctx.env);
    return json(feed);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : '同步失败' }, 502);
  }
}
