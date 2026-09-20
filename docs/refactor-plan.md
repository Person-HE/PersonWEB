# PersonWEB 个人 IP 网站重构方案

> 版本：v1.0（2026-09-20）
> 目标：把"阿维的平台"（AI 工具导航站气质）重构为**可验证、可信任、可成交**的个人 IP 网站——作品集 + 能力证明 + 接单转化，并与博客（person-he.github.io）和 GitHub（Person-HE）做**数据级串联**，不是挂链接。
> 本文档所有"现状"均基于代码实测（含文件行号），所有"效果"均给出可验收指标。

---

## 一、现状盘点（实测）

### 1.1 技术栈与结构

| 层 | 现状 |
|---|---|
| 前端 | React 18 + Vite 6 + Tailwind + GSAP + react-router v7，**纯 CSR**（`src/App.tsx:2`） |
| 后端 | 双轨并存：Cloudflare Pages Functions（`functions/api/`，数据在 Workers KV，JWT 鉴权）＋遗留 Express（`server/src/`，只读 JSON、写入仅内存） |
| 数据 | `src/store/useDataStore.ts:39-51` API 优先、失败回落 `/data/*.json`（resources 为空数组、tools 37 条、services 17 条） |
| 部署 | `wrangler.jsonc` 仅 3 行，**无 kv_namespace / 无 crons / 无 vars 声明**——KV 与密钥全靠 Pages 面板手工配置，属事故隐患 |
| SEO | `index.html:7-12` 仅 title/description/og:type；**无 og:image、canonical、sitemap、robots、JSON-LD**；标题靠运行时 `useDocumentTitle`（`src/App.tsx:31-57`） |
| 主题 | 两套语言互相矛盾：`tailwind.config.js:6-33` 仍是旧"手绘纸质"（paper/ink/ZCOOL 字体），实际生效是 `src/index.css` 的"Cyber Glitch Brutalism v2"（#0a0a0a 底 + #CCFF00 荧光绿 + Bebas Neue/Space Mono），类名却还叫 `hand-*` |

### 1.2 页面现状（从上到下）

- **Home**（616 行）：Hero / Marquee / 痛点 / 招牌成果 / 能力矩阵 / 真实数据 / CTA——文案全部硬编码常量（`HERO_METRICS:29`、`CAPABILITY_CARDS:58`、`BIG_STATS:100`），**没有任何指向 GitHub/博客/Demo 的外链**。
- **Resources / ResourceDetail**：分类 Tab + 搜索 + 网盘外链 + 提取码复制 + 截图/视频/Demo 外链。功能完整，是现有转化主力，保留。
- **Navigation**：工具导航（`src/constants/index.ts:9 TOOL_CATEGORIES`），SEO 引流页，保留。
- **Services / ServiceDetail**：字段 schema 已相当商业成熟（price、priceRange、guarantee、delivery、caseStudy、maintenancePeriod 全有，`src/admin/config.tsx:137-191`），缺的是**报价表单转化闭环**和信任证据。
- **Enterprise**：文案全在 `src/constants/index.ts:76-108` 硬编码。
- **About**（319 行）：**零 API 全硬编码**，三张二维码 + 平台列表；`siteConfig.githubUrl` 和所有自媒体链接（`src/config/site.config.ts:29-37`）**是空串→按钮根本不渲染**——GitHub/博客串联的坑早就留好了。
- **Navbar/Footer**（`Navbar.tsx:8-15`）：首页/资源/导航/服务/企业/关于，无作品集入口。

### 1.3 站外资产（串联对象）

| 资产 | 实测数据 | 结论 |
|---|---|---|
| GitHub Person-HE | 13 个公开仓库，**全部 0 star** | star 不能当信任锚点，改用"在线 Demo + 活数据" |
| 在线 Demo | filecut.pages.dev / nanoedit-pro / webcreate / note-plan-bwm（4 个，全部 Cloudflare Pages 免费层） | **最硬的能力证据**，必须站内直嵌 |
| Hexo 博客 | ~10 篇技术文（JMeter/RabbitMQ/Transformer/Agent Harness/多线程/架构设计），**无 RSS 无 sitemap** | 先补 `hexo-generator-feed`，否则拉不了数据 |
| 博客仓库 | `Person-HE/Person-HE.github.io` 公开 | 可用 api.github.com 读 `_posts` 做兜底 |

### 1.4 品牌分裂（重构前必须终结）

当前三个身份并存：站点"阿维的平台"、自媒体"阿维AI实验室"、GitHub/博客"Person-HE / HE"。访客在三处看到的是三个人。

