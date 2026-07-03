/**
 * 数据库层 —— ioredis + Upstash Redis
 *
 * 设计：
 * - 每个集合（users/resources/tools/services/logs）存为一个 Redis key（JSON 字符串）
 * - 所有操作都是 async
 * - 自增序列用 Redis INCR 命令
 *
 * 环境变量：
 * - REDIS_URL: Upstash Redis 连接字符串 (rediss://:password@host:port)
 */
import Redis from 'ioredis';

// 单例连接，Vercel Serverless 会复用热连接
let redis = null;

function getRedis() {
  if (!redis) {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error('REDIS_URL 环境变量未配置');
    }
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      tls: {},
    });
    redis.on('error', (err) => {
      console.error('[Redis] 连接错误:', err.message);
    });
  }
  return redis;
}

/** 读取一个集合（返回数组副本，修改后需 setCollection 写回） */
export async function getCollection(name) {
  const r = getRedis();
  const raw = await r.get(`collection:${name}`);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** 写入整个集合 */
export async function setCollection(name, data) {
  const r = getRedis();
  await r.set(`collection:${name}`, JSON.stringify(data));
}

/** 获取下一个自增 ID */
export async function nextId(name) {
  const r = getRedis();
  return await r.incr(`seq:${name}`);
}

/** 按 _order 升序排列并提取 data 字段 */
export function ordered(list) {
  return [...list]
    .sort((a, b) => (a._order || 0) - (b._order || 0))
    .map((item) => item.data);
}
