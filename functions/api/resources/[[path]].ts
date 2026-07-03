import { createCrudHandlers, json, parseBody, requireAuth } from '../../_helper';
import type { APIContext } from '../../_helper';

const crud = createCrudHandlers('resources', 'resource');

export async function onRequestGet(context: APIContext): Promise<Response> {
  return crud.handleList(context);
}

export async function onRequestPost(context: APIContext): Promise<Response> {
  const path = (context.params as any).path;
  if (path === 'reorder') return crud.handleReorder(context);
  return crud.handleCreate(context);
}

export async function onRequestPut(context: APIContext): Promise<Response> {
  const path = (context.params as any).path;
  if (!path) return json({ error: '缺少 id' }, 400);
  return crud.handleUpdate(context, path);
}

export async function onRequestDelete(context: APIContext): Promise<Response> {
  const path = (context.params as any).path;
  if (!path) return json({ error: '缺少 id' }, 400);
  return crud.handleDelete(context, path);
}