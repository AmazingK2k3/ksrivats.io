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

/**
 * Post-process HTML output from remark/marked.
 * Handles: GitHub-style callout blockquotes (iterative, nesting-safe)
 * and heading id injection for anchor link support.
 */
export function postprocessHtml(html: string): string {
  let result = '';
  let i = 0;

  while (i < html.length) {
    const blockStart = html.indexOf('<blockquote>', i);
    if (blockStart === -1) {
      result += html.slice(i);
      break;
    }

    result += html.slice(i, blockStart);

    let depth = 1;
    let j = blockStart + 12;

    while (j < html.length && depth > 0) {
      const nextOpen  = html.indexOf('<blockquote>', j);
      const nextClose = html.indexOf('</blockquote>', j);

      if (nextClose === -1) { depth = -1; break; }

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        j = nextOpen + 12;
      } else {
        depth--;
        j = nextClose + 13;
      }
    }

    if (depth !== 0) {
      result += html.slice(blockStart);
      break;
    }

    const blockEnd = j;
    const inner = html.slice(blockStart + 12, blockEnd - 13);

    const typeMatch = inner.match(/^\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n?/i);
    if (typeMatch) {
      const type = typeMatch[1].toUpperCase();
      const t = CALLOUT_TYPES[type];
      if (t) {
        const body = inner
          .replace(/^\s*<p>\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n?/i, '<p>')
          .trim();
        result += `<div class="callout ${t.cls}">\n  <div class="callout-title">${t.icon} ${t.label}</div>\n  <div class="callout-body">${body}</div>\n</div>`;
        i = blockEnd;
        continue;
      }
    }

    result += html.slice(blockStart, blockEnd);
    i = blockEnd;
  }

  return injectHeadingIds(result);
}

function injectHeadingIds(html: string): string {
  return html.replace(
    /<(h[1-6])>([\s\S]*?)<\/\1>/g,
    (match, tag, content) => {
      const text = content.replace(/<[^>]+>/g, '');
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      return `<${tag} id="${id}">${content}</${tag}>`;
    }
  );
}
