# Adding Images to the Portfolio

This document is the single source of truth for how images work in this project and how to add new ones correctly. Read it before adding any image to avoid the routing/404 issues that were painful to debug.

---

## How Images Work (The Architecture)

All images go through **Vite's asset pipeline**:

1. Images are placed in `client/src/assets/images/` and **imported** in `client/src/lib/assets.ts`
2. At build time, Vite processes them into `client/dist/assets/<filename>.ext` (no hash for images, per `vite.config.ts`)
3. The API (`api/utils/assets.ts` + `api/utils/markdown.ts`) **always returns `/assets/<filename>.ext` paths** — never the original `/project-images/...` or `/creatives/...` paths
4. In production (Vercel), the browser fetches `/assets/<filename>.ext` directly from `dist/assets/`
5. In local dev, `server/vite.ts` serves the source images at `/assets/<filename>` to match

**Why not `client/public/`?**
The parent `.gitignore` (Quartz) ignores all `public/` directories at any depth. Files in `client/public/` are never committed to git and therefore never reach Vercel.

---

## Content Types and Their Image Rules

### 1. Project Images (`content/projects/*.md`)

**Cover image** — referenced in frontmatter:
```yaml
cover: "/project-images/eval-awareness/pipeline.png"
```
The API's `resolveImagePath()` converts this to `/assets/pipeline.png` before sending to the client.

**Inline images** — referenced in markdown body:
```markdown
![Alt text](/project-images/eval-awareness/rq1_metrics_comparison.png)
```
The API's `postprocessHtml()` rewrites all `src="/project-images/..."` to `src="/assets/<filename>"` in the rendered HTML.

**You write paths as `/project-images/<project-slug>/<filename>`** in markdown. The system handles the rest.

---

### 2. Creative Images (`content/creatives/*.md`)

**Cover image** — referenced in frontmatter by **filename only** (no path):
```yaml
image: "art-1_1.jpg"
```
The API prepends `/creatives/` → `/creatives/art-1_1.jpg`. Vercel routes `/creatives/<filename>` → `/assets/<filename>`.

Inline images in creative posts work the same way as projects.

---

### 3. Blog Post Images (`content/posts/*.md`)

Currently blog posts do not use images in frontmatter. Inline images can be added in the markdown body using the same `/project-images/` convention if the post is a project-related post, or `/blog-images/` convention for standalone blog images.

> Blog images placed in `/blog-images/` are served from `dist/blog-images/` and require the image to be added to `client/public/blog-images/` **and** committed via a gitignore fix, OR served via assets.ts imports. Use the assets.ts approach (same as projects) for reliability.

---

## Step-by-Step: Adding Images to a New Project

### Step 1 — Put the image file in the right place

```
client/src/assets/images/project-images/<project-slug>/
```

**Naming rule:** Use descriptive, unique filenames. **Avoid generic names like `cover.png`, `figure1.png`** — Vite uses `[name].[ext]` with no hash for images, so two files named `cover.png` from different projects would collide in `dist/assets/`.

Good examples:
```
client/src/assets/images/project-images/my-project/my-project-cover.png
client/src/assets/images/project-images/my-project/architecture-diagram.png
client/src/assets/images/project-images/my-project/results-table.png
```

Bad examples (name collision risk):
```
client/src/assets/images/project-images/my-project/cover.png   ← AVOID
client/src/assets/images/project-images/my-project/figure1.png ← AVOID
```

### Step 2 — Register the image in `assets.ts`

Open [client/src/lib/assets.ts](client/src/lib/assets.ts) and add an import + an entry in `assetUrls`:

```typescript
// At the top with other project image imports:
import myProjectCover from '../assets/images/project-images/my-project/my-project-cover.png';
import myProjectDiagram from '../assets/images/project-images/my-project/architecture-diagram.png';

// In the assetUrls object:
'/project-images/my-project/my-project-cover.png': myProjectCover,
'/project-images/my-project/architecture-diagram.png': myProjectDiagram,
```

