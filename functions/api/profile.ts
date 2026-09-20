/**
 * 个人画像（单文档）
 * GET  公开：/api/profile → Profile | null
 * PUT  登录：整体覆盖保存（后台「画像编辑」页使用）
 */
import { json, logAction, parseBody, requireAuth, getIp } from '../_helper';
import type { APIContext } from '../_helper';

export const PROFILE_KEY = 'profile:me';

export async function onRequestGet(ctx: APIContext): Promise<Response> {
  const profile = await ctx.env.KV.get(PROFILE_KEY, 'json');
  return json(profile, 200);
}

export async function onRequestPut(ctx: APIContext): Promise<Response> {
  const user = await requireAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!user) return json({ error: '未登录' }, 401);

  const body = await parseBody(ctx.request);
  if (!body || typeof body !== 'object' || !body.nickname) {
    return json({ error: '画像数据无效（nickname 必填）' }, 400);
  }
  const profile = { ...body, id: 'me', updatedAt: new Date().toISOString() };
  await ctx.env.KV.put(PROFILE_KEY, JSON.stringify(profile));

  await logAction(ctx.env.KV, {
    action: 'update', targetType: 'profile', targetId: 'me',
    detail: { nickname: profile.nickname }, ip: getIp(ctx.request),
  });
  return json(profile);
}
