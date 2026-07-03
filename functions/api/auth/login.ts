import { json, parseBody, getCollection, setCollection, verifyPassword, signJwt, logAction, getIp } from '../../_helper';
import type { Env, APIContext, UserRecord, WrappedItem } from '../../_helper';

export async function onRequestPost(context: APIContext): Promise<Response> {
  const { request, env } = context;
  const body = await parseBody(request);
  
  if (!body?.username || !body?.password) {
    return json({ error: '请输入用户名和密码' }, 400);
  }

  const users = await getCollection(env.KV, 'users') as WrappedItem[];
  const userRecord = users.find(u => (u.data as any as UserRecord).username === body.username);
  
  if (!userRecord) {
    return json({ error: '用户名或密码错误' }, 401);
  }

  const user = userRecord.data as any as UserRecord;
  const valid = await verifyPassword(body.password, user.passwordHash, user.salt);
  
  if (!valid) {
    await logAction(env.KV, {
      action: 'login_failed', targetType: 'user',
      detail: { reason: 'wrong_password' }, ip: getIp(request),
    });
    return json({ error: '用户名或密码错误' }, 401);
  }

  const token = await signJwt(
    { uid: user.id, username: user.username },
    env.JWT_SECRET,
    28800 // 8 hours
  );

  user.lastLoginAt = new Date().toISOString();
  user.lastLoginIp = getIp(request);
  userRecord.data = user as any;
  await setCollection(env.KV, 'users', users);

  await logAction(env.KV, {
    action: 'login', targetType: 'user', targetId: user.id,
    detail: { username: user.username }, ip: getIp(request),
  });

  return json({ token, user: { id: user.id, username: user.username } });
}