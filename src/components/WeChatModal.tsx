/**
 * 微信弹窗 —— Cyber Glitch Brutalism v2 风格
 *
 * 设计意图（per creative-frontend-design-expert SKILL.md）：
 * - 反 AI 味：模态框非圆角玻璃面板，改用直角 + 硬阴影 + 终端边框
 * - 物理感：弹出时带 glitch 入场动画（而非 linear 渐入）
 * - 因果链 5.1：新颖性 —— 终端 prompt 风格的标题与提示符
 * - 因果链 5.6：社交认知 —— 复制按钮有明确的成功反馈
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { X, Copy, Check, Terminal } from 'lucide-react';
import { siteConfig, wechatScenes, type WechatScene } from '@/config/site.config';
import { copyText } from '@/lib/utils';
import { SmartImage } from '@/components/SmartMedia';

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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-deep)]/80 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden border-2 border-[var(--ink)] bg-[var(--bg-elevated)] shadow-[6px_6px_0_var(--ink)] boot-flicker"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部强调线 */}
            <div className="h-0.5 w-full bg-[var(--accent)]" />

            {/* 终端标题栏 */}
            <div className="flex items-center justify-between border-b-2 border-[var(--ink)] bg-[var(--bg)] px-3 py-2">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent)]">
                <Terminal className="h-3.5 w-3.5" />
                <span>{'>'} wechat_connect.exe</span>
              </div>
              <button
                onClick={close}
                className="flex h-6 w-6 items-center justify-center border-2 border-[var(--ink)] bg-[var(--bg-elevated)] text-[var(--ink)] transition-colors hover:bg-[var(--accent-alt)] hover:text-[var(--bg)]"
                aria-label="关闭"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="px-6 py-7 text-center">
              <h3 className="mb-1 font-display text-2xl tracking-wide text-[var(--ink)]">
                <span className="text-[var(--accent)]">{'>'}</span> 添加微信
              </h3>
              <p className="mb-5 font-mono text-xs text-[var(--ink-mute)]">
                <span className="text-[var(--accent-cyan)]">#</span> 扫码或搜索微信号添加好友
              </p>

              <div className="relative mx-auto mb-5 h-48 w-48 overflow-hidden border-2 border-[var(--ink)] bg-[var(--bg)] shadow-[3px_3px_0_var(--accent)]">
                {siteConfig.wechatQrUrl ? (
                  <SmartImage
                    src={siteConfig.wechatQrUrl}
                    alt="微信二维码"
                    eager
                    wrapperClassName="h-full w-full"
                    className="h-full w-full object-cover"
                    fallbackLabel="二维码信号丢失"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                    <div className="signal-noise absolute inset-0 opacity-30" />
                    <Terminal className="relative h-6 w-6 text-[var(--ink-mute)]" />
                    <p className="relative px-3 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--ink-mute)]">
                      qr not found
                    </p>
                  </div>
                )}
              </div>

              {siteConfig.wechatId ? (
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="font-mono text-xs text-[var(--ink-soft)]">微信号：</span>
                  <span className="font-mono text-sm font-bold text-[var(--accent)]">
                    {siteConfig.wechatId}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="ml-1 inline-flex items-center gap-1 border-2 border-[var(--ink)] bg-[var(--accent)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--bg)] shadow-[1px_1px_0_var(--ink)] transition-all hover:bg-[var(--accent-cyan)]"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
              ) : (
                <p className="mb-4 font-mono text-xs text-[var(--ink-mute)]">
                  <span className="text-[var(--accent-alt)]">!</span> 微信号待填写（请在 site.config.ts 中配置 wechatId）
                </p>
              )}

              <div className="border-2 border-dashed border-[var(--accent)] bg-[var(--accent)]/10 px-3 py-2">
                <p className="font-mono text-xs text-[var(--ink-soft)]">
                  <span className="text-[var(--accent)]">{'>'}</span> {wechatScenes[scene]}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </WechatModalContext.Provider>
  );
}
