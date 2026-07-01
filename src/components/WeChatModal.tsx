import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { siteConfig, wechatScenes, type WechatScene } from '@/config/site.config';
import { copyText } from '@/lib/utils';

interface WechatModalContextValue {
  open: (scene?: WechatScene) => void;
}

const WechatModalContext = createContext<WechatModalContextValue>({ open: () => {} });

export function useWechatModal() {
  return useContext(WechatModalContext);
}

export function WechatModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scene, setScene] = useState<WechatScene>('default');
  const [copied, setCopied] = useState(false);

  const open = useCallback((s: WechatScene = 'default') => {
    setScene(s);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  const handleCopy = async () => {
    if (!siteConfig.wechatId) return;
    const ok = await copyText(siteConfig.wechatId);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <WechatModalContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--ink)]/60 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-hand border-2 border-[var(--ink)] bg-[var(--paper-light)] shadow-hand-lg animate-paper-shake"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: 'rotate(-1deg)' }}
          >
            <button
              onClick={close}
              className="absolute right-3 top-3 z-10 rounded-lg border-2 border-[var(--ink)] bg-[var(--paper)] p-1.5 text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-all hover:bg-[var(--crimson)] hover:text-[var(--paper-light)]"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 py-7 text-center">
              <h3 className="mb-1 font-hand-title text-xl text-[var(--ink)]">添加微信</h3>
              <p className="mb-5 font-hand-body text-xs text-[var(--ink-mute)]">扫码或搜索微信号添加好友</p>

              <div className="mx-auto mb-5 flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[3px_3px_0_var(--ink)]">
                {siteConfig.wechatQrUrl ? (
                  <img
                    src={siteConfig.wechatQrUrl}
                    alt="微信二维码"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <p className="px-3 text-center font-hand-body text-xs text-[var(--ink-mute)]">
                    二维码待上传
                  </p>
                )}
              </div>

              {siteConfig.wechatId ? (
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="font-hand-body text-sm text-[var(--ink-soft)]">微信号：</span>
                  <span className="font-hand-title text-sm font-bold text-[var(--ink)]">
                    {siteConfig.wechatId}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="ml-1 inline-flex items-center gap-1 rounded-md border-2 border-[var(--ink)] bg-[var(--mustard)] px-2 py-0.5 text-xs text-[var(--ink)] shadow-[1px_1px_0_var(--ink)] transition-all hover:bg-[var(--crimson)] hover:text-[var(--paper-light)]"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
              ) : (
                <p className="mb-4 font-hand-body text-xs text-[var(--ink-mute)]">
                  微信号待填写（请在 site.config.ts 中配置 wechatId）
                </p>
              )}

              <div className="rounded-lg border-2 border-dashed border-[var(--ink)] bg-[var(--mustard)]/20 px-3 py-2">
                <p className="font-hand-body text-xs text-[var(--ink-soft)]">{wechatScenes[scene]}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </WechatModalContext.Provider>
  );
}
