import { json, getCollection } from '../_helper';
import type { Env, APIContext } from '../_helper';

export async function onRequestGet(context: APIContext): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  
  if (!env.SETUP_KEY || key !== env.SETUP_KEY) {
    return json({ error: '密钥错误' }, 403);
  }

  // 检查各集合状态
  const resources = await getCollection(env.KV, 'resources');
  const tools = await getCollection(env.KV, 'tools');
  const services = await getCollection(env.KV, 'services');
  const users = await getCollection(env.KV, 'users');

  return json({
    message: 'API 运行正常',
    status: {
      resources: resources.length,
      tools: tools.length,
      services: services.length,
      users: users.length,
    },
    env: {
      JWT_SECRET: env.JWT_SECRET ? '已配置' : '未配置',
    },
  });
}