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
 *
 * Iterates through the HTML finding each <blockquote>...</blockquote> pair
 * (accounting for nesting) and converts it to a callout div if the first
 * element inside is <p>[!TYPE]...</p>.
 * This correctly handles callouts that contain bullet lists, multiple
 * paragraphs, or other block elements — the old regex approach would fail
 * for these because it required </p> to be immediately followed by </blockquote>.
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

    // Append everything before this blockquote
    result += html.slice(i, blockStart);

    // Find the matching </blockquote> accounting for nesting depth
    let depth = 1;
    let j = blockStart + 12; // skip past '<blockquote>'

    while (j < html.length && depth > 0) {
      const nextOpen  = html.indexOf('<blockquote>', j);
      const nextClose = html.indexOf('</blockquote>', j);

      if (nextClose === -1) { depth = -1; break; } // malformed HTML

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        j = nextOpen + 12;
      } else {
        depth--;
        j = nextClose + 13; // skip past '</blockquote>'
      }
    }

    if (depth !== 0) {
      // Malformed — emit the rest unchanged
      result += html.slice(blockStart);
      break;
    }

    const blockEnd = j; // position just after the closing </blockquote>
    const inner = html.slice(blockStart + 12, blockEnd - 13);

    // Check if the first element is <p>[!TYPE]...</p>
    const typeMatch = inner.match(/^\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n?/i);
    if (typeMatch) {
      const type = typeMatch[1].toUpperCase();
      const t = CALLOUT_TYPES[type];
      if (t) {
        // Strip the [!TYPE] marker from the opening <p>, preserve the rest of the inner HTML
        const body = inner
          .replace(/^\s*<p>\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n?/i, '<p>')
          .trim();
        result += `<div class="callout ${t.cls}">\n  <div class="callout-title">${t.icon} ${t.label}</div>\n  <div class="callout-body">${body}</div>\n</div>`;
        i = blockEnd;
        continue;
      }
    }

    // Not a callout — keep as-is
    result += html.slice(blockStart, blockEnd);
    i = blockEnd;
  }

  return injectHeadingIds(result);
}

/**
 * Generate a GitHub-style anchor slug from heading text.
 * Matches how GitHub and most markdown renderers create heading IDs:
 * lowercase, strip non-word chars (except spaces/hyphens), spaces → hyphens.
 */
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // strip punctuation (em dashes become double spaces)
    .replace(/\s+/g, '-');    // spaces → hyphens (keeps double-hyphens from em dashes)
}

/**
 * Inject id attributes into <h1>–<h6> tags so that anchor links (#heading)
 * work correctly in the browser.
 */
function injectHeadingIds(html: string): string {
  return html.replace(
    /<(h[1-6])>([\s\S]*?)<\/\1>/g,
    (match, tag, content) => {
      const text = content.replace(/<[^>]+>/g, ''); // strip inner HTML
      const id = slugifyHeading(text);
      return `<${tag} id="${id}">${content}</${tag}>`;
    }
  );
}
