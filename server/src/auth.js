/**
 * 鉴权模块 —— JWT + bcrypt + IP 白名单 + 限流
 *
 * 安全设计：
 * 1. 密码用 bcrypt 哈希（cost=12），数据库不存明文
 * 2. JWT 短有效期（默认 8h），Authorization: Bearer 下发
 * 3. IP 白名单：仅允许配置的 IP 登录（双重保护）
 * 4. 登录限流：单 IP 10 分钟内最多 5 次失败尝试
 * 5. 全局速率限制：每 IP 每分钟 100 次
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { getCollection, setCollection } from './db.js';
import { logAction } from './logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env-please';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const ALLOWED_IPS = (process.env.ALLOWED_IPS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

/** 获取请求真实 IP（含代理穿透） */
export function getRequestIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff) return xff.split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

/** 检查 IP 是否在白名单（空名单表示不限制） */
export function isIpAllowed(ip) {
  if (ALLOWED_IPS.length === 0) return true;
  return ALLOWED_IPS.includes(ip);
}

/** 登录限流：每 IP 10 分钟最多 5 次 */
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getRequestIp(req),
  handler: (req, res) => {
    res.status(429).json({ error: '登录尝试过于频繁，请 10 分钟后再试' });
  },
});

/** 全局 API 限流：每 IP 每分钟 100 次 */
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getRequestIp(req),
  handler: (req, res) => {
    res.status(429).json({ error: '请求过于频繁，请稍后再试' });
  },
});

/** 管理接口限流：每 IP 每分钟 60 次（写操作更严格） */
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getRequestIp(req),
  handler: (req, res) => {
    res.status(429).json({ error: '操作过于频繁，请稍后再试' });
  },
});

/**
 * 登录验证
 */
export async function verifyLogin(username, password, ip, userAgent) {
  // 1. IP 白名单检查
  if (!isIpAllowed(ip)) {
    await logAction({
      action: 'login_failed',
      targetType: 'user',
      detail: { reason: 'ip_not_allowed', ip, username },
      ip,
      userAgent,
    });
    return { ok: false, error: '当前 IP 不在白名单内' };
  }

  // 2. 查询用户
  const users = await getCollection('users');
  const user = users.find((u) => u.username === username);
  if (!user) {
    await logAction({
      action: 'login_failed',
      targetType: 'user',
      detail: { reason: 'user_not_found', username },
      ip,
      userAgent,
    });
    return { ok: false, error: '用户名或密码错误' };
  }

  // 3. 校验密码
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    await logAction({
      action: 'login_failed',
      targetType: 'user',
      targetId: user.id,
      detail: { reason: 'wrong_password' },
      ip,
      userAgent,
    });
    return { ok: false, error: '用户名或密码错误' };
  }

  // 4. 签发 JWT
  const token = jwt.sign(
    { uid: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  // 5. 更新登录信息
  user.lastLoginAt = new Date().toISOString();
  user.lastLoginIp = ip;
  await setCollection('users', users);

  await logAction({
    action: 'login',
    targetType: 'user',
    targetId: user.id,
    detail: { username: user.username },
    ip,
    userAgent,
  });

  return {
    ok: true,
    token,
    user: { id: user.id, username: user.username },
  };
}

/**
 * JWT 鉴权中间件 —— 校验 Authorization: Bearer <token>
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: '未登录' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { uid, username, iat, exp }
    next();
  } catch (e) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}

/**
 * 修改密码
 */
export async function changePassword(userId, oldPassword, newPassword, ip, userAgent) {
  const users = await getCollection('users');
  const user = users.find((u) => u.id === userId);
  if (!user) return { ok: false, error: '用户不存在' };

  const ok = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!ok) {
    await logAction({
      action: 'password_change_failed',
      targetType: 'user',
      targetId: userId,
      detail: { reason: 'wrong_old_password' },
      ip,
      userAgent,
    });
    return { ok: false, error: '原密码错误' };
  }

  if (!newPassword || newPassword.length < 8) {
    return { ok: false, error: '新密码至少 8 位' };
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await setCollection('users', users);

  await logAction({
    action: 'password_change',
    targetType: 'user',
    targetId: userId,
    ip,
    userAgent,
  });

  return { ok: true };
}

export default {
  verifyLogin,
  requireAuth,
  changePassword,
  isIpAllowed,
  getRequestIp,
  loginLimiter,
  globalLimiter,
  adminLimiter,
};
