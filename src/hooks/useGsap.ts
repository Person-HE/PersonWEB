/**
 * GSAP 物理动画 hooks
 *
 * 设计意图：
 * - 拒绝线性/匀速运动，所有动画带弹性、阻尼衰减
 * - 模拟物理世界直觉：重量感、惯性、回弹
 */
import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

type ElementRef = React.RefObject<HTMLElement | null>;

/**
 * 弹性进入动画：元素从下方弹入，带过冲和阻尼衰减
 * 物理模型：spring（弹性系数 + 阻尼）
 */
export function useElasticEnter<T extends HTMLElement = HTMLDivElement>(
  deps: unknown[] = [],
  opts: { delay?: number; y?: number; scale?: number } = {},
) {
  const ref = useRef<T>(null);
  const { delay = 0, y = 30, scale = 0.95 } = opts;

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    gsap.set(el, { opacity: 0, y, scale });
    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        delay,
        // 弹性 + 阻尼衰减：ease.out.elastic 模拟弹簧
        ease: 'elastic.out(1, 0.6)',
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * 交错显现：列表项依次弹入，营造节奏感
 * @param selector 子元素选择器
 * @param stagger 间隔秒数
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  selector: string,
  deps: unknown[] = [],
  opts: { stagger?: number; delay?: number; y?: number } = {},
) {
  const ref = useRef<T>(null);
  const { stagger = 0.08, delay = 0, y = 24 } = opts;

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const items = el.querySelectorAll(selector);
    if (items.length === 0) return;

    gsap.set(items, { opacity: 0, y });
    const ctx = gsap.context(() => {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay,
        stagger,
        ease: 'back.out(1.4)', // 轻微过冲
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * 磁吸悬停：鼠标靠近时元素被"吸引"轻微位移
 * 模拟磁场/磁铁的物理感觉
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  strength: number = 0.3,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(el, {
        x: dx,
        y: dy,
        duration: 0.6,
        ease: 'power3.out', // 快速接近 + 慢速停靠
      });
    };

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        // 弹性回弹：模拟松开磁铁后的振动
        ease: 'elastic.out(1, 0.5)',
      });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}

/**
 * 视差滚动：元素根据滚动位置产生不同速度的位移
 * 营造空间深度感（前景快、背景慢）
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  speed: number = 0.3,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const offset = rect.top * speed;
        gsap.to(el, {
          y: -offset,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}

/**
 * 墨水扩散 hover：跟随鼠标位置的渐变光晕
 * 配合 .ink-spread CSS 类使用
 */
export function useInkHover<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };

    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return ref;
}
