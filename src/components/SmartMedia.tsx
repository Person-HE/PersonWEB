/**
 * SmartMedia —— 智能媒体展示组件 v2
 *
 * 修复记录：
 * 旧版存在竞态条件 bug —— 当图片被浏览器缓存时，<img onLoad> 在 React 挂载前就触发，
 * 导致 status 永远卡在 'loading'，img 的 opacity-0 不消失，截图完全不可见。
 * 同时部分真实存在的图片被误判为 'error'，显示"信号丢失"占位。
 *
 * 修复策略（三层防御）：
 * 1. useLayoutEffect：在浏览器 paint 前同步检查 img.complete，捕获已缓存图片
 * 2. onLoad/onError 事件：捕获正常加载流程
 * 3. Image() 预加载器：兜底捕获任何错过的事件
 *
 * 设计意图（per creative-frontend-design-expert SKILL.md）：
 * - 5.3 具身认知：加载骨架模拟"信号扫描"，物理感
 * - 5.6 社交认知：错误页"信号丢失"是只有关心用户的人才会做的细节
 */
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { ImageOff, PlayCircle } from 'lucide-react';

type LoadStatus = 'loading' | 'loaded' | 'error';

type SmartImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  /** 容器外部样式（包括尺寸/边框等） */
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  /** 加载失败时的占位提示文字 */
  fallbackLabel?: string;
  /** 是否可点击放大（用于截图） */
  onClick?: () => void;
  /** 是否懒加载（默认 true） */
  lazy?: boolean;
  /** 优先级加载（首屏图建议 true） */
  eager?: boolean;
};

/**
 * 智能图片：加载中显示扫描骨架，失败显示「信号丢失」占位
 *
 * 关键修复：使用 useLayoutEffect 在 paint 前同步检查 img.complete，
 * 捕获浏览器已缓存的图片，避免 onLoad 错过导致的死锁。
 */
