# Markdown Rendering Features

This document is a **reference guide** for all supported markdown authoring features.
It is not parsed as a blog post — treat it like a README.

---

## Quick Reference

| Feature | Syntax | Notes |
|---------|--------|-------|
| Highlight | `==text==` | Yellow highlight via `<mark>` |
| Inline math | `$expr$` | KaTeX rendering |
| Block math | `$$expr$$` | Centred display math |
| Note callout | `> [!NOTE]` | Blue |
| Tip callout | `> [!TIP]` | Green |
| Important callout | `> [!IMPORTANT]` | Purple |
| Warning callout | `> [!WARNING]` | Amber |
| Caution callout | `> [!CAUTION]` | Red |
| Collapsible section | `<details><summary>…</summary>…</details>` | Native HTML |
| Hidden page | `hidden: true` in frontmatter | Not listed, URL still works |
| Image caption | `![alt](url)` then `*caption*` next line | Italic line after image |
| Code with copy button | Triple-backtick fence | Language for highlighting |
| Interactive citations | `[1]` inline + `## References` section | Hover/click to preview |

---

## 1. Syntax Highlighting & Copy Buttons

Use fenced code blocks with a language identifier:

````markdown
```python
print("hello world")
```
````

Supported languages include: `python`, `typescript`, `javascript`, `tsx`, `jsx`, `bash`, `sh`, `sql`, `json`, `yaml`, `toml`, `rust`, `go`, `java`, `c`, `cpp`, `markdown`, `html`, `css`, and many more (via highlight.js auto-detection).

A **Copy** button appears in the top-right corner of every code block and copies the raw text to the clipboard.

---

## 2. Callout / Alert Boxes

Use GitHub-style blockquote callouts. The keyword after `[!` must be uppercase:

```markdown
> [!NOTE]
> Supplementary context.

> [!TIP]
> A helpful suggestion.

> [!IMPORTANT]
> Must-read information.

> [!WARNING]
> Risk of unexpected behaviour.

> [!CAUTION]
> Dangerous operation — data loss possible.
```

Each callout type has a distinct colour scheme (light + dark mode) and an icon.

---

## 3. Highlighted Text

```markdown
This term is ==very important==.
```

Renders as yellow highlighted text using `<mark>`. Works inline anywhere.

---

## 4. Tables

Standard GFM (GitHub Flavoured Markdown) table syntax:

```markdown
| Column A | Column B | Column C |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

Features: alternating row shading, hover highlight, horizontal scroll on narrow screens.

---

## 5. Collapsible Sections

Use raw HTML `<details>` / `<summary>` tags:

```html
<details>
<summary>Click to expand</summary>

Content goes here — markdown works inside too.

- Bullet list
- Another item

</details>
```

> **Tip:** Leave a blank line before and after the inner content for markdown to parse correctly.

---

## 6. Math Equations (KaTeX)

### Inline

```markdown
The loss is $\mathcal{L} = -\sum_i y_i \log \hat{y}_i$.
```

### Block / Display

```markdown
$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$
```

Expressions are base64-encoded before being passed to the markdown parser so special characters (`_`, `*`, `\`, `{`, `}`) are not mangled. KaTeX renders them on the client.

---

## 7. Images & Captions

Place images in `client/public/blog-images/<post-slug>/` or `client/public/project-images/<project-slug>/`.

```markdown
![Alt text describing the image](/blog-images/my-post/figure1.png)
*Figure 1: A short caption describing the figure.*
```

The italic line immediately following the image becomes a centred caption.

---

## 8. Interactive Citations

End the post with an `## References` section:

```markdown
This idea was first proposed in [1] and later extended by [2].

## References

[1] Author, *Title*, Journal, Year. https://example.com
[2] Author B, *Another Title*, 2024.
```

- `[N]` markers in the body become clickable spans.
- **Desktop**: the citation card floats in the left margin at the same vertical position as the marker.
- **Mobile**: the card appears as a floating popover below the marker.
- **Click** to pin the card; click the same marker again to unpin.
- The card shows a **"Go to reference ↓"** link to scroll to the full reference entry.

---

## 9. Hidden / Unlisted Pages

Add to frontmatter:

```yaml
---
hidden: true
---
```

The post/project will:
- **Not appear** in the blog listing, project grid, or any index API.
- **Still be accessible** at its direct URL (`/blog/<slug>` or `/projects/<slug>`).

Useful for draft content, internal demos, or posts you want to share privately via link.

---

## Frontmatter Fields

### Posts

```yaml
---
title: "Post Title"
slug: "url-friendly-slug"
date: "YYYY-MM-DD"
tags: ["Tag1", "Tag2"]
category: "Category Name"
excerpt: "One-sentence summary shown in listings."
featured: true           # appears in featured section
hidden: false            # set true to unlist
---
```

### Projects

```yaml
---
title: "Project Title"
slug: "url-friendly-slug"
date: "YYYY-MM-DD"
tags: ["Python", "ML"]
category: "Machine Learning"
excerpt: "Short description."
cover: "/project-images/slug/cover.png"   # card thumbnail
featured: true
hidden: false
---
```

---

## File Locations

| Type | Location |
|------|----------|
| Blog posts | `content/posts/<slug>.md` |
| Projects | `content/projects/<slug>.md` |
| Blog images | `client/public/blog-images/<slug>/` |
| Project images | `client/public/project-images/<slug>/` |
| This doc | `MARKDOWN_FEATURES.md` (repo root area) |

---

## Known Limitations

- **Mermaid diagrams**: Not supported. Export diagrams as PNG/SVG and embed as images.
- **Nested callouts**: Only one level of callout per blockquote.
- **Math in code blocks**: Dollar signs inside fenced blocks are treated as literal text (correct behaviour).
- **HTML in tables**: Avoid complex HTML inside table cells; plain text and inline markdown only.
