/**
 * 数据库初始化 —— 使用 lowdb（纯 JS，JSON 文件存储）
 *
 * 设计：
 * - 数据存储在 data/db.json
 * - users: 管理员账号（bcrypt 哈希）
 * - resources/tools/services: 完整对象数组
 * - logs: 操作日志
 *
 * lowdb v7 是 ESM，使用 JSONFile adapter 持久化
 */
import { JSONFilePreset } from 'lowdb/node';
import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = process.env.DB_PATH || './data/db.json';

// 确保数据目录存在
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

/** 默认数据结构 */
const defaultData = {
  users: [],          // { id, username, passwordHash, createdAt, lastLoginAt, lastLoginIp }
  resources: [],      // { _order: number, data: Resource }
  tools: [],          // { _order: number, data: Tool }
  services: [],       // { _order: number, data: Service }
  logs: [],           // { id, action, targetType, targetId, detail, ip, userAgent, createdAt }
  _seq: {             // 自增序列
    logs: 0,
  },
};

// 持久化到 JSON 文件
export const db = await JSONFilePreset(DB_PATH, defaultData);

// 如果文件已存在但缺字段，补齐
if (!db.data.users) db.data.users = [];
if (!db.data.resources) db.data.resources = [];
if (!db.data.tools) db.data.tools = [];
if (!db.data.services) db.data.services = [];
if (!db.data.logs) db.data.logs = [];
if (!db.data._seq) db.data._seq = { logs: 0 };

await db.write();

/** 立即写盘（lowdb 默认修改后需手动 write） */
export async function flush() {
  await db.write();
}

/** 通用工具：按 _order 升序返回数组 */
export function ordered(list) {
  return [...list].sort((a, b) => (a._order || 0) - (b._order || 0));
}

export default db;
