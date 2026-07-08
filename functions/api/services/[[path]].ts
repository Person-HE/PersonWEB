import { createCrudHandlers, json } from '../../_helper';
import type { APIContext } from '../../_helper';

const crud = createCrudHandlers('services', 'service');

function getPath(context: APIContext): string | undefined {
  const raw = (context.params as any).path;
  if (!raw) return undefined;
  return Array.isArray(raw) ? raw.join('/') : String(raw);
}

export async function onRequestGet(context: APIContext): Promise<Response> {
  return crud.handleList(context);
}

export async function onRequestPost(context: APIContext): Promise<Response> {
  const path = getPath(context);
  if (path === 'reorder') return crud.handleReorder(context);
  return crud.handleCreate(context);
}

export async function onRequestPut(context: APIContext): Promise<Response> {
  const path = getPath(context);
  if (!path) return json({ error: '缺少 id' }, 400);
  return crud.handleUpdate(context, path);
}

export async function onRequestDelete(context: APIContext): Promise<Response> {
  const path = getPath(context);
  if (!path) return json({ error: '缺少 id' }, 400);
  return crud.handleDelete(context, path);
}
