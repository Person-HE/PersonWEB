/**
 * GET  /api/github          读取 GitHub 快照（cron 写入的 KV 缓存）
 * POST /api/github/refresh  手动触发同步（需登录，本地开发无 cron 时用）
 */
import { KV_GITHUB, refreshGithub } from '../../_live';
import { createCrudHandlers, json, requireAuth } from '../../_helper';
import type { APIContext } from '../../_helper';

export async function onRequestGet(ctx: APIContext): Promise<Response> {
  const snap = await ctx.env.KV.get(KV_GITHUB, 'json');
  if (!snap) return json({ error: '快照未生成，等待定时任务或手动刷新' }, 503);
  return json(snap, 200);
}

export async function onRequestPost(ctx: APIContext): Promise<Response> {
  const user = await requireAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!user) return json({ error: '未登录' }, 401);
  try {
    const snap = await refreshGithub(ctx.env);
    return json(snap);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : '同步失败' }, 502);
  }
}
