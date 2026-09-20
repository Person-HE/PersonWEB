/**
 * ProjectCard —— 作品集卡片
 *
 * 静态字段来自 portfolio 集合（后台可管理），
 * 仓库活跃度（push 时间/语言）来自 /api/github 快照按 repo 名匹配，快照缺失则不渲染。
 */
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Rocket } from 'lucide-react';
import type { Portfolio } from '@/types';
import { useLiveStore, repoOf, daysAgo } from '@/store/useLiveStore';
import { siteConfig } from '@/config/site.config';

const STATUS_STYLE: Record<Portfolio['status'], string> = {
  已上线: 'bg-[var(--accent)] text-[var(--bg)]',
  维护中: 'bg-[var(--accent-cyan)] text-[var(--bg)]',
  已完成: 'bg-[var(--accent-alt)] text-[var(--bg)]',
  归档: 'bg-[var(--ink-mute)] text-[var(--bg)]',
};

export default function ProjectCard({ project }: { project: Portfolio }) {
  const { github } = useLiveStore();
  const repo = repoOf(github, project.repo);

  return (
    <div className="group relative flex flex-col border-2 border-[var(--ink)] bg-[var(--bg-elevated)] shadow-[2px_2px_0_var(--ink)] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--accent)]">
      {project.coverImage ? (
        <div className="border-b-2 border-[var(--ink)]">
          <img
            src={project.coverImage}
            alt={project.name}
            loading="lazy"
            className="h-40 w-full object-cover object-left"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STATUS_STYLE[project.status]}`}>
            {project.status}
          </span>
          {repo ? (
            <span className="font-mono text-[10px] text-[var(--ink-mute)]">
              {repo.language ?? '—'} · push {daysAgo(repo.pushedAt)}
            </span>
          ) : null}
        </div>

        <h3 className="font-display text-2xl font-bold text-[var(--ink)]">
          <span className="text-[var(--accent)]">{'>'}</span> {project.name}
        </h3>
        <p className="mt-2 flex-1 font-mono text-xs leading-relaxed text-[var(--ink-soft)]">
          {project.tagline}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((t) => (
            <span key={t} className="border border-[var(--ink-mute)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ink-mute)]">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t-2 border-dashed border-[var(--ink-mute)] pt-4">
          <Link
            to={`/portfolio/${project.slug}`}
            className="flex-1 border-2 border-[var(--ink)] bg-[var(--bg)] px-3 py-1.5 text-center font-mono text-xs text-[var(--ink)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--bg)]"
          >
            案例详情
          </Link>
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 border-2 border-[var(--ink)] bg-[var(--accent)] px-3 py-1.5 font-mono text-xs text-[var(--bg)] shadow-[2px_2px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
            >
              <Rocket className="h-3.5 w-3.5" /> Demo
            </a>
          ) : null}
          {project.repo ? (
            <a
              href={`${siteConfig.githubUrl}/${project.repo}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.name} 源码`}
              className="border-2 border-[var(--ink)] bg-[var(--bg)] p-1.5 text-[var(--ink)] transition-colors hover:bg-[var(--accent-cyan)]"
            >
              <Github className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>

      {project.isFeatured ? (
        <div className="absolute -right-0.5 -top-0.5 flex items-center gap-1 bg-[var(--accent-alt)] px-2 py-0.5 font-mono text-[10px] text-[var(--bg)]">
          <ArrowUpRight className="h-3 w-3" /> 主推
        </div>
      ) : null}
    </div>
  );
}