> **Why?** The import statement is the only thing that tells Vite to process and include the image in the build. Without it, the image won't exist in `dist/assets/` on Vercel.

### Step 3 — Reference images in the markdown file

In `content/projects/<project-slug>.md`:

```yaml
---
title: "My Project"
slug: "my-project"
cover: "/project-images/my-project/my-project-cover.png"
---

Some text...

![Architecture diagram](/project-images/my-project/architecture-diagram.png)
*Caption for the diagram*
```

Write the paths as `/project-images/<slug>/<filename>`. The API automatically converts these to `/assets/<filename>` — you never need to reference `/assets/` directly in markdown.

### Step 4 — Update the dev server if this is a new project subdirectory

The dev server in `server/vite.ts` automatically discovers all subdirectories under `project-images/` and serves them at `/assets/`. No changes needed there.

### Step 5 — Commit everything

```bash
git add client/src/assets/images/project-images/my-project/
git add client/src/lib/assets.ts
git add content/projects/my-project.md
git commit -m "Add my-project with images"
```

---

## Step-by-Step: Adding a Creative

### Step 1 — Put the image in:
```
client/src/assets/images/creatives/<filename>
```

### Step 2 — Register in `assets.ts`:
```typescript
import myCreative from '../assets/images/creatives/my-artwork-2025.jpg';

// In assetUrls (filename-only key, no path):
'my-artwork-2025.jpg': myCreative,
```

### Step 3 — Create the content file `content/creatives/<slug>.md`:
```yaml
---
title: "My Artwork"
slug: "my-artwork"
image: "my-artwork-2025.jpg"   ← filename only, no path prefix
tags: ["digital-art"]
featured: false
---
```

---

## The Rename Rule for Cover Images

If a project's cover image has a generic name that clashes with another project (e.g., both `parser-evals` and `rag-pipeline-evals` had `cover.png`), rename the **file on disk** to be globally unique, then add an explicit mapping in `api/utils/assets.ts`:

```typescript
// In api/utils/assets.ts — PROJECT_IMAGE_RENAMES:
'/project-images/my-project/cover.png': '/assets/my-project-cover.png',
```

And the file on disk should be:
```
client/src/assets/images/project-images/my-project-cover.png  ← renamed
```

**Always prefer unique names upfront** to avoid needing this workaround.

---

## Where Each Part Lives (Quick Reference)

| What | Where |
|------|--------|
| Source images (projects) | `client/src/assets/images/project-images/<slug>/` |
| Source images (creatives) | `client/src/assets/images/creatives/` |
| Vite import registration | `client/src/lib/assets.ts` |
| Cover path → asset URL | `api/utils/assets.ts` → `resolveImagePath()` |
| Inline image path rewrite | `api/utils/markdown.ts` → `rewriteProjectImageSrcs()` |
| Dev server asset serving | `server/vite.ts` → `setupVite()` |
| Vercel asset route | `vercel.json` → `/assets/(.*\.(png|...))` route |
| Built images (prod) | `client/dist/assets/` |

---

## Troubleshooting

**Image is 404 on Vercel:**
- Check the image is imported in `client/src/lib/assets.ts`
- Check the filename doesn't collide with another image (see rename rule)
- Check that the file is committed to git (`git ls-files | grep your-image`)

**Image works locally but 404 on Vercel:**
- Almost always means the image file is not committed. Run `git ls-files | grep your-image` — if empty, `git add` it.

**Image renders a broken icon locally:**
- Check the path in the markdown matches the actual filename (case-sensitive on Linux/Vercel)
- Check the import in `assets.ts` exists

**Adding a new content type (not project/creative/post):**
- Add path rewriting logic to `api/utils/assets.ts` `resolveImagePath()`
- Add inline src rewriting to `api/utils/markdown.ts` `rewriteProjectImageSrcs()`
- Add dev serving in `server/vite.ts` `setupVite()`
