/**
 * 日志路由 —— 查询最近操作日志（鉴权）
 */
import { Router } from 'express';
import { requireAuth } from '../auth.js';
import { getRecentLogs } from '../logger.js';

const router = Router();

/** 获取最近 N 条日志（默认 100，最多 500） */
router.get('/', requireAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const logs = await getRecentLogs(limit);
    res.json(logs);
  } catch (e) {
    console.error('[logs] list error:', e);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
