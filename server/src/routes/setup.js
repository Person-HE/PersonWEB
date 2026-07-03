/**
 * 健康检查 —— 确认 Serverless 函数正常运行
 */
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const SETUP_KEY = process.env.SETUP_KEY;
    if (!SETUP_KEY || req.query.key !== SETUP_KEY) {
      return res.status(403).json({ error: '密钥错误' });
    }

    res.json({
      message: 'Serverless API 运行正常',
      hint: '数据从 JSON 文件加载，无需初始化。如需更新数据，修改 public/data/*.json 后重新部署。',
      env: {
        JWT_SECRET: process.env.JWT_SECRET ? '已配置' : '未配置',
        ADMIN_USERNAME: process.env.ADMIN_USERNAME || '未配置',
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;