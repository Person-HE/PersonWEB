/**
 * 鉴权路由 —— 登录 / 登出 / 修改密码 / 当前用户信息
 */
import { Router } from 'express';
import {
  verifyLogin,
  changePassword,
  requireAuth,
  loginLimiter,
  getRequestIp,
} from '../auth.js';
import { logAction } from '../logger.js';

const router = Router();

/** 登录 */
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: '请输入用户名和密码' });
    }

    const ip = getRequestIp(req);
    const userAgent = req.headers['user-agent'];

    const result = await verifyLogin(username, password, ip, userAgent);
    if (!result.ok) {
      return res.status(401).json({ error: result.error });
    }

    res.json({
      token: result.token,
      user: result.user,
    });
  } catch (e) {
    console.error('[auth] login error:', e);
    res.status(500).json({ error: '服务器错误' });
  }
});

/** 登出（仅记录日志，JWT 是无状态的，前端删除 token 即可） */
router.post('/logout', requireAuth, (req, res) => {
  logAction({
    action: 'logout',
    targetType: 'user',
    targetId: req.user.uid,
    detail: { username: req.user.username },
    ip: getRequestIp(req),
    userAgent: req.headers['user-agent'],
  });
  res.json({ ok: true });
});

/** 当前登录用户信息 */
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: { id: req.user.uid, username: req.user.username },
  });
});

/** 修改密码 */
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body || {};
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: '请输入原密码和新密码' });
    }
    const result = await changePassword(
      req.user.uid,
      oldPassword,
      newPassword,
      getRequestIp(req),
      req.headers['user-agent'],
    );
    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ ok: true });
  } catch (e) {
    console.error('[auth] change-password error:', e);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
