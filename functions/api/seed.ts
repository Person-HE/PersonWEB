import { json, getCollection, setCollection, hashPassword } from '../_helper';
import type { APIContext, UserRecord } from '../_helper';

export async function onRequestGet(context: APIContext): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  if (!env.SETUP_KEY || key !== env.SETUP_KEY) {
    return json({ error: '密钥错误' }, 403);
  }

  const results: Record<string, string> = {};
  const baseUrl = `${url.protocol}//${url.host}`;

  // 1. 创建管理员
  const users = await getCollection(env.KV, 'users');
  const adminUsername = env.ADMIN_USERNAME || 'admin';
  if (users.length > 0) {
    results.admin = '已存在，跳过';
  } else {
    const adminPassword = env.ADMIN_INITIAL_PASSWORD || 'admin123456';
    const { hash, salt } = await hashPassword(adminPassword);
    const userRecord: UserRecord = {
      id: 1, username: adminUsername, passwordHash: hash, salt,
      createdAt: new Date().toISOString(), lastLoginAt: null, lastLoginIp: null,
    };
    await setCollection(env.KV, 'users', [{ _order: 1, data: userRecord as any }]);
    results.admin = `创建成功 (${adminUsername})`;
  }

  // 2. 导入种子数据
  const seedFiles = [
    { collection: 'resources', path: '/data/resources.json' },
    { collection: 'tools', path: '/data/tools.json' },
    { collection: 'services', path: '/data/services.json' },
  ];

  for (const { collection, path } of seedFiles) {
    const existing = await getCollection(env.KV, collection);
    if (existing.length > 0) {
      results[collection] = `已有 ${existing.length} 条，跳过`;
      continue;
    }

    try {
      const resp = await fetch(`${baseUrl}${path}`);
      if (!resp.ok) {
        results[collection] = `获取失败 (${resp.status})`;
        continue;
      }
      const data: any[] = await resp.json();
      if (data.length === 0) {
        results[collection] = '源文件为空，跳过';
        continue;
      }
      const wrapped = data.map((item, idx) => ({
        _order: idx + 1,
        data: item.id ? item : { ...item, id: `${collection}-${idx + 1}` },
      }));
      await setCollection(env.KV, collection, wrapped);
      results[collection] = `导入 ${wrapped.length} 条`;
    } catch (e: any) {
      results[collection] = `错误: ${e.message}`;
    }
  }

  return json({ message: '初始化完成', results });
}