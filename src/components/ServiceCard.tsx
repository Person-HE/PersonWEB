import { Link } from 'react-router-dom';
import { Play, ArrowRight, TrendingUp } from 'lucide-react';
import type { Service } from '@/types';
import { useWechatModal } from '@/components/WeChatModal';
import { SmartImage, SmartVideo } from '@/components/SmartMedia';

interface ServiceCardProps {
  service: Service;
}

function isDirectVideoUrl(url: string | null): boolean {
  return !!url && /\.(mp4|webm)(\?.*)?$/i.test(url);
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { open } = useWechatModal();
  const hasVisual = !!service.coverImage || isDirectVideoUrl(service.videoUrl);

  return (
    <div className="hand-card rgb-shift group flex flex-col overflow-hidden lg:flex-row">
      {/* 左侧：封面图 / 视频（40%） */}
      {hasVisual ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-[var(--border)] lg:aspect-auto lg:w-[40%] lg:border-b-0 lg:border-r-2">
          {service.coverImage ? (
            <SmartImage
              src={service.coverImage}
              alt={service.name}
              wrapperClassName="h-full w-full"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              fallbackLabel="封面信号丢失"
            />
          ) : null}
          {isDirectVideoUrl(service.videoUrl) ? (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <SmartVideo
                src={service.videoUrl as string}
                autoPlay={false}
                controls={false}
                wrapperClassName="h-full w-full"
                className="h-full w-full object-cover"
                fallbackLabel="视频信号丢失"
              />
            </div>
          ) : null}
          {isDirectVideoUrl(service.videoUrl) ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-[var(--border)] bg-[var(--accent)] text-[var(--bg)] shadow-[3px_3px_0_var(--border)] transition-transform duration-300 group-hover:scale-110">
                <Play className="h-5 w-5 fill-current" />
              </div>
            </div>
          ) : null}
          {service.isFeatured ? (
            <span className="absolute left-3 top-3 border-2 border-[var(--border)] bg-[var(--accent-alt)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--ink)] shadow-[2px_2px_0_var(--border)]">
              FEATURED
            </span>
          ) : null}
        </div>
      ) : null}

      {/* 右侧：信息 */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h3 className="font-display text-xl font-bold text-[var(--ink)] sm:text-2xl">
            {service.name}
          </h3>
          <span className="border-2 border-[var(--border)] bg-[var(--accent)] px-2 py-0.5 font-mono text-xs font-bold text-[var(--bg)] shadow-[2px_2px_0_var(--border)]">
            {service.priceRange || service.price}
          </span>
        </div>

        <p className="mb-4 font-mono text-sm leading-relaxed text-[var(--ink-soft)]">
          {service.description}
        </p>

        {service.metrics && service.metrics.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {service.metrics.slice(0, 3).map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-1 border border-[var(--ink-mute)] bg-[var(--bg-surface)] px-2 py-1 font-mono text-[11px] text-[var(--ink-soft)]"
              >
                <TrendingUp className="h-3 w-3 text-[var(--accent)]" />
                <span className="text-[var(--ink)]">{m.value}</span>
                <span>{m.label}</span>
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          <Link
            to={`/services/${service.id}`}
            className="hand-btn hand-btn-primary text-sm"
          >
            查看详情
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => open(service.type)}
            className="hand-btn text-sm"
          >
            微信咨询
          </button>
        </div>
      </div>
    </div>
  );
}
