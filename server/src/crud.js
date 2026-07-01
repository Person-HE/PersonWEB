/**
 * 通用 CRUD 工厂 —— 为 resources / tools / services 三类数据生成 RESTful 路由
 *
 * 设计：
 * - 列表（公开）：GET /api/<type>
 * - 详情（公开）：GET /api/<type>/:id
 * - 创建（鉴权）：POST /api/<type>
 * - 更新（鉴权）：PUT /api/<type>/:id
 * - 删除（鉴权）：DELETE /api/<type>/:id
 * - 排序（鉴权）：POST /api/<type>/reorder
 *
 * 数据存储在 lowdb 的数组中，每条记录结构为 { _order, data }
 */
import { Router } from 'express';
import { db, flush, ordered } from './db.js';
import { logAction } from './logger.js';
import { requireAuth, getRequestIp, adminLimiter } from './auth.js';

/**
 * @param {string} collectionName  resources|tools|services
 * @param {object} opts
 * @param {string} opts.targetType  日志里的 target_type
 */
export function createCrudRouter(collectionName, opts = {}) {
  const router = Router();
  const targetType = opts.targetType || collectionName;

  /** 取集合 */
  const getColl = () => db.data[collectionName];

  /** 列表：公开 */
  router.get('/', (req, res) => {
    try {
      const list = ordered(getColl()).map((r) => r.data);
      res.json(list);
    } catch (e) {
      console.error(`[${collectionName}] list error:`, e);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  /** 详情：公开 */
  router.get('/:id', (req, res) => {
    try {
      const row = getColl().find((r) => r.data.id === req.params.id);
      if (!row) return res.status(404).json({ error: '不存在' });
      res.json(row.data);
    } catch (e) {
      console.error(`[${collectionName}] get error:`, e);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  /** 创建：鉴权 */
  router.post('/', requireAuth, adminLimiter, async (req, res) => {
    try {
      const item = req.body;
      if (!item || typeof item !== 'object') {
        return res.status(400).json({ error: '请求体必须是对象' });
      }
      if (!item.id) {
        return res.status(400).json({ error: '缺少 id 字段' });
      }

      const coll = getColl();
      if (coll.some((r) => r.data.id === item.id)) {
        return res.status(409).json({ error: `id "${item.id}" 已存在` });
      }

      const now = new Date().toISOString();
      if (collectionName === 'tools' && !item.addedAt) item.addedAt = now;
      if (collectionName !== 'tools' && !item.updatedAt) item.updatedAt = now;
      if (!item.createdAt) item.createdAt = now;

      const maxOrder = coll.reduce((m, r) => Math.max(m, r._order || 0), 0);
      coll.push({ _order: maxOrder + 1, data: item });
      await flush();

      await logAction({
        action: 'create',
        targetType,
        targetId: item.id,
        detail: { name: item.name || item.title },
        ip: getRequestIp(req),
        userAgent: req.headers['user-agent'],
      });

      res.status(201).json(item);
    } catch (e) {
      console.error(`[${collectionName}] create error:`, e);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  /** 更新：鉴权（整体替换） */
  router.put('/:id', requireAuth, adminLimiter, async (req, res) => {
    try {
      const id = req.params.id;
      const item = req.body;
      if (!item || typeof item !== 'object') {
        return res.status(400).json({ error: '请求体必须是对象' });
      }
      item.id = id;

      const coll = getColl();
      const idx = coll.findIndex((r) => r.data.id === id);
      if (idx < 0) {
        return res.status(404).json({ error: '不存在' });
      }

      if (collectionName !== 'tools') item.updatedAt = new Date().toISOString();
      coll[idx].data = item;
      await flush();

      await logAction({
        action: 'update',
        targetType,
        targetId: id,
        detail: { name: item.name || item.title },
        ip: getRequestIp(req),
        userAgent: req.headers['user-agent'],
      });

      res.json(item);
    } catch (e) {
      console.error(`[${collectionName}] update error:`, e);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  /** 删除：鉴权 */
  router.delete('/:id', requireAuth, adminLimiter, async (req, res) => {
    try {
      const id = req.params.id;
      const coll = getColl();
      const idx = coll.findIndex((r) => r.data.id === id);
      if (idx < 0) {
        return res.status(404).json({ error: '不存在' });
      }

      const item = coll[idx].data;
      coll.splice(idx, 1);
      await flush();

      await logAction({
        action: 'delete',
        targetType,
        targetId: id,
        detail: { name: item.name || item.title },
        ip: getRequestIp(req),
        userAgent: req.headers['user-agent'],
      });

      res.json({ ok: true, id });
    } catch (e) {
      console.error(`[${collectionName}] delete error:`, e);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  /** 批量排序：鉴权 */
  router.post('/reorder', requireAuth, adminLimiter, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: '需要 ids 数组' });
      }
      const coll = getColl();
      ids.forEach((id, idx) => {
        const row = coll.find((r) => r.data.id === id);
        if (row) row._order = idx + 1;
      });
      await flush();

      await logAction({
        action: 'reorder',
        targetType,
        detail: { count: ids.length },
        ip: getRequestIp(req),
        userAgent: req.headers['user-agent'],
      });

      res.json({ ok: true, count: ids.length });
    } catch (e) {
      console.error(`[${collectionName}] reorder error:`, e);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  return router;
}

export default createCrudRouter;
