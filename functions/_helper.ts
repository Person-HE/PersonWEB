/**
 * Cloudflare Pages Functions 共享工具
 *
 * 替代原 Express 后端，使用 Web Crypto API 和 Workers KV
 */

// ===== 类型定义 =====
export interface Env {
  KV: KVNamespace;
  JWT_SECRET: string;
}

export interface APIContext {
  request: Request;
  params: Record<string, string | string[]>;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
  data: Record<string, unknown>;
}

export interface WrappedItem {
  _order: number;
  data: Record<string, any>;
}

export interface UserRecord {
  id: number;
  username: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
}

// ===== KV 数据操作 =====
export async function getCollection(kv: KVNamespace, name: string): Promise<WrappedItem[]> {
  const raw = await kv.get(`col:${name}`, 'json');
  return Array.isArray(raw) ? raw : [];
}

export async function setCollection(kv: KVNamespace, name: string, data: WrappedItem[]): Promise<void> {
  await kv.put(`col:${name}`, JSON.stringify(data));
}

export function ordered(list: WrappedItem[]): Record<string, any>[] {
  return [...list]
    .sort((a, b) => (a._order || 0) - (b._order || 0))
    .map(item => item.data);
}

// ===== JWT (HMAC-SHA256, Web Crypto) =====
function base64UrlEncode(data: Uint8Array): string {
  const b64 = btoa(String.fromCharCode(...data));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

async function getSigningKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign', 'verify']
  );
}