export function SmartImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  wrapperStyle,
  fallbackLabel = '信号丢失',
  onClick,
  lazy = true,
  eager = false,
}: SmartImageProps) {
  const [status, setStatus] = useState<LoadStatus>(src ? 'loading' : 'error');
  const imgRef = useRef<HTMLImageElement>(null);

  // src 变化时重置状态
  useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }
    setStatus('loading');
  }, [src]);

  // 第一层防御：useLayoutEffect 在 paint 前同步检查 img.complete
  // 捕获浏览器已缓存的图片 —— 此时 onLoad 不会再触发，必须主动检查
  useLayoutEffect(() => {
    if (!src || !imgRef.current) return;
    const img = imgRef.current;
    if (img.complete) {
      if (img.naturalWidth > 0) {
        setStatus('loaded');
      } else {
        setStatus('error');
      }
    }
    // 如果 img.complete === false，说明还在加载，等待 onLoad
  }, [src]);

  // 第三层防御：Image() 预加载器兜底
  // 如果因为某种原因 onLoad/onError 都没触发，这里会捕获到
  useEffect(() => {
    if (!src || status !== 'loading') return;

    const preloader = new Image();
    preloader.onload = () => setStatus('loaded');
    preloader.onerror = () => setStatus('error');
    preloader.src = src;

    return () => {
      preloader.onload = null;
      preloader.onerror = null;
    };
  }, [src, status]);

  // 无 src：直接显示信号丢失
  if (!src) {
    return (
      <div
        className={`relative overflow-hidden ${wrapperClassName}`}
        style={wrapperStyle}
      >
        <SignalLost label={fallbackLabel} />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${wrapperClassName}`}
      style={wrapperStyle}
      onClick={onClick}
    >
      {/* 加载骨架：扫描线动画 */}
      {status === 'loading' ? (
        <div className="absolute inset-0 z-10 bg-[var(--bg-surface)]">
          <div className="scan-loader absolute inset-0" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-mute)]">
              loading...
            </span>
          </div>
        </div>
      ) : null}

      {/* 信号丢失占位 */}
      {status === 'error' ? (
        <div className="absolute inset-0 z-10">
          <SignalLost label={fallbackLabel} />
        </div>
      ) : null}

      {/* 真实图片：始终渲染，通过 opacity 控制可见性 */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={lazy && !eager ? 'lazy' : eager ? 'eager' : undefined}
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        draggable={false}
      />
    </div>
  );
}

type SmartVideoProps = {
  src: string | null | undefined;
  poster?: string | null;
  className?: string;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  /** 是否自动播放（默认 true，静音循环） */
  autoPlay?: boolean;
  /** 是否显示控制条（默认 true） */
  controls?: boolean;
  fallbackLabel?: string;
};

/**
 * 智能视频：内嵌播放，失败显示「信号丢失」占位
 *
 * 关键修复：使用 useLayoutEffect 在 paint 前同步检查 video.readyState，
 * 捕获浏览器已缓存的视频。
 */
export function SmartVideo({
  src,
  poster,
  className = '',
  wrapperClassName = '',
  wrapperStyle,
  autoPlay = true,
  controls = true,
  fallbackLabel = '视频信号丢失',
}: SmartVideoProps) {
  const [status, setStatus] = useState<LoadStatus>(src ? 'loading' : 'error');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }
    setStatus('loading');
  }, [src]);

  // 第一层防御：同步检查 readyState
  useLayoutEffect(() => {
    if (!src || !videoRef.current) return;
    const v = videoRef.current;
    // HAVE_CURRENT_DATA (2) 或更高就认为可显示
    if (v.readyState >= 2) {
      setStatus('loaded');
    }
  }, [src]);

  // 第三层防御：超时兜底 + 重试机制
  // StrictMode 在开发环境会双挂载组件，导致第一次 video load 被 abort (ERR_ABORTED)
  // 这里检测 stall 并重新触发加载
  useEffect(() => {
    if (!src || status !== 'loading') return;
    const timer = setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      if (v.readyState >= 2) {
        setStatus('loaded');
      } else if (v.readyState === 0 && v.networkState === 3) {
        // networkState 3 = NETWORK_NO_SOURCE，加载失败
        setStatus('error');
      } else if (v.readyState === 0 && v.networkState === 1) {
        // networkState 1 = NETWORK_LOADING 但 readyState 仍为 0，可能是 stall
        // 尝试重新加载
        try {
          v.load();
        } catch {
          // 忽略
        }
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [src, status]);

  if (!src) {
    return (
      <div
        className={`relative overflow-hidden ${wrapperClassName}`}
        style={wrapperStyle}
      >
        <SignalLost label={fallbackLabel} />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={wrapperStyle}
    >
      {status === 'loading' ? (
        <div className="absolute inset-0 z-10 bg-[var(--bg-surface)]">
          <div className="scan-loader absolute inset-0" />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="h-6 w-6 animate-pulse text-[var(--accent)]" />
          </div>
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="absolute inset-0 z-10">
          <SignalLost label={fallbackLabel} />
        </div>
      ) : null}

      <video
        ref={videoRef}
        src={src}
        poster={poster || undefined}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        controls={controls}
        autoPlay={autoPlay}
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setStatus('loaded')}
        onCanPlay={() => setStatus('loaded')}
        onCanPlayThrough={() => setStatus('loaded')}
        onStalled={() => {
          // 浏览器暂停加载等待数据，尝试恢复
          const v = videoRef.current;
          if (v) {
            try {
              v.load();
            } catch {
              // 忽略
            }
          }
        }}
        onError={() => setStatus('error')}
      />
    </div>
  );
}

/**
 * 信号丢失占位：CRT 雪花屏风格
 */
function SignalLost({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2 bg-[var(--bg-surface)]">
      <div className="signal-noise absolute inset-0 opacity-30" />
      <ImageOff className="relative h-6 w-6 text-[var(--accent-alt)]" />
      <span className="relative font-mono text-[10px] uppercase tracking-widest text-[var(--ink-mute)]">
        {label}
      </span>
    </div>
  );
}
