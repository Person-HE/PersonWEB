/**
 * 活数据同步模块 —— GitHub 仓库快照 + 博客文章目录
 *
 * 单一职责：从公开 API 拉取 → 归一化 → 写 KV。
 * 由 functions/cron.ts（定时）与手动刷新端点共用，保证逻辑只有一份。
 *
 * KV 键：
 *   live:github → GithubSnapshot
 *   live:blog   → BlogFeed
 */
import type { GithubSnapshot, BlogFeed, RepoInfo, BlogPost } from '../src/types';
import type { Env } from './_helper';

export const KV_GITHUB = 'live:github';
export const KV_BLOG = 'live:blog';

const GH_USER_DEFAULT = 'Person-HE';
const BLOG_REPO_DEFAULT = 'Person-HE/Person-HE.github.io';
const BLOG_BASE_DEFAULT = 'https://person-he.github.io/';

function ghHeaders(env: Env): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'personweb-cron',
  };
  if (env.GH_TOKEN) h.Authorization = `Bearer ${env.GH_TOKEN}`;
  return h;
}

async function ghJson<T>(url: string, env: Env): Promise<T> {
  const resp = await fetch(url, { headers: ghHeaders(env) });
  if (!resp.ok) throw new Error(`GitHub API ${resp.status}: ${url}`);
  return (await resp.json()) as T;
}

/** 拉取 GitHub 用户与全部公开仓库，计算最近提交距今天数 */
export async function refreshGithub(env: Env): Promise<GithubSnapshot> {
  const user = env.GH_USER || GH_USER_DEFAULT;
  const [profile, repos] = await Promise.all([
    ghJson<any>(`https://api.github.com/users/${user}`, env),
    ghJson<any[]>(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`, env),
  ]);

  const list: RepoInfo[] = repos
    .filter(r => !r.fork)
    .map(r => ({
      name: r.name,
      description: r.description || '',
      language: r.language,
      pushedAt: r.pushed_at,
      htmlUrl: r.html_url,
      topics: r.topics || [],
    }));

  const latest = list.reduce((max, r) => Math.max(max, Date.parse(r.pushedAt) || 0), 0);
  const snapshot: GithubSnapshot = {
    fetchedAt: new Date().toISOString(),
    user: { login: profile.login, publicRepos: profile.public_repos ?? list.length },
    repos: list,
    lastPushDays: latest ? Math.floor((Date.now() - latest) / 86400000) : null,
  };
  await env.KV.put(KV_GITHUB, JSON.stringify(snapshot));
  return snapshot;
}

interface TreeEntry { path: string; type: string }

/**
 * 博客仓库 main 分支即发布产物，文章路径固定为 YYYY/MM/DD/标题/index.html，
 * 一次 git trees API 即可枚举全部文章目录，标题直接来自路径，无需逐篇抓取。
 */
export async function refreshBlog(env: Env): Promise<BlogFeed> {
  const repo = env.BLOG_REPO || BLOG_REPO_DEFAULT;
  const base = env.BLOG_BASE || BLOG_BASE_DEFAULT;
  const tree = await ghJson<{ tree: TreeEntry[] }>(
    `https://api.github.com/repos/${repo}/git/trees/main?recursive=1`,
    env,
  );

  const postRe = /^(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/index\.html$/;
  const posts: BlogPost[] = [];
  for (const entry of tree.tree) {
    if (entry.type !== 'blob') continue;
    const m = postRe.exec(entry.path);
    if (!m) continue;
    const [, y, mo, d, slug] = m;
    posts.push({
      title: decodeURIComponent(slug),
      url: `${base}${y}/${mo}/${d}/${encodeURIComponent(slug)}/`,
      date: `${y}-${mo}-${d}`,
      summary: '',
    });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));

  const feed: BlogFeed = { fetchedAt: new Date().toISOString(), posts: posts.slice(0, 50) };
  await env.KV.put(KV_BLOG, JSON.stringify(feed));
  return feed;
}
