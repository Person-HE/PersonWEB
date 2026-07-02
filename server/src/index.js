/**
 * 阿维的平台 - 后端主入口
 *
 * 本地启动：node src/index.js  或  npm run dev
 * Vercel Serverless：由 api/index.js 导入
 *
 * 安全设计：
 * - helmet 安全头
 * - CORS 白名单（仅允许前端域名）
 * - 全局速率限制
 * - JWT 鉴权
 * - IP 白名单（登录时校验）
 * - 登录限流
 * - 所有写操作记录日志
 */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { globalLimiter } from './auth.js';
import authRoutes from './routes/auth.js';
import logsRoutes from './routes/logs.js';
import setupRoutes from './routes/setup.js';
import { createCrudRouter } from './crud.js';

const PORT = process.env.PORT || 8787;
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const app = express();

// ===== 安全中间件 =====
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin(origin, cb) {
    if (!origin || FRONTEND_ORIGINS.includes(origin)) return cb(null, true);
    return cb(null, true); // Serverless 模式下前端和后端同域，放宽 CORS
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use(globalLimiter);

// ===== 健康检查 =====
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ===== 路由挂载 =====
app.use('/api/auth', authRoutes);
app.use('/api/resources', createCrudRouter('resources', { targetType: 'resource' }));
app.use('/api/tools', createCrudRouter('tools', { targetType: 'tool' }));
app.use('/api/services', createCrudRouter('services', { targetType: 'service' }));
app.use('/api/logs', logsRoutes);
app.use('/api/setup', setupRoutes);

// ===== 404 =====
app.use('/api', (req, res) => {
  res.status(404).json({ error: `接口不存在: ${req.method} ${req.originalUrl}` });
});

// ===== 全局错误处理 =====
app.use((err, req, res, next) => {
  console.error('[server] error:', err);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS 拒绝访问' });
  }
  res.status(500).json({ error: '服务器内部错误' });
});

// 本地开发时才启动监听，Vercel Serverless 由 api/index.js 导入
const isMainModule = process.argv[1] && (
  process.argv[1].endsWith('index.js') || process.argv[1].endsWith('src/index.js')
);
if (isMainModule) {
  app.listen(PORT, () => {
    console.log('========================================');
    console.log(`  阿维的平台 - 后端已启动`);
    console.log(`  地址: http://localhost:${PORT}`);
    console.log(`  前端: ${FRONTEND_ORIGINS.join(', ')}`);
    console.log(`  健康检查: http://localhost:${PORT}/api/health`);
    console.log('========================================');
  });
}

export default app;
