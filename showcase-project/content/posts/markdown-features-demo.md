---
title: "Markdown Rendering Features — Complete Demo"
slug: "markdown-features-demo"
date: "2026-02-21"
tags: ["Meta", "Writing", "Demo"]
category: "Site"
excerpt: "A live showcase of every markdown rendering feature supported on this blog — code blocks, callouts, math, tables, collapsible sections, and more."
featured: false
hidden: true
---

This post is a living demo of every supported markdown feature. Open it any time to check how a feature renders, or copy the syntax into your own posts.

---

## 1. Code Blocks

Fenced code blocks get automatic syntax highlighting (via highlight.js) and a one-click copy button.

```python
import numpy as np
from sklearn.metrics import roc_auc_score

def bootstrap_auc(y_true, y_score, n=1000, seed=42):
    """Estimate 95% CI for AUC via bootstrap."""
    rng = np.random.default_rng(seed)
    aucs = []
    for _ in range(n):
        idx = rng.choice(len(y_true), len(y_true), replace=True)
        aucs.append(roc_auc_score(y_true[idx], y_score[idx]))
    lo, hi = np.percentile(aucs, [2.5, 97.5])
    return np.mean(aucs), lo, hi

mean_auc, lo, hi = bootstrap_auc(labels, scores)
print(f"AUC: {mean_auc:.3f} [{lo:.3f}, {hi:.3f}]")
```

```typescript
// TypeScript — strongly-typed API client
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

async function chat(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  return data.reply;
}
```

```bash
# Inline shell commands
npm install && npm run dev
git log --oneline --graph --all
```

---

## 2. Callout / Alert Boxes

Use GitHub-style blockquote callouts to draw attention to important information.

> [!NOTE]
> Notes provide supplementary context — facts worth knowing but not critical to understanding.

> [!TIP]
> Tips offer actionable shortcuts or best-practice suggestions.

> [!IMPORTANT]
> Important callouts highlight information the reader must not skip.

> [!WARNING]
> Warnings signal that ignoring this could cause unexpected or hard-to-reverse results.

> [!CAUTION]
> Caution boxes flag dangerous operations — things that can break your system or lose data.

---

## 3. Highlighted / Marked Text

Wrap text in `==double equals==` to ==highlight it== inline — useful for key terms or definitions that you want to draw the eye to.

You can highlight ==multiple phrases== in ==a single paragraph== without any issue.

---

## 4. Tables

Standard GFM table syntax renders with alternating row colours and hover highlights.

| Model | Params (B) | ARC | HellaSwag | MMLU | TruthfulQA |
|-------|-----------|-----|-----------|------|-----------|
| GPT-4o | ~200 | 96.3 | 95.7 | 87.5 | 77.8 |
| Claude 3.5 Sonnet | ~70 | 93.1 | 95.1 | 88.7 | 80.2 |
| Llama 3.1 70B | 70 | 89.4 | 93.8 | 82.0 | 53.3 |
| Gemma 2 27B | 27 | 85.7 | 90.2 | 75.2 | 50.8 |
| Mistral 7B | 7 | 74.2 | 81.0 | 64.2 | 43.0 |

Tables can also be used for quick comparisons or option grids.

---

## 5. Collapsible Sections

Wrap content in native HTML `<details>` / `<summary>` tags for expandable sections. Great for long derivations, appendices, or optional deep-dives.

<details>
<summary>Full derivation of the softmax gradient</summary>

Given the softmax function:

$$\sigma(z)_i = \frac{e^{z_i}}{\sum_j e^{z_j}}$$

We want $\frac{\partial \sigma_i}{\partial z_k}$.

**Case 1: $i = k$**

$$\frac{\partial \sigma_i}{\partial z_i} = \sigma_i(1 - \sigma_i)$$

**Case 2: $i \neq k$**

$$\frac{\partial \sigma_i}{\partial z_k} = -\sigma_i \sigma_k$$

Combined in matrix form: $\frac{\partial \boldsymbol{\sigma}}{\partial \mathbf{z}} = \text{diag}(\boldsymbol{\sigma}) - \boldsymbol{\sigma}\boldsymbol{\sigma}^T$

</details>

<details>
<summary>Expanded dataset details</summary>

The evaluation used 3 datasets:

- **MMLU**: 57 subjects, 14,042 questions, 4-choice multiple choice
- **HellaSwag**: 10,042 examples of commonsense NLI (completion)
- **ARC Challenge**: 1,172 science questions curated for difficulty

All datasets were run zero-shot with greedy decoding (temperature = 0).

</details>

---

## 6. Math Equations

Use `$...$` for inline math and `$$...$$` for display (block) math. Expressions are rendered by KaTeX.

### Inline math

The attention mechanism computes $\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^T}{\sqrt{d_k}}\right)V$ where $d_k$ is the key dimension.

Training uses cross-entropy loss $\mathcal{L} = -\sum_i y_i \log \hat{y}_i$ with AdamW at learning rate $\eta = 3 \times 10^{-4}$.

### Block math

The transformer attention formula:

$$\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

The evidence lower bound (ELBO) for a VAE:

$$\mathcal{L}(\theta, \phi; x) = \mathbb{E}_{q_\phi(z|x)}\!\left[\log p_\theta(x|z)\right] - D_{\text{KL}}\!\left(q_\phi(z|x) \,\|\, p(z)\right)$$

Bayes' theorem in continuous form:

$$p(\theta \mid x) = \frac{p(x \mid \theta)\, p(\theta)}{\int p(x \mid \theta')\, p(\theta')\, d\theta'}$$

---

## 7. Images & Captions

Standard markdown image syntax. Place images in `/blog-images/<post-slug>/`.

The line immediately after the image, written as italics, becomes the caption:

```markdown
![Description](/blog-images/post-slug/figure.png)
*Figure 1: A short descriptive caption.*
```

---

## 8. Citations & References

Inline markers like [1] and [2] become interactive — hover or click to preview the reference in the sidebar (desktop) or as a floating card (mobile).

For this to work, end the post with a `## References` section using `[N] text` format:

This blog uses a hybrid citation style inspired by LessWrong [1] and academic papers [2]. Interactive citations improve reading flow by letting readers preview sources without leaving the page [3].

## References

[1] LessWrong — rationalist writing community. https://www.lesswrong.com

[2] Vaswani et al., *Attention Is All You Need*, NeurIPS 2017. https://arxiv.org/abs/1706.03762

[3] Nielsen, J., "Progressive Disclosure", Nielsen Norman Group, 2006. https://www.nngroup.com/articles/progressive-disclosure/

---

## 9. Hidden / Unlisted Pages

Add `hidden: true` to the frontmatter of any post or project. It will still be accessible via direct URL but will not appear in listings or feeds. Useful for draft demos like this one:

```yaml
---
title: "My Draft Post"
hidden: true
---
```

---

## Syntax Quick Reference

| Feature | Markdown Syntax |
|---------|----------------|
| Highlight | `==text==` |
| Inline math | `$E = mc^2$` |
| Block math | `$$...\n...$$` |
| Note callout | `> [!NOTE]\n> body` |
| Tip callout | `> [!TIP]\n> body` |
| Warning | `> [!WARNING]\n> body` |
| Collapsible | `<details><summary>Label</summary>...</details>` |
| Hidden page | `hidden: true` in frontmatter |
| Image caption | `![alt](url)` then `*caption*` on next line |
