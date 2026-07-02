/**
 * 数据库层 —— Vercel KV (Redis) 替代 lowdb 文件存储
 *
 * 设计：
 * - 每个集合（users/resources/tools/services/logs）存为一个 KV key
 * - 所有操作都是 async（KV 是网络请求）
 * - 自增序列用 KV 的 incr 命令
 */
import { kv } from '@vercel/kv';

/** 读取一个集合（返回数组副本，修改后需 setCollection 写回） */
export async function getCollection(name) {
  const data = await kv.get(`collection:${name}`);
  return Array.isArray(data) ? data : [];
}

/** 写入整个集合 */
export async function setCollection(name, data) {
  await kv.set(`collection:${name}`, data);
}

/** 获取下一个自增 ID */
export async function nextId(name) {
  return await kv.incr(`seq:${name}`);
}

/** 按 _order 升序排列并提取 data 字段 */
export function ordered(list) {
  return [...list]
    .sort((a, b) => (a._order || 0) - (b._order || 0))
    .map((item) => item.data);
}
