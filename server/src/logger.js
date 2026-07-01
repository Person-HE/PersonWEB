/**
 * 操作日志记录器 —— 所有写操作都记入 logs，用于审计
 */
import { db, flush } from './db.js';

/**
 * 写入一条操作日志
 */
export async function logAction({ action, targetType, targetId, detail, ip, userAgent }) {
  try {
    db.data._seq.logs += 1;
    db.data.logs.push({
      id: db.data._seq.logs,
      action,
      targetType: targetType || null,
      targetId: targetId || null,
      detail: detail ? (typeof detail === 'string' ? detail : JSON.stringify(detail)) : null,
      ip: ip || null,
      userAgent: userAgent || null,
      createdAt: new Date().toISOString(),
    });
    // 仅保留最近 500 条，防止无限增长
    if (db.data.logs.length > 500) {
      db.data.logs = db.data.logs.slice(-500);
    }
    await flush();
  } catch (e) {
    console.error('[logger] 写入日志失败:', e.message);
  }
}

/**
 * 查询最近 N 条日志
 */
export function getRecentLogs(limit = 100) {
  return [...db.data.logs]
    .sort((a, b) => b.id - a.id)
    .slice(0, Math.min(limit, 500));
}

export default { logAction, getRecentLogs };
