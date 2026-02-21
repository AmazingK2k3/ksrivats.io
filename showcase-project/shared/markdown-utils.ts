/**
 * Shared markdown pre/post processing utilities.
 * Used by both the dev Express server (content-loader.ts)
 * and the Vercel serverless API routes (api/posts/[slug].ts etc.)
 */

const CALLOUT_TYPES: Record<string, { icon: string; label: string; cls: string }> = {
  NOTE:      { icon: '📝', label: 'Note',      cls: 'callout-note' },
  TIP:       { icon: '💡', label: 'Tip',       cls: 'callout-tip' },
  IMPORTANT: { icon: '⚡', label: 'Important', cls: 'callout-important' },
  WARNING:   { icon: '⚠️', label: 'Warning',   cls: 'callout-warning' },
  CAUTION:   { icon: '🚫', label: 'Caution',   cls: 'callout-caution' },
};

/**
 * Pre-process raw markdown string before feeding to remark/marked.
 * Handles: ==highlight==, math block/inline placeholders.
 */
export function preprocessMarkdown(md: string): string {
  // ==highlighted text== → <mark>text</mark>
  md = md.replace(/==(.+?)==/g, '<mark>$1</mark>');

  // $$...$$  block math → preserve in a div so remark doesn't mangle it
  md = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
    const encoded = Buffer.from(expr).toString('base64');
    return `<div class="math-block" data-math="${encoded}"></div>`;
  });

  // $...$ inline math (not preceded by another $)
  md = md.replace(/(?<!\$)\$([^\n$]+?)\$/g, (_, expr) => {
    const encoded = Buffer.from(expr).toString('base64');
    return `<span class="math-inline" data-math="${encoded}"></span>`;
  });

  return md;
}

/**
 * Post-process HTML output from remark/marked.
 * Handles: GitHub-style callout blockquotes.
 */
export function postprocessHtml(html: string): string {
  // Match blockquotes that start with [!TYPE] on the first paragraph
  // remark-gfm renders: <blockquote>\n<p>[!NOTE]\nrest of text</p>\n</blockquote>
  html = html.replace(
    /<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n?([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_, type, content) => {
      const t = CALLOUT_TYPES[type.toUpperCase()];
      if (!t) return _;
      // content may have more paragraphs inside
      const body = content.trim().replace(/\n/g, '<br>');
      return `<div class="callout ${t.cls}">
  <div class="callout-title">${t.icon} ${t.label}</div>
  <div class="callout-body">${body}</div>
</div>`;
    }
  );

  return html;
}
