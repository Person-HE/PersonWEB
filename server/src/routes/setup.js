/**
 * 首次部署初始化 —— 创建管理员 + 导入种子数据
 *
 * 访问方式：GET /api/setup?key=你的SETUP_KEY
 *
 * 安全措施：
 * - 需要 SETUP_KEY 环境变量匹配才能执行
 * - 初始化完成后可从 Vercel 环境变量中删除 SETUP_KEY
 */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCollection, setCollection } from '../db.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** 尝试从多个路径读取 JSON 文件 */
function tryReadJson(relativePath) {
  const candidates = [
    path.resolve(__dirname, '../../..', relativePath),       // server/src/routes -> project root
    path.resolve(process.cwd(), relativePath),                // 当前工作目录
    path.resolve(process.cwd(), 'public', relativePath),      // public/ 子目录
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf-8'));
      }
    } catch (e) {
      console.warn(`读取失败: ${p}`, e.message);
    }
  }
  return [];
}

router.get('/', async (req, res) => {
  try {
    const SETUP_KEY = process.env.SETUP_KEY;
    if (!SETUP_KEY) {
      return res.status(403).json({ error: 'SETUP_KEY 环境变量未配置，无法执行初始化' });
    }
    if (req.query.key !== SETUP_KEY) {
      return res.status(403).json({ error: '密钥错误' });
    }

    const results = {};

    // ===== 1. 创建管理员账号 =====
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_INITIAL_PASSWORD || 'admin123456';

    const users = await getCollection('users');
    const existing = users.find(u => u.username === username);
    if (existing) {
      results.admin = `已存在，跳过 (用户名: ${username})`;
    } else {
      const hash = await bcrypt.hash(password, 12);
      const id = users.reduce((m, u) => Math.max(m, u.id || 0), 0) + 1;
      users.push({
        id,
        username,
        passwordHash: hash,
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
        lastLoginIp: null,
      });
      await setCollection('users', users);
      results.admin = `创建成功 (用户名: ${username})`;
    }

    // ===== 2. 导入种子数据 =====
    const seedFiles = [
      { collection: 'resources', file: 'public/data/resources.json' },
      { collection: 'tools', file: 'public/data/tools.json' },
      { collection: 'services', file: 'public/data/services.json' },
    ];

    for (const { collection, file } of seedFiles) {
      const existing = await getCollection(collection);
      if (existing.length > 0) {
        results[collection] = `已有 ${existing.length} 条数据，跳过`;
        continue;
      }

      const data = tryReadJson(`data/${collection}.json`);
      if (data.length === 0) {
        // 再试 public/data/ 前缀
        const data2 = tryReadJson(file);
        if (data2.length === 0) {
          results[collection] = '源文件为空或不存在，跳过';
          continue;
        }
        const wrapped = data2.map((item, idx) => ({
          _order: idx + 1,
          data: item.id ? item : { ...item, id: `${collection}-${idx + 1}` },
        }));
        await setCollection(collection, wrapped);
        results[collection] = `导入 ${wrapped.length} 条`;
        continue;
      }

      const wrapped = data.map((item, idx) => ({
        _order: idx + 1,
        data: item.id ? item : { ...item, id: `${collection}-${idx + 1}` },
      }));
      await setCollection(collection, wrapped);
      results[collection] = `导入 ${wrapped.length} 条`;
    }

    res.json({
      message: '初始化完成',
      results,
      hint: '初始化成功后，建议从 Vercel 环境变量中删除 SETUP_KEY',
    });
  } catch (e) {
    console.error('[setup] error:', e);
    res.status(500).json({ error: '初始化失败: ' + e.message });
  }
});

export default router;