**决策（待确认，全部走配置不改代码）**：主 IP 名沿用 **「阿维」**，技术账号 **Person-HE** 作为"阿维的 GitHub"，三处互相指认同一人。JSON-LD `Person` 的 `sameAs` 写进机器可读的身份证。若你想换名，只改 `site.config.ts` 一处。

---

## 二、重构目标与原则

1. **人先行**：首页第一屏回答"你是谁 + 能帮我解决什么 + 证据在哪"。
2. **三角互证**：产品（Demo 直接试用）× 思考（博客文章）× 代码（GitHub 具体文件直达）互相引用，形成证据网。
3. **数据级串联**：作品集/博客/统计全部 API 实时驱动，发博客/推代码后网站**零手工更新**自动变化。
4. **转化收口**：每条流量路径终点是"加微信"或"提交需求表单"，二选一，不允许多 CTA 稀释。
5. **诚实红线**：不造假数据、不虚构证言、不用假紧迫感；0 star 项目不展示 star 数，展示"可直接使用"。
6. **零成本约束**：只用 Cloudflare 免费层（Pages/Functions/KV/Cron Trigger/Email Routing/R2）。

---

## 三、目标信息架构

```
/                    首页（人先行 + 实时信任数据栏）
/portfolio           作品集中心（GitHub live 卡片）        【新增】
/portfolio/:slug     项目案例页 ×7（证据模板页）           【新增】
/blog                博客聚合流（Hexo feed 实时拉取）      【新增】
/resources /resources/:id      资源中心（保留，小改）
/navigation                    AI 导航（保留，SEO 引流）
/services /services/:id        服务中心（加报价表单）
/enterprise                    企业服务（文案迁入 CMS）
/about                         人物页（时间线 + 活数据）
/contact                       需求表单页 = quote 弹窗的整页版 【新增】
/admin/*                       后台（保留，加 portfolio 管理）
```

Navbar 调整为：**首页 · 作品集 · 服务 · 资源 · 导航 · 关于**（企业服务降级为服务页内的强引导块 + 页脚入口，Enterprise 路由保留）。作品集必须排第二位——它是转化链路的信任核心。

---

## 四、数据层重构（串联的地基）

### 4.1 新增 `/api/github`（活数据只读缓存）

```
CF Cron Trigger（每小时）
  → functions/cron.ts 拉 api.github.com：
      GET /users/Person-HE                    （profile：repo数/粉丝/注册时间）
      GET /users/Person-HE/repos?sort=updated （13 仓库元数据）
      GET /users/Person-HE/events/public      （近 90 天 push 事件→活跃度）
  → 写 KV `github:snapshot`（TTL 24h）
GET /api/github → 读 KV，带 ETag，前端一次拿全
```

- 为什么服务端拉：前端直连 api.github.com 未认证限 60 次/时/IP，访客一多必挂；服务端集中 + KV 缓存后 GitHub API 调用量 = 24 次/天。
- `wrangler.jsonc` 补齐声明（消灭"面板手工配置"）：

```jsonc
{
  "kv_namespaces": [{ "binding": "CONTENT", "id": "<现有KV>" }],
  "triggers": { "crons": ["0 * * * *"] },
  "vars": { "GH_USER": "Person-HE" },
  "compatibility_date": "2025-01-01"
}
```
（secrets：`GH_TOKEN`（免费 PAT，配额 5000/时）、`JWT_SECRET`、`SETUP_KEY` 用 `wrangler secret put`。）

### 4.2 新增 `/api/blog`

- 博客仓库（`Person-HE.github.io`）加两个插件：`hexo-generator-feed`、`hexo-generator-sitemap` → 发布 `/atom.xml` 与 `/sitemap.xml`。
- Cron 同步拉 atom.xml → 解析成 JSON 写 KV `blog:posts`（title/link/date/摘要，保留最近 30 篇）。
- 兜底：atom 解析失败时改读 GitHub raw 的 `_posts/*.md` frontmatter。
- **验收**：在 Hexo 发一篇新文章，≤1 小时后 `/blog` 页和首页"最新文章"自动出现。

### 4.3 新增 `/api/quote`（需求表单）

- `POST /api/quote`：name + contact + 服务类型 + 预算区间 + 需求描述 → 写 KV `quotes`（后台可查）+ 通过 **Cloudflare Email Routing** 免费转发到你的邮箱。
- 防滥用：复用 `_helper.ts` 已有 rate-limit 思路 + honeypot 字段；不落任何敏感信息（需求描述限 2000 字）。

