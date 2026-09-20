/**
 * Seo —— 统一的 head 管理（标题/meta/canonical/JSON-LD）
 *
 * 纯 CSR 下用 DOM 注入代替 SSR 输出：保证每页 title/description/canonical
 * 唯一，且 Person / SoftwareApplication / Article 结构化数据可被爬虫读取。
 */
import { useEffect } from 'react';
import { siteConfig } from '@/config/site.config';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.owner,
    url: window.location.origin,
    sameAs: [siteConfig.githubUrl, siteConfig.blogUrl],
    description: siteConfig.tagline,
  };
}

interface SeoProps {
  title: string;
  description?: string;
  /** 当前路径（canonical 用），如 /portfolio/filecut */
  path?: string;
  jsonLd?: Record<string, unknown>[];
}

export default function Seo({ title, description, path, jsonLd }: SeoProps) {
  useEffect(() => {
    const full = title === siteConfig.name ? title : `${title} - ${siteConfig.name}`;
    document.title = full;
    const desc = description || siteConfig.tagline;
    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:title', full);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('name', 'twitter:title', full);
    upsertMeta('name', 'twitter:description', desc);
    if (path) upsertLink('canonical', window.location.origin + path);

    const id = 'page-jsonld';
    document.getElementById(id)?.remove();
    if (jsonLd && jsonLd.length > 0) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, JSON.stringify(jsonLd || null)]);
  return null;
}
