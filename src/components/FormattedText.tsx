/**
 * 富文本排版组件
 *
 * 将纯文本（textarea 录入）渲染为带排版的 HTML：
 * - 换行：保留空行分段
 * - 列表：以 - / • / * / 数字. 开头的行渲染为 <ul>/<ol>
 * - 加粗：**text** → <strong>
 * - 行内代码：`text` → <code>
 */
import { Fragment, type ReactNode } from 'react';

interface FormattedTextProps {
  text: string | null | undefined;
  className?: string;
}

/** 行内解析：**加粗** 和 `代码` */
function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // 匹配 **加粗** 或 `代码`
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(
        <strong key={`${keyBase}-b-${i}`} className="font-hand-title text-[var(--ink)]">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith('`')) {
      nodes.push(
        <code
          key={`${keyBase}-c-${i}`}
          className="rounded border border-[var(--ink)]/30 bg-[var(--paper-light)] px-1 py-0.5 font-mono text-xs text-[var(--crimson)]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }
    lastIndex = match.index + token.length;
    i++;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

/** 判断是否为列表项 */
function matchListItem(line: string): { marker: string; content: string; ordered: boolean } | null {
  // 无序列表：- / • / * 开头
  const unordered = line.match(/^\s*[-•*]\s+(.+)/);
  if (unordered) {
    return { marker: unordered[0], content: unordered[1], ordered: false };
  }
  // 有序列表：1. / 1、 / 1） 开头
  const ordered = line.match(/^\s*(\d+)[.、)]\s+(.+)/);
  if (ordered) {
    return { marker: ordered[0], content: ordered[2], ordered: true };
  }
  return null;
}

export default function FormattedText({ text, className = '' }: FormattedTextProps) {
  if (!text || !text.trim()) {
    return null;
  }

  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  let listItems: { content: string; ordered: boolean }[] = [];
  let currentOrdered = false;
  let keyIdx = 0;

  /** 将累积的列表项 flush 为 <ul>/<ol> */
  function flushList() {
    if (listItems.length === 0) return;
    const items = [...listItems];
    const ordered = currentOrdered;
    blocks.push(
      ordered ? (
        <ol
          key={`ol-${keyIdx++}`}
          className="my-1.5 ml-5 list-decimal space-y-1 font-hand-body text-sm leading-relaxed text-[var(--ink-soft)] marker:font-hand-title marker:text-[var(--crimson)]"
        >
          {items.map((item, i) => (
            <li key={i} className="pl-1">{renderInline(item.content, `ol-${keyIdx}-${i}`)}</li>
          ))}
        </ol>
      ) : (
        <ul
          key={`ul-${keyIdx++}`}
          className="my-1.5 ml-5 list-disc space-y-1 font-hand-body text-sm leading-relaxed text-[var(--ink-soft)] marker:text-[var(--crimson)]"
        >
          {items.map((item, i) => (
            <li key={i} className="pl-1">{renderInline(item.content, `ul-${keyIdx}-${i}`)}</li>
          ))}
        </ul>
      ),
    );
    listItems = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // 空行：结束当前列表
    if (trimmed === '') {
      flushList();
      continue;
    }

    // 列表项
    const listItem = matchListItem(trimmed);
    if (listItem) {
      // 如果列表类型变化，先 flush
      if (listItems.length > 0 && listItem.ordered !== currentOrdered) {
        flushList();
      }
      currentOrdered = listItem.ordered;
      listItems.push({ content: listItem.content, ordered: listItem.ordered });
      continue;
    }

    // 普通段落行：先 flush 列表
    flushList();
    blocks.push(
      <p key={`p-${keyIdx++}`} className="my-1.5 font-hand-body text-sm leading-relaxed text-[var(--ink-soft)]">
        {renderInline(trimmed, `p-${keyIdx}`)}
      </p>,
    );
  }
  flushList();

  return <div className={className}>{blocks.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</div>;
}
