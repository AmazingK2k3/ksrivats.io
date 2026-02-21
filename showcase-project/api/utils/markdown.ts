/**
 * Markdown pre/post processing for Vercel API routes.
 * Mirrors shared/markdown-utils.ts (can't use @shared alias in Vercel functions).
 */

const CALLOUT_TYPES: Record<string, { icon: string; label: string; cls: string }> = {
  NOTE:      { icon: '📝', label: 'Note',      cls: 'callout-note' },
  TIP:       { icon: '💡', label: 'Tip',       cls: 'callout-tip' },
  IMPORTANT: { icon: '⚡', label: 'Important', cls: 'callout-important' },
  WARNING:   { icon: '⚠️', label: 'Warning',   cls: 'callout-warning' },
  CAUTION:   { icon: '🚫', label: 'Caution',   cls: 'callout-caution' },
};

export function preprocessMarkdown(md: string): string {
  // ==highlighted text== → <mark>text</mark>
  md = md.replace(/==(.+?)==/g, '<mark>$1</mark>');

  // $$...$$ block math
  md = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
    const encoded = Buffer.from(expr).toString('base64');
    return `<div class="math-block" data-math="${encoded}"></div>`;
  });

  // $...$ inline math
  md = md.replace(/(?<!\$)\$([^\n$]+?)\$/g, (_, expr) => {
    const encoded = Buffer.from(expr).toString('base64');
    return `<span class="math-inline" data-math="${encoded}"></span>`;
  });

  return md;
}

export function postprocessHtml(html: string): string {
  html = html.replace(
    /<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n?([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_, type, content) => {
      const t = CALLOUT_TYPES[type.toUpperCase()];
      if (!t) return _;
      const body = content.trim().replace(/\n/g, '<br>');
      return `<div class="callout ${t.cls}">
  <div class="callout-title">${t.icon} ${t.label}</div>
  <div class="callout-body">${body}</div>
</div>`;
    }
  );
  return html;
}
