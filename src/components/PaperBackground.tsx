/**
 * CyberBackground —— 赛博朋克网格背景（替代旧 PaperBackground）
 *
 * 设计意图（per creative-frontend-design-expert SKILL.md）：
 * - 纯 CSS 实现，无 Three.js 依赖，性能极佳
 * - 黑底 + 荧光网格 + 模糊光斑，反 AI 默认"奶油色背景"
 * - 网格随鼠标轻微视差，物理感微交互（因果链 5.3）
 * - 与全站 SiteEffects（CRT 扫描线 + 噪点）协同，不重复
 *
 * 因果链引用：
 * - 5.1 新颖性：网格 + 光斑营造终端/矩阵氛围
 * - 5.2 统计平均：反"奶油色米色默认背景"AI Slop
 * - 5.3 具身认知：鼠标视差 = 物理感
 */
import { useEffect, useRef } from 'react';

export default function PaperBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 鼠标视差：网格轻微跟随，营造物理感（阻尼衰减）
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 20;
      ty = (e.clientY / window.innerHeight - 0.5) * 20;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        el.style.setProperty('--grid-x', `${cx}px`);
        el.style.setProperty('--grid-y', `${cy}px`);
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
      style={{ '--grid-x': '0px', '--grid-y': '0px' } as React.CSSProperties}
    >
      {/* 基础纯黑底 */}
      <div className="absolute inset-0 bg-[var(--bg)]" />

      {/* 荧光光斑：模糊大色块，反 AI"极光渐变"——这里用纯色低透明度 */}
      <div className="absolute -left-[10%] top-[10%] h-[40vw] w-[40vw] rounded-full bg-[var(--accent)] opacity-[0.05] blur-[100px]" />
      <div className="absolute -right-[10%] bottom-[15%] h-[35vw] w-[35vw] rounded-full bg-[var(--accent-alt)] opacity-[0.06] blur-[100px]" />
      <div className="absolute left-[30%] top-[60%] h-[30vw] w-[30vw] rounded-full bg-[var(--accent-cyan)] opacity-[0.04] blur-[120px]" />

      {/* 网格底纹：极淡，带鼠标视差 */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          transform: 'translate(var(--grid-x), var(--grid-y))',
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* 细密次级网格：更小格子，强化层次 */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          transform: 'translate(calc(var(--grid-x) * 0.5), calc(var(--grid-y) * 0.5))',
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  );
}
