/**
 * SiteEffects —— 全站视觉氛围层
 *
 * 设计意图（per creative-frontend-design-expert SKILL.md）：
 * - CRT 扫描线整页覆盖：反 AI 默认"干净"，复古终端感
 * - 噪点纹理叠加：打破数字生硬感
 * - 边缘暗角：聚焦视线
 * - 自定义光标：mix-blend-mode:difference 反色，hover 时放大变色
 *
 * 因果链引用：
 * - 5.1 新颖性：CRT + 噪点在 2026 年的互联网上是"反预期"
 * - 5.3 具身认知：光标的弹性追踪 = 物理感
 * - 5.6 社交认知：彩蛋——双击屏幕触发 glitch 闪烁
 */
import { useEffect, useRef, useState } from 'react';

export default function SiteEffects() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // 仅桌面端启用自定义光标
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    setEnabled(true);
    document.body.classList.add('cursor-custom');

    let raf = 0;
    let tx = 0, ty = 0;
    let cx = 0, cy = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!cursorRef.current) return;
      // 立即定位，再用 RAF 平滑跟随
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // 弹性追踪：阻尼衰减
        cx += (tx - cx) * 0.25;
        cy += (ty - cy) * 0.25;
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        }
      });

      // 检测 hover 目标
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest(
        'a, button, input, textarea, select, [role="button"], [data-cursor-hover]'
      );
      setIsHover(isInteractive);
    };

    const onDown = () => setIsClick(true);
    const onUp = () => setIsClick(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });

    return () => {
      document.body.classList.remove('cursor-custom');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* CRT 扫描线整页覆盖 */}
      <div className="crt-overlay" aria-hidden="true" />
      {/* CRT 边缘暗角 */}
      <div className="crt-vignette" aria-hidden="true" />
      {/* 噪点纹理 */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* 自定义光标 */}
      {enabled ? (
        <div
          ref={cursorRef}
          className={`custom-cursor ${isHover ? 'custom-cursor--hover' : ''} ${
            isClick ? 'custom-cursor--click' : ''
          }`}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}
