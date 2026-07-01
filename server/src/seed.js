/**
 * 种子脚本 —— 从前端 public/data/*.json 导入数据到 lowdb
 *
 * 用法：npm run seed
 *
 * 行为：
 * - 如果表非空，跳过该表（不覆盖已有数据）
 * - 如果表为空，从对应的 JSON 文件导入
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, flush } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DATA_DIR = path.resolve(__dirname, '../../public/data');

/** 读取 JSON 文件 */
function readJson(file) {
  const full = path.join(FRONTEND_DATA_DIR, file);
  if (!fs.existsSync(full)) {
    console.warn(`⚠️  文件不存在: ${full}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(full, 'utf-8'));
}

/** 导入一张表 */
async function importTable(collectionName, fileName) {
  if (db.data[collectionName].length > 0) {
    console.log(`⏭️  ${collectionName} 已有 ${db.data[collectionName].length} 条数据，跳过`);
    return;
  }

  const list = readJson(fileName);
  if (list.length === 0) {
    console.log(`⏭️  ${collectionName} 源文件为空，跳过`);
    return;
  }

  list.forEach((item, idx) => {
    if (!item.id) {
      console.warn(`⚠️  ${collectionName} 第 ${idx + 1} 条缺 id，自动生成`);
      item.id = `${collectionName}-${idx + 1}`;
    }
    db.data[collectionName].push({ _order: idx + 1, data: item });
  });

  await flush();
  console.log(`✅ ${collectionName}: 导入 ${list.length} 条`);
}

console.log('===== 从 JSON 导入数据 =====\n');
console.log(`数据源: ${FRONTEND_DATA_DIR}\n`);

await importTable('resources', 'resources.json');
await importTable('tools', 'tools.json');
await importTable('services', 'services.json');

console.log('\n✅ 导入完成');
console.log('   现在可以启动服务: npm run dev\n');

process.exit(0);
