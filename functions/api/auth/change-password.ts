import { json, parseBody, requireAuth, getCollection, setCollection, verifyPassword, hashPassword, logAction, getIp } from '../../_helper';
import type { APIContext, UserRecord, WrappedItem } from '../../_helper';

export async function onRequestPost(context: APIContext): Promise<Response> {
  const { request, env } = context;
  const user = await requireAuth(request, env.JWT_SECRET);
  if (!user) return json({ error: '未登录' }, 401);

  const body = await parseBody(request);
  if (!body?.oldPassword || !body?.newPassword) {
    return json({ error: '请输入原密码和新密码' }, 400);
  }
  if (body.newPassword.length < 8) {
    return json({ error: '新密码至少 8 位' }, 400);
  }

  const users = await getCollection(env.KV, 'users') as WrappedItem[];
  const userRecord = users.find(u => (u.data as any as UserRecord).id === user.uid);
  if (!userRecord) return json({ error: '用户不存在' }, 404);

  const userData = userRecord.data as any as UserRecord;
  const valid = await verifyPassword(body.oldPassword, userData.passwordHash, userData.salt);
  if (!valid) return json({ error: '原密码错误' }, 400);

  const { hash, salt } = await hashPassword(body.newPassword);
  userData.passwordHash = hash;
  userData.salt = salt;
  userRecord.data = userData as any;
  await setCollection(env.KV, 'users', users);

  await logAction(env.KV, {
    action: 'password_change', targetType: 'user', targetId: user.uid, ip: getIp(request),
  });

  return json({ ok: true });
}