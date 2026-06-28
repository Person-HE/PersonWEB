import { X, Copy, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  imageUrl: string;
  detail: string;
  driveLink?: string;
  externalUrl?: string;
  category: string;
}

export default function DetailModal({
  open,
  onClose,
  title,
  imageUrl,
  detail,
  driveLink,
  externalUrl,
  category,
}: DetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = async () => {
    if (!driveLink) return;
    try {
      await navigator.clipboard.writeText(driveLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = driveLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg bg-black/40 p-1.5 text-white/70 transition-colors hover:bg-black/60 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5">
            <img
              src={imageUrl}
              alt={title}
              className="h-56 w-full object-cover md:h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20geometric%20pattern%20dark%20teal&image_size=landscape_16_9';
              }}
            />
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-3">
              <span className="inline-block rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                {category}
              </span>
            </div>
            <h2 className="mb-3 text-xl font-bold text-white">{title}</h2>
            <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-400">{detail}</p>

            <div className="flex flex-col gap-3">
              {driveLink && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="mb-2 text-xs font-medium text-slate-500">网盘链接</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 truncate text-xs text-emerald-400">{driveLink}</code>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        copied
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? '已复制' : '复制'}
                    </button>
                  </div>
                </div>
              )}

              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 py-2.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/25"
                >
                  <ExternalLink className="h-4 w-4" />
                  访问网站
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
