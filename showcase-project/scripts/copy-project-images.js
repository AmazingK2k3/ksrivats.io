import { mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const distPath = join(process.cwd(), 'client/dist');
const assetsPath = join(distPath, 'assets');

const imageMappings = [
  // eval-awareness images (filename only in dist/assets, need subdir in dist/project-images)
  { from: 'pipeline.png',                   to: 'project-images/eval-awareness/pipeline.png' },
  { from: 'rq1_metrics_comparison.png',     to: 'project-images/eval-awareness/rq1_metrics_comparison.png' },
  { from: 'rq1_roc_comparison.png',         to: 'project-images/eval-awareness/rq1_roc_comparison.png' },
  { from: 'rq1_vs_rq4_comparison.png',      to: 'project-images/eval-awareness/rq1_vs_rq4_comparison.png' },
  { from: 'rq4_awareness_rates.png',        to: 'project-images/eval-awareness/rq4_awareness_rates.png' },
  { from: 'rq4_metrics_table.png',          to: 'project-images/eval-awareness/rq4_metrics_table.png' },
  { from: 'rq6_consistency_distribution.png', to: 'project-images/eval-awareness/rq6_consistency_distribution.png' },
  { from: 'rq6_faking_rates.png',           to: 'project-images/eval-awareness/rq6_faking_rates.png' },
  // Cover images (renamed in assets to avoid Vite name collision, restored to original path)
  { from: 'parser-evals-cover.png',         to: 'project-images/parser-evals/cover.png' },
  { from: 'rag-pipeline-evals-cover.png',   to: 'project-images/rag-pipeline-evals/cover.png' },
];

let copied = 0;
for (const { from, to } of imageMappings) {
  const src = join(assetsPath, from);
  const dest = join(distPath, to);
  if (existsSync(src)) {
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
    console.log(`Copied: ${from} -> ${to}`);
    copied++;
  } else {
    console.warn(`Not found in dist/assets: ${from}`);
  }
}
console.log(`Project images copy complete: ${copied}/${imageMappings.length} files`);