### 4.4 现有后端收拾

| 问题 | 处置 |
|---|---|
| `server/`（遗留 Express，写入内存即丢） | **整体删除**，README 留一段"为何废弃" |
| `wrangler.jsonc` 无绑定声明 | 4.1 补齐，绑定即代码（config-as-code） |
| `seed.ts` 默认密码 admin123456 | 部署后立即 `change-password`；seed 加一次性锁（seed 后置 KV 标记拒跑） |
| resources.json 回落数据为空数组 | 构建期由 KV 导出生成静态兜底 JSON，消除"API 挂了资源页全白" |
| 日志只裁 500 条 | 保留（个人站够用），不动 |

### 4.5 新增 admin：portfolio 集合

案例页内容**不硬编码**，走现有 CRUD 体系（`createCrudHandlers`）：

`portfolio` 字段（`src/admin/config.tsx` 新增，沿用现有 FieldType）：
```
slug, name, tagline, status(已上线/维护中/归档),
repo(仓库名), demoUrl, category(web-app/electron/cli/java),
coverImage, gallery, techStack(tags), role, period,
problem( textarea ), solution( textarea ), highlights(json: [{title,desc}]),
decisions(json: [{question,choice,reason}]),   ← 技术决策，最能建立"这人想得清楚"
metrics(json: [{label,value,source}]),        ← 必须有出处（如"131 条预渲染路由 / build 日志"）
relatedPosts(json: [{title,url}]),            ← 关联博客文章
relatedFiles(json: [{label,repoPath}]),       ← 代码直达（链到具体文件非仓库首页）
ctaService(关联服务id), sort, published
```
初版 7 条：filecut / jimu-mg / webcreate / AutoEdit / Note-Plan / zhiyuanFlow(前后端合一) / PersonWEB 自身。

---

## 五、逐页重构规格

### 5.1 Home —— "人先行"改造

| 区块（自上而下） | 现状 | 重构后 |
|---|---|---|
| Hero | 硬编码口号 | **`全栈开发者 阿维（Person-HE）`** + 一句话定位 + 双 CTA［看作品集］［加微信聊需求］+ 头像/实拍区 |
| **信任数据栏【新】** | 无 | 实时数字：`n 个开源项目 · n 个在线产品 · n 篇技术文章 · 最近提交 x 天前`——全部来自 `/api/github`+`/api/blog`，**消灭 HERO_METRICS/BIG_STATS 硬编码常量**（`Home.tsx:29,100`） |
| 精选案例 | "招牌成果"静态卡 | 从 `/api/portfolio?featured=true` 取 3 条，卡上带 live 徽章（在线 Demo 状态点）+［直接试用］按钮 |
| 能力矩阵 | 硬编码 | 保留结构，每格加证据链（"Electron → Note-Plan 案例页"） |
| 最新文章【新】 | 无 | `/api/blog` 取 3 篇，跳博客 |
| Marquee/痛点/CTA | 保留 | Marquee 词条改为混入项目名；痛点区保留（写得不错） |

### 5.2 `/portfolio` 作品集中心

- 顶部：一句话 + 筛选（按 category/status）。
- 卡片网格：名称、tagline、技术栈徽章、**实时"最后更新 x 天前"**（`/api/github` 按 repo 名匹配）、［案例详情］主按钮、［打开 Demo］次按钮（有 demoUrl 才显示）、［GitHub 源码］角标。
- 排序：featured → 最近更新。**不显示 star 数**（0 star 诚实红线），显示 commit 活跃度替代。

### 5.3 `/portfolio/:slug` 案例页（转化核心，统一模板）

```
头图+tagline+状态徽章 → [在线 Demo 内嵌区]（iframe 悬浮试用窗，移动端降级为"打开"按钮）
→ 挑战(problem) → 方案(architecture 图) → 关键技术决策(decisions，含博客文章深链)
→ 成果数据(metrics，每项带出处) → 代码直达(relatedFiles → 具体文件路径)
→ 关联文章(relatedPosts) → 底部 CTA："需要类似的东西？[获取报价] [加微信]"
JSON-LD: SoftwareApplication + Article 关联
```
每页同时是接单着陆页：ctaService 把"看完心动"直接接回服务报价。

### 5.4 `/blog` 博客聚合

- 时间线列表（标题/日期/摘要/分类），点开跳 person-he.github.io 原文（**内容主体留在 Hexo，不搬家**——避免双站维护）。
- 侧栏：按标签云 + "我写博客是为了把问题想清楚"人格化说明。
- 与 about 页时间线互链。

