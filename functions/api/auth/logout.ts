import { json, requireAuth, logAction, getIp } from '../../_helper';
import type { APIContext } from '../../_helper';

export async function onRequestPost(context: APIContext): Promise<Response> {
  const user = await requireAuth(context.request, context.env.JWT_SECRET);
  if (user) {
    await logAction(context.env.KV, {
      action: 'logout', targetType: 'user', targetId: user.uid,
      detail: { username: user.username }, ip: getIp(context.request),
    });
  }
  return json({ ok: true });
}