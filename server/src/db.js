/**
 * 数据层 —— 直接导入 JSON 数据，无需外部数据库
 *
 * 数据源：public/data/*.json
 * Vercel 打包时会自动内联这些 JSON 文件
 * 数据只读，修改需更新 JSON 文件后重新部署
 */
import resourcesData from '../../public/data/resources.json' assert { type: 'json' };
import toolsData from '../../public/data/tools.json' assert { type: 'json' };
import servicesData from '../../public/data/services.json' assert { type: 'json' };

const collections = {
  resources: resourcesData.default || resourcesData,
  tools: toolsData.default || toolsData,
  services: servicesData.default || servicesData,
  users: [],
  logs: [],
};

/** 读取集合（返回包装为 { _order, data } 格式的数组） */
export async function getCollection(name) {
  const raw = collections[name];
  if (!raw) return [];
  if (raw.length > 0 && raw[0]._order !== undefined) return raw;
  return raw.map((item, idx) => ({
    _order: idx + 1,
    data: item,
  }));
}

/** 写入集合（仅运行时有效，Serverless 冷启动后重置） */
export async function setCollection(name, data) {
  collections[name] = data;
}

/** 自增 ID（运行时计数，冷启动后重置） */
let seqCounters = {};
export async function nextId(name) {
  if (!seqCounters[name]) seqCounters[name] = 0;
  return ++seqCounters[name];
}

/** 按 _order 升序排列并提取 data 字段 */
export function ordered(list) {
  return [...list]
    .sort((a, b) => (a._order || 0) - (b._order || 0))
    .map((item) => item.data);
}