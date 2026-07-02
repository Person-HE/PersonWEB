/**
 * 操作日志记录器 —— 所有写操作都记入 logs，用于审计
 */
import { getCollection, setCollection, nextId } from './db.js';

/**
 * 写入一条操作日志
 */
export async function logAction({ action, targetType, targetId, detail, ip, userAgent }) {
  try {
    const logs = await getCollection('logs');
    const id = await nextId('logs');
    logs.push({
      id,
      action,
      targetType: targetType || null,
      targetId: targetId || null,
      detail: detail ? (typeof detail === 'string' ? detail : JSON.stringify(detail)) : null,
      ip: ip || null,
      userAgent: userAgent || null,
      createdAt: new Date().toISOString(),
    });
    // 仅保留最近 500 条，防止无限增长
    const trimmed = logs.length > 500 ? logs.slice(-500) : logs;
    await setCollection('logs', trimmed);
  } catch (e) {
    console.error('[logger] 写入日志失败:', e.message);
  }
}

/**
 * 查询最近 N 条日志
 */
export async function getRecentLogs(limit = 100) {
  const logs = await getCollection('logs');
  return [...logs]
    .sort((a, b) => b.id - a.id)
    .slice(0, Math.min(limit, 500));
}

export default { logAction, getRecentLogs };
