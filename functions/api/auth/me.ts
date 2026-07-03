import { json, requireAuth } from '../../_helper';
import type { APIContext } from '../../_helper';

export async function onRequestGet(context: APIContext): Promise<Response> {
  const user = await requireAuth(context.request, context.env.JWT_SECRET);
  if (!user) return json({ error: '未登录' }, 401);
  return json({ user: { id: user.uid, username: user.username } });
}