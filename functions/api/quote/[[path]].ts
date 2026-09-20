/**
 * 需求报价表单
 * POST /api/quote      公开提交（校验 + honeypot + 每 IP 每小时限 5 条）
 * GET  /api/quote      登录后可见列表（后台）
 * PUT  /api/quote/:id  登录后可改状态
 * DELETE /api/quote/:id 登录后可删
 */
import { createCrudHandlers, getCollection, getIp, json, ordered, parseBody, requireAuth, setCollection } from '../../_helper';
import type { APIContext } from '../../_helper';
import type { Quote } from '../../src/types';

const crud = createCrudHandlers('quotes', 'quote');
const RATE_KEY_PREFIX = 'rate:quote:';
const MAX_PER_HOUR = 5;

function getPath(ctx: APIContext): string | undefined {
  const raw = (ctx.params as any).path;
  if (!raw) return undefined;
  return Array.isArray(raw) ? raw.map((p: string) => decodeURIComponent(p)).join('/') : decodeURIComponent(String(raw));
}

const SERVICE_TYPES = ['网站/落地页', 'Web应用/小程序', '自动化脚本', 'AI工作流', '企业AI落地', '工具安装配置', '其他'];

async function rateLimited(ip: string, kv: KVNamespace): Promise<boolean> {
  const hour = Math.floor(Date.now() / 3600000);
  const key = `${RATE_KEY_PREFIX}${ip}:${hour}`;
  const count = ((await kv.get(key, 'json')) as number) || 0;
  if (count >= MAX_PER_HOUR) return true;
  await kv.put(key, JSON.stringify(count + 1), { expirationTtl: 7200 });
  return false;
}

export async function onRequestGet(ctx: APIContext): Promise<Response> {
  const user = await requireAuth(ctx.request, ctx.env.JWT_SECRET);
  if (!user) return json({ error: '未登录' }, 401);
  const items = await getCollection(ctx.env.KV, 'quotes');
  return json(ordered(items).reverse().map(item => ({ ...item, id: String(item.id) })));
}

export async function onRequestPost(ctx: APIContext): Promise<Response> {
  const path = getPath(ctx);
  if (path === 'reorder') return crud.handleReorder(ctx);

  // 公开提交路径
  const body = await parseBody(ctx.request);
  if (!body || typeof body !== 'object') return json({ error: '请求体无效' }, 400);
  if (body._hp) return json({ ok: true }); // honeypot 命中：静默丢弃

  const ip = getIp(ctx.request);
  if (await rateLimited(ip, ctx.env.KV)) {
    return json({ error: '提交过于频繁，请稍后再试或直接加微信' }, 429);
  }

  const quote: Partial<Quote> = {
    name: String(body.name || '').trim().slice(0, 40),
    contact: String(body.contact || '').trim().slice(0, 80),
    serviceType: SERVICE_TYPES.includes(body.serviceType) ? body.serviceType : '其他',
    budget: String(body.budget || '').slice(0, 30),
    deadline: String(body.deadline || '').slice(0, 20),
    channel: String(body.channel || '').slice(0, 20),
    message: String(body.message || '').trim().slice(0, 2000),
    ref: String(body.ref || '').slice(0, 60),
    status: '待处理',
  };
  if (!quote.name || !quote.contact || !quote.message) {
    return json({ error: '称呼、联系方式、需求描述为必填' }, 400);
  }

  const items = await getCollection(ctx.env.KV, 'quotes');
  const seqId = ((await ctx.env.KV.get('seq:quotes', 'json')) as number) || 0;
  const nextId = seqId + 1;
  const full: Quote = { ...quote as Quote, id: `Q${String(nextId).padStart(4, '0')}`, createdAt: new Date().toISOString() };
  await ctx.env.KV.put('seq:quotes', JSON.stringify(nextId));
  items.push({ _order: nextId, data: full as any });
  await setCollection(ctx.env.KV, 'quotes', items);

  return json({ ok: true, id: full.id }, 201);
}

export async function onRequestPut(ctx: APIContext): Promise<Response> {
  const path = getPath(ctx);
  if (!path) return json({ error: '缺少 id' }, 400);
  return crud.handleUpdate(ctx, path);
}

export async function onRequestDelete(ctx: APIContext): Promise<Response> {
  const path = getPath(ctx);
  if (!path) return json({ error: '缺少 id' }, 400);
  return crud.handleDelete(ctx, path);
}
