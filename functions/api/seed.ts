import { json, getCollection, setCollection, hashPassword } from '../_helper';
import type { APIContext, UserRecord } from '../_helper';

async function createAdmin(env: any, results: Record<string, string>) {
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
}

async function importCollection(env: any, collection: string, data: any[], results: Record<string, string>) {
  const existing = await getCollection(env.KV, collection);
  if (existing.length > 0) {
    results[collection] = `已有 ${existing.length} 条，跳过`;
    return;
  }
  if (!data || data.length === 0) {
    results[collection] = '无数据';
    return;
  }
  const wrapped = data.map((item, idx) => ({
    _order: idx + 1,
    data: item.id ? item : { ...item, id: `${collection}-${idx + 1}` },
  }));
  await setCollection(env.KV, collection, wrapped);
  results[collection] = `导入 ${wrapped.length} 条`;
}

function checkKey(request: Request, env: any): boolean {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  return !!env.SETUP_KEY && key === env.SETUP_KEY;
}

// POST: 直接传入种子数据 { resources: [...], tools: [...], services: [...] }
export async function onRequestPost(context: APIContext): Promise<Response> {
  const { request, env } = context;
  if (!checkKey(request, env)) {
    return json({ error: '密钥错误' }, 403);
  }

  const body = await request.json() as Record<string, any[]>;
  const results: Record<string, string> = {};

  await createAdmin(env, results);

  for (const collection of ['resources', 'tools', 'services']) {
    await importCollection(env, collection, body[collection] || [], results);
  }

  return json({ message: '初始化完成', results });
}

// GET: 尝试从静态文件加载（备用）
export async function onRequestGet(context: APIContext): Promise<Response> {
  const { request, env } = context;
  if (!checkKey(request, env)) {
    return json({ error: '密钥错误' }, 403);
  }

  const results: Record<string, string> = {};
  const baseUrl = `${new URL(request.url).protocol}//${new URL(request.url).host}`;

  await createAdmin(env, results);

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
      if (!resp.ok || resp.headers.get('content-type')?.includes('text/html')) {
        results[collection] = `静态文件不可用，请用 POST 方式传入数据`;
        continue;
      }
      const data: any[] = await resp.json();
      await importCollection(env, collection, data, results);
    } catch (e: any) {
      results[collection] = `错误: ${e.message}`;
    }
  }

  return json({ message: '初始化完成（GET模式）', results });
}