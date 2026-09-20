/**
 * 作品集 CRUD
 * GET 公开访问时只返回 published=true 的条目；登录后可见全部（供后台管理）。
 */
import { createCrudHandlers, getCollection, json, ordered, requireAuth } from '../../_helper';
import type { APIContext } from '../../_helper';

const crud = createCrudHandlers('portfolio', 'portfolio');

function getPath(ctx: APIContext): string | undefined {
  const raw = (ctx.params as any).path;
  if (!raw) return undefined;
  return Array.isArray(raw)
    ? raw.map((p: string) => decodeURIComponent(p)).join('/')
    : decodeURIComponent(String(raw));
}

export async function onRequestGet(ctx: APIContext): Promise<Response> {
  const path = getPath(ctx);
  if (path) return crud.handleList(ctx);

  // 列表：未登录过滤未发布
  const user = await requireAuth(ctx.request, ctx.env.JWT_SECRET);
  const items = await getCollection(ctx.env.KV, 'portfolio');
  const visible = user ? items : items.filter(r => r.data.published !== false);
  return json(ordered(visible).map(item => ({ ...item, id: String(item.id) })));
}

export async function onRequestPost(ctx: APIContext): Promise<Response> {
  const path = getPath(ctx);
  if (path === 'reorder') return crud.handleReorder(ctx);
  return crud.handleCreate(ctx);
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
