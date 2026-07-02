/**
 * Vercel Serverless 入口 —— 导入 Express 应用
 *
 * Vercel 自动将 /api/* 请求路由到此文件
 * Express 应用定义在 server/src/index.js
 */
import app from '../server/src/index.js';

export default app;