### 5.5 Services / ServiceDetail / contact

- Services 页：`SERVICE_SECTIONS`（`Services.tsx:13`）迁入 admin 可编辑；每张服务卡价格区间已有字段（priceRange/guarantee），**前台突出显示**＋"交付物/修改次数/售后期"三行透明化。
- ServiceDetail CTA 区（`ServiceDetail.tsx:513`）：微信弹窗保留，**旁边加［提交需求表单(预填本服务)］**——先表单后微信，加微时你已知需求，沟通成本减半。
- `/contact`：整页报价表单（服务类型下拉、预算区间、工期期望），成功页引导加微信（备注场景复用 `wechatScenes`）。

### 5.6 About → 人物页

- 从二维码堆改成：**故事（为什么叫阿维=Person-HE，同一个人指认）→ 时间线（入学→第一个项目→……→当前，数据源 portfolio+blog）→ 技术栈矩阵（带案例深链）→ 数字足迹（活数据）→ 三码区保留在底部**。
- `siteConfig.githubUrl:'https://github.com/Person-HE'`、博客 URL 填入（现在空串导致按钮不渲染的 bug 顺手修掉，`Footer.tsx:64-96`）。

### 5.7 全局组件

| 新增组件 | 职责 |
|---|---|
| `TrustBar` | 首页实时数据栏（带加载骨架屏，API 失败回落静态值并标注截至日期） |
| `GithubBadge/RepoCard` | 活数据徽章/仓库卡 |
| `BlogFeed` | 博客文章流（首页/关于页复用） |
| `DemoFrame` | iframe 悬浮试用窗（含"在新标签打开"逃逸口） |
| `QuoteForm/QuoteModal` | 报价表单（服务页/contact/案例页三处复用） |
| `Seo` | `<Seo title desc canonical jsonLd ogImage/>` 统一注入 head |

---

## 六、SEO / 可发现性重构

纯 CSR 是 SEO 的天花板（爬虫拿不到内容），本项目**不追求全站 SSR**，采用务实两档：

1. **P1 低成本（必做）**：`public/robots.txt` + 构建后生成 `sitemap.xml`（含 portfolio/blog 静态路由清单）；每页 `useDocumentTitle` 扩展为完整 head 管理（canonical/description）；JSON-LD：`Person`（name + url + sameAs: [GitHub, 博客]——**机器可读的身份指认**）注入首页/about，`SoftwareApplication` 注入案例页，`Article` 注入博客卡；OG 封面图（每案例一张 1200×630）。
2. **P2 预渲染（视流量决定）**：复用 FileCut 已验证的 Playwright 预渲染路线（本机 `pw-tools/` 已存在），把 7 个案例页 + 6 个静态页烘成 HTML 随部署上传。**教训沿用**：Pages 若 Git-connected，push 会覆盖预渲染产物——PersonWEB 部署流程直接定为"本地 build→wrangler 上传"，不留 Git 自动构建，避免重蹈 FileCut 的坑（其 git push 会静默回退为 6KB 壳）。
3. **站外反链**：博客 Hexo about 页挂 Demo 合集指回本站；案例文章同步发布掘金/dev.to 带原文链接；GitHub 各仓库 README 顶部加"在线体验 →"指到 `/portfolio/:slug`。GitHub HTTPS git 被墙不影响（README 走 SSH push，内容纯外链文本）。

---

## 七、主题统一（技术债清理）

- 承认现实：`src/index.css` 的暗底荧光绿赛博粗野风已实际生效且完成度高 → **定为唯一主题**。
- `tailwind.config.js:6-33` 旧纸质色板和 `hand-*` 命名：**批量改名**为 `--ac-*` 语义令牌（accent/surface/line 等），删死代码，防下任一次维护被两套系统误导。字体维持 Bebas Neue + Space Mono + Noto Sans SC。
- 荧光绿在"信任感"上偏激进：案例页正文区降饱和（荧光色只用于 CTA 和数据高亮），保持个性但不干扰阅读。

---

## 八、实施计划（文件级）