export async function signJwt(
  payload: Record<string, any>,
  secret: string,
  expiresInSeconds: number = 28800
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };

  const enc = new TextEncoder();
  const h = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const b = base64UrlEncode(enc.encode(JSON.stringify(body)));
  const key = await getSigningKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${h}.${b}`));
  return `${h}.${b}.${base64UrlEncode(new Uint8Array(sig))}`;
}

export async function verifyJwt(
  token: string,
  secret: string
): Promise<Record<string, any> | null> {
  try {
    const [h, b, s] = token.split('.');
    if (!h || !b || !s) return null;
    const enc = new TextEncoder();
    const key = await getSigningKey(secret);
    const valid = await crypto.subtle.verify(
      'HMAC', key,
      base64UrlDecode(s),
      enc.encode(`${h}.${b}`)
    );
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(b)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// ===== 密码哈希 (PBKDF2-SHA256) =====
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = base64UrlEncode(saltBytes);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return { hash: base64UrlEncode(new Uint8Array(bits)), salt };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: base64UrlDecode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return base64UrlEncode(new Uint8Array(bits)) === storedHash;
}

// ===== 请求工具 =====
export function getIp(request: Request): string {
  return request.headers.get('cf-connecting-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || 'unknown';
}

export function getAuthUser(request: Request): { uid: number; username: string } | null {
  return (request as any)._user || null;
}

export function json(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function parseBody(request: Request): Promise<any> {
  try { return await request.json(); } catch { return null; }
}

/** JWT 鉴权检查，返回 user 或 null */
export async function requireAuth(
  request: Request,
  secret: string
): Promise<{ uid: number; username: string } | null> {
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  const payload = await verifyJwt(token, secret);
  if (!payload || !payload.uid) return null;
  return { uid: payload.uid, username: payload.username };
}

// ===== 日志 =====
export async function logAction(
  kv: KVNamespace,
  entry: { action: string; targetType?: string; targetId?: any; detail?: any; ip?: string }
): Promise<void> {
  try {
    const logs = await getCollection(kv, 'logs');
    const id = (await kv.get('seq:logs', 'json') as number) || 0;
    const nextId = id + 1;
    await kv.put('seq:logs', JSON.stringify(nextId));
    logs.push({
      _order: nextId,
      data: {
        id: nextId,
        action: entry.action,
        targetType: entry.targetType || null,
        targetId: entry.targetId || null,
        detail: entry.detail ? (typeof entry.detail === 'string' ? entry.detail : JSON.stringify(entry.detail)) : null,
        ip: entry.ip || null,
        userAgent: null,
        createdAt: new Date().toISOString(),
      },
    });
    const trimmed = logs.length > 500 ? logs.slice(-500) : logs;
    await setCollection(kv, 'logs', trimmed);
  } catch (e) {
    console.error('[logger]', e);
  }
}

// ===== CRUD 工厂 =====
/**
 * 创建通用 CRUD 处理器
 * @param collectionName 集合名 (resources/tools/services)
 * @param targetType 日志类型
 * @param isReorder 是否为排序请求 (通过 params 判断)
 * @param itemId 具体的 item ID (如果有的话)
 */
export function createCrudHandlers(collectionName: string, targetType: string) {
  return {
    /** GET /api/<collection> 或 GET /api/<collection>/<id> */
    async handleList(ctx: APIContext): Promise<Response> {
      const items = await getCollection(ctx.env.KV, collectionName);
      const rawPath = (ctx.params as any).path;
      const path = rawPath
        ? (Array.isArray(rawPath)
            ? rawPath.map(p => decodeURIComponent(p)).join('/')
            : decodeURIComponent(String(rawPath)))
        : undefined;

      // 如果有具体 ID
      if (path && path.length > 0) {
        const row = items.find(r => String(r.data.id) === String(path));
        if (!row) {
          return json({ error: '不存在' }, 404);
        }
        return json({ ...row.data, id: String(row.data.id) });
      }

      return json(ordered(items).map(item => ({ ...item, id: String(item.id) })));
    },

    /** POST /api/<collection> - 创建 */
    async handleCreate(ctx: APIContext): Promise<Response> {
      const user = await requireAuth(ctx.request, ctx.env.JWT_SECRET);
      if (!user) return json({ error: '未登录' }, 401);

      const body = await parseBody(ctx.request);
      if (!body || typeof body !== 'object' || !body.id) {
        return json({ error: '缺少 id 字段' }, 400);
      }
      body.id = String(body.id);

      const items = await getCollection(ctx.env.KV, collectionName);
      if (items.some(r => String(r.data.id) === body.id)) {
        return json({ error: `id "${body.id}" 已存在` }, 409);
      }

      const now = new Date().toISOString();
      if (collectionName === 'tools' && !body.addedAt) body.addedAt = now;
      if (collectionName !== 'tools' && !body.updatedAt) body.updatedAt = now;
      if (!body.createdAt) body.createdAt = now;

      const maxOrder = items.reduce((m, r) => Math.max(m, r._order || 0), 0);
      items.push({ _order: maxOrder + 1, data: body });
      await setCollection(ctx.env.KV, collectionName, items);

      await logAction(ctx.env.KV, {
        action: 'create', targetType, targetId: body.id,
        detail: { name: body.name || body.title }, ip: getIp(ctx.request),
      });

      return json(body, 201);
    },

    /** PUT /api/<collection>/<id> - 更新 */
    async handleUpdate(ctx: APIContext, id: string): Promise<Response> {
      const user = await requireAuth(ctx.request, ctx.env.JWT_SECRET);
      if (!user) return json({ error: '未登录' }, 401);

      const body = await parseBody(ctx.request);
      if (!body || typeof body !== 'object') {
        return json({ error: '请求体无效' }, 400);
      }
      const sid = String(id);
      body.id = sid;

      const items = await getCollection(ctx.env.KV, collectionName);
      const idx = items.findIndex(r => String(r.data.id) === sid);
      if (idx < 0) {
        return json({ error: '不存在' }, 404);
      }

      if (collectionName !== 'tools') body.updatedAt = new Date().toISOString();
      items[idx].data = body;
      await setCollection(ctx.env.KV, collectionName, items);

      await logAction(ctx.env.KV, {
        action: 'update', targetType, targetId: sid,
        detail: { name: body.name || body.title }, ip: getIp(ctx.request),
      });

      return json(body);
    },

    /** DELETE /api/<collection>/<id> - 删除 */
    async handleDelete(ctx: APIContext, id: string): Promise<Response> {
      const user = await requireAuth(ctx.request, ctx.env.JWT_SECRET);
      if (!user) return json({ error: '未登录' }, 401);

      const items = await getCollection(ctx.env.KV, collectionName);
      const sid = String(id);
      const idx = items.findIndex(r => String(r.data.id) === sid);
      if (idx < 0) {
        return json({ error: '不存在' }, 404);
      }

      const removed = items[idx].data;
      items.splice(idx, 1);
      await setCollection(ctx.env.KV, collectionName, items);

      await logAction(ctx.env.KV, {
        action: 'delete', targetType, targetId: String(id),
        detail: { name: removed.name || removed.title }, ip: getIp(ctx.request),
      });

      return json({ ok: true, id: String(id) });
    },

    /** POST /api/<collection>/reorder - 排序 */
    async handleReorder(ctx: APIContext): Promise<Response> {
      const user = await requireAuth(ctx.request, ctx.env.JWT_SECRET);
      if (!user) return json({ error: '未登录' }, 401);

      const body = await parseBody(ctx.request);
      if (!body || !Array.isArray(body.ids)) {
        return json({ error: '需要 ids 数组' }, 400);
      }

      const items = await getCollection(ctx.env.KV, collectionName);
      body.ids.forEach((id: string, idx: number) => {
        const row = items.find(r => String(r.data.id) === String(id));
        if (row) row._order = idx + 1;
      });
      await setCollection(ctx.env.KV, collectionName, items);

      await logAction(ctx.env.KV, {
        action: 'reorder', targetType,
        detail: { count: body.ids.length }, ip: getIp(ctx.request),
      });

      return json({ ok: true, count: body.ids.length });
    },
  };
}
