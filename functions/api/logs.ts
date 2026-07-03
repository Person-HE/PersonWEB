import { json, requireAuth, getCollection } from '../_helper';
import type { APIContext, WrappedItem } from '../_helper';

export async function onRequestGet(context: APIContext): Promise<Response> {
  const user = await requireAuth(context.request, context.env.JWT_SECRET);
  if (!user) return json({ error: '未登录' }, 401);

  const url = new URL(context.request.url);
  const limit = parseInt(url.searchParams.get('limit') || '100', 10);

  const logs = await getCollection(context.env.KV, 'logs');
  const sorted = logs
    .map(item => item.data)
    .sort((a: any, b: any) => (b.id || 0) - (a.id || 0))
    .slice(0, Math.min(limit, 500));

  return json(sorted);
}