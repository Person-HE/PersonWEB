/**
 * 初始化脚本 —— 创建管理员账号
 *
 * 用法：npm run init
 *
 * 会读取 .env 中的 ADMIN_USERNAME 和 ADMIN_INITIAL_PASSWORD，
 * 哈希后写入 users。如果用户已存在则跳过。
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import readline from 'node:readline';
import { db, flush } from './db.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

async function main() {
  console.log('===== 初始化管理员账号 =====\n');

  let username = process.env.ADMIN_USERNAME || '';
  let password = process.env.ADMIN_INITIAL_PASSWORD || '';

  if (!username) {
    username = await question('请输入管理员用户名: ');
  }
  if (!password) {
    password = await question('请输入管理员密码（至少 8 位）: ');
  }

  if (!username || !password) {
    console.error('❌ 用户名和密码不能为空');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('❌ 密码至少 8 位');
    process.exit(1);
  }

  // 检查是否已存在
  const exist = db.data.users.find((u) => u.username === username);
  if (exist) {
    console.log(`⚠️  用户 "${username}" 已存在，跳过创建`);
    console.log('   如需重置密码，请删除 data/db.json 后重新运行 init');
    rl.close();
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 12);
  const id = db.data.users.reduce((m, u) => Math.max(m, u.id || 0), 0) + 1;
  db.data.users.push({
    id,
    username,
    passwordHash: hash,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    lastLoginIp: null,
  });
  await flush();

  console.log(`\n✅ 管理员账号创建成功`);
  console.log(`   用户名: ${username}`);
  console.log(`   ⚠️  请牢记密码，无法找回（仅能删除 data/db.json 重建）`);
  console.log(`\n   现在可以运行: npm run seed   (从 JSON 导入数据)`);
  console.log(`   然后启动服务: npm run dev\n`);

  rl.close();
}

main().catch((e) => {
  console.error('初始化失败:', e);
  process.exit(1);
});
