import { ExternalLink } from 'lucide-react';
import type { NavSite } from '@/types';

interface NavSiteCardProps {
  site: NavSite;
}

export default function NavSiteCard({ site }: NavSiteCardProps) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-cyan-500/5"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10">
        <img
          src={site.iconUrl}
          alt={site.name}
          className="h-8 w-8 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement!.innerHTML =
              '<span class="text-lg font-bold text-cyan-400">' + site.name[0] + '</span>';
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white transition-colors group-hover:text-cyan-400">
            {site.name}
          </h3>
          <ExternalLink className="h-3.5 w-3.5 text-slate-600 transition-colors group-hover:text-cyan-400" />
        </div>
        <p className="mb-2 text-xs leading-relaxed text-slate-500">{site.description}</p>
        <span className="inline-block rounded-md bg-cyan-500/15 px-2 py-0.5 text-xs font-medium text-cyan-400">
          {site.category}
        </span>
      </div>
    </a>
  );
}