| 阶段 | 任务 | 涉及文件 | 验收标准（可测） |
|---|---|---|---|
| **P0 地基**（0.5d） | 品牌名确认；wrangler 绑定声明；删 `server/`；GitHub/博客 URL 填入 siteConfig；seed 一次性锁 | `wrangler.jsonc`、`src/config/site.config.ts`、`server/`、`functions/api/seed.ts` | `npx wrangler pages dev` 本地全通；空串按钮恢复渲染 |
| **P1 数据串联**（2d） | cron 快照 `/api/github`、`/api/blog`；TrustBar/RepoCard/BlogFeed 组件；首页改造；`/portfolio` 列表页 | `functions/cron.ts`、`functions/api/github.ts`、`functions/api/blog.ts`、`src/components/*`、`src/pages/Home.tsx`、`src/pages/Portfolio.tsx` | Hexo 发文 1h 内出现在 /blog；TrustBar 数字与 api.github.com 实测一致；首页 0 处硬编码统计 |
| **P2 血肉**（2-3d） | portfolio 集合 CRUD + admin；7 个案例详情页（含 DemoFrame/代码直达/关联文章）；about 人物页 | `src/admin/config.tsx`、`functions/api/portfolio/`、`src/pages/PortfolioDetail.tsx`、`src/pages/About.tsx` | 7 条案例全部含 demo/代码/文章三类深链各≥1；Navbar 六项可达无死链 |
| **P3 转化+SEO**（2d） | `/api/quote` + Email Routing + QuoteForm；三处 CTA 接入；robots/sitemap/head 重构/JSON-LD/OG 图；主题令牌改名 | `functions/api/quote.ts`、`src/components/QuoteForm.tsx`、`src/components/Seo.tsx`、`index.html`、`tailwind.config.js` | 提交表单→邮箱收到信；sitemap 覆盖全部路由；Rich Results Test 通过 Person+SoftwareApplication |
| **P4 飞轮**（持续） | 掘金/dev.to 同步；P2 预渲染（若搜索流量>100/天再上）；素材二维码补齐后填 siteConfig | 站外为主 | 每月：新作品→案例页→博客文→反链 四件套闭环一次 |

依赖关系：P1 依赖 P0 的 KV/secret 声明；P2 案例页依赖 P1 的 github 快照；P3 可并行。

---

## 九、重构完成后的网站（效果全景）

**访客视角的第一次访问剧本（30 秒）**：打开首页 → 第一屏看到"全栈开发者 阿维"+ 一行实时数字（7 个开源项目 · 4 个在线产品 · 10 篇技术文章 · 最近提交 2 天前，全是活的）→ 点"浏览器 PDF 工具"案例 → 页面里直接划开 FileCut 试用了 1 分钟 → 往下看到技术决策"为什么放弃 Web Worker 改用 SharedArrayBuffer"和对应博客文章 → 点"代码直达"进了真实的 .ts 文件 → 底部［获取报价］填了需求 → 弹出微信二维码"已收到，加微信备注 xx 聊细节"。

**这一天你没有手工更新过任何一处数字。**

**三个月后的复利状态（机制保证，不承诺结果）**：

- 每个案例页是一个关键词着陆页，Google 可索引（sitemap+OG+JSON-LD+反链），自然搜索开始进人；
- 微信好友列表里的人加进来时**你已经知道他要什么**（表单预填）；
- `quotes` 集合是需求数据库：什么服务被问得多、预算集中在哪个区间，后台日志直接回答——定价有据；
- 博客↔案例↔仓库三向链接织成网：任何一条内容（一篇掘金文章、一个仓库 star、一次 Demo 迭代）都在给另外两条引流；
- 资源下载 → 加微信 → 看作品集 → 报价，漏斗每一级都有数据可数。

**明确不做**：不做会员/评论/多作者（后台 admin 保持单人）；不做全站 SSR（预渲染是流量验证后的可选项）；不做假社会证明；不把博客内容搬家（聚合引用，源头留在 Hexo）。

## 十、风险与诚实限制

| 风险 | 缓解 |
|---|---|
| api.github.com 配额/抖动 | cron 集中拉取 + KV TTL 24h + 前端失败回落静态值（标注"数据截至 x 日"） |
| Hexo 未装 feed 插件前 `/api/blog` 无数据 | 先走 raw `_posts` 兜底；P1 第一任务就是提博客仓库的插件 PR |
| Demo 站（其他 pages.dev）挂了连带案例页显丑 | DemoFrame 带健康探测，失败降级为"查看介绍"卡片 |
| Email Routing 只收不发的单向通知 | 够用（通知自己）；将来要自动回复再评估 Resend 免费层 |
| 0 star 现实无法短期改变 | 已通过"不展示 star、展示活跃度与在线产品"绕开；这不是缺陷而是事实，网站卖的是"能做出可用软件的人" |

---

*执行入口：确认品牌名（默认沿用「阿维」）后，从 P0 开始按表推进；每阶段完成后用本机 `npx wrangler pages dev` + curl 验证验收指标。*
