import { Wrench, Wand2, Puzzle, Crown, Package, Workflow, ArrowRight, type LucideIcon } from 'lucide-react';
import type { Service, ServiceType } from '@/types';
import { useWechatModal } from '@/components/WeChatModal';

const iconMap: Record<ServiceType, LucideIcon> = {
  'tool-config': Wrench,
  'ai-output': Wand2,
  custom: Puzzle,
  'product-pro': Crown,
  product: Package,
  automation: Workflow,
  enterprise: Crown,
};

interface ServiceCardProps {
  service: Service;
  isEnterprise?: boolean;
}

export default function ServiceCard({ service, isEnterprise = false }: ServiceCardProps) {
  const { open } = useWechatModal();
  const Icon = iconMap[service.type] ?? Wrench;
  const scene = service.type;

  return (
    <div className={`hand-card ink-spread group flex h-full flex-col p-5 ${isEnterprise ? 'hand-card-gold' : ''}`}>
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] ${
            isEnterprise
              ? 'bg-[var(--mustard)] text-[var(--ink)]'
              : 'bg-[var(--crimson)] text-[var(--paper-light)]'
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-hand-title text-base text-[var(--ink)]">{service.name}</h3>
          <p
            className={`font-hand-title text-sm font-bold ${
              isEnterprise ? 'text-[var(--mustard)]' : 'text-[var(--crimson)]'
            }`}
            style={isEnterprise ? { color: '#B8791B' } : undefined}
          >
            {service.priceRange || service.price}
          </p>
        </div>
      </div>

      <p className="mb-3 line-clamp-2 font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">
        {service.description}
      </p>

      {/* 标签 */}
      {service.tags && service.tags.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-1">
          {service.tags.slice(0, 4).map((t) => (
            <span key={t} className="hand-tag text-xs">#{t}</span>
          ))}
        </div>
      ) : null}

      {/* 交付信息 */}
      <div className="mb-4 space-y-1.5 font-hand-body text-xs text-[var(--ink-soft)]">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-[var(--ink-mute)]">交付方式</span>
          <span>{service.delivery.method}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-[var(--ink-mute)]">交付时间</span>
          <span>{service.delivery.time}</span>
        </div>
        {service.guarantee ? (
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[var(--ink-mute)]">保障</span>
            <span>{service.guarantee}</span>
          </div>
        ) : null}
      </div>

      <button
        onClick={() => open(scene)}
        className={`hand-btn mt-auto text-sm ${isEnterprise ? 'hand-btn-gold' : 'hand-btn-primary'}`}
      >
        立即咨询
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
