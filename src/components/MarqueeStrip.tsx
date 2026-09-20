/**
 * MarqueeStrip —— 滚动文字条带
 *
 * 设计意图（per creative-frontend-design-expert SKILL.md）：
 * - 因果链 5.1：新颖性 —— 滚动文字条打破页面节奏
 * - 因果链 5.4：认知负荷 —— 作为视觉分隔符，给大脑休息
 * - 因果链 5.6：社交认知 —— 内容是"只有关心细节的人才会写的"
 *
 * 用法：<MarqueeStrip items={['真实交付', '不卖概念', ...]} />
 */
interface MarqueeStripProps {
  items: string[];
  variant?: 'default' | 'alt';
  /** 滚动速度（秒），数字越大越慢 */
  duration?: number;
}

export default function MarqueeStrip({
  items,
  variant = 'default',
  duration = 30,
}: MarqueeStripProps) {
  // 复制一份用于无缝循环
  const doubled = [...items, ...items];

  return (
    <div className={`marquee-strip ${variant === 'alt' ? 'marquee-strip--alt' : ''}`}>
      <div
        className="marquee-track"
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3">
            <span className="opacity-60">◆</span>
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
