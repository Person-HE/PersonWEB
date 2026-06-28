import type { Resource } from '@/types';

interface ResourceCardProps {
  resource: Resource;
  onClick: () => void;
}

export default function ResourceCard({ resource, onClick }: ResourceCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] text-left transition-all duration-300 hover:border-amber-500/20 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-amber-500/5"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={resource.imageUrl}
          alt={resource.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20resource%20pattern%20dark&image_size=landscape_16_9';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400 backdrop-blur-sm">
          {resource.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1.5 text-base font-semibold text-white transition-colors group-hover:text-amber-400">
          {resource.name}
        </h3>
        <p className="flex-1 text-xs leading-relaxed text-slate-500">{resource.description}</p>
      </div>
    </button>
  );
}
