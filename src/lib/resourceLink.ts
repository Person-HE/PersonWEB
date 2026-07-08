/**
 * 资源链接解析工具
 *
 * 兼容旧数据字段（productUrl / downloadUrl）与新字段（linkUrl）
 */
export function extractFirstUrl(text: string | null | undefined): string | null {
  if (!text) return null;
  const match = String(text).match(/https?:\/\/[^\s"'<>]+/i);
  return match ? match[0] : null;
}

function extractPwdFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.searchParams.get('pwd') || null;
  } catch {
    return null;
  }
}

function extractPwdFromText(text: string | null | undefined): string | null {
  if (!text) return null;
  const match = String(text).match(/(?:提取码|密码|pwd)[\s：:=]*([a-zA-Z0-9]+)/i);
  return match ? match[1] : null;
}

export function getResourceLink(resource: Record<string, any>): {
  url: string | null;
  password: string | null;
} {
  const linkUrl = resource.linkUrl || null;
  const productUrl = resource.productUrl || null;
  const downloadUrl = resource.downloadUrl || null;

  const url = linkUrl || extractFirstUrl(productUrl) || extractFirstUrl(downloadUrl);
  const password =
    resource.linkPassword ||
    extractPwdFromUrl(url) ||
    extractPwdFromText(linkUrl) ||
    extractPwdFromText(productUrl) ||
    extractPwdFromText(downloadUrl);

  return { url, password };
}
