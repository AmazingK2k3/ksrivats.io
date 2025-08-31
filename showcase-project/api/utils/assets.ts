import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

let assetManifest: Record<string, string> | null = null;

function loadAssetManifest() {
  if (assetManifest) return assetManifest;
  
  const possiblePaths = [
    join(process.cwd(), 'client', 'dist', 'asset-manifest.json'),
    join('/var/task', 'client', 'dist', 'asset-manifest.json'),
    join(__dirname, '..', 'client', 'dist', 'asset-manifest.json'),
    join(__dirname, '..', '..', 'client', 'dist', 'asset-manifest.json'),
    join(process.cwd(), 'asset-manifest.json'),
    join('/var/task', 'asset-manifest.json')
  ];
  
  for (const manifestPath of possiblePaths) {
    if (existsSync(manifestPath)) {
      try {
        const content = readFileSync(manifestPath, 'utf-8');
        assetManifest = JSON.parse(content);
        console.log('Asset manifest loaded from:', manifestPath);
        return assetManifest;
      } catch (error) {
        console.error('Error loading asset manifest from', manifestPath, error);
      }
    }
  }
  
  console.warn('Asset manifest not found, using fallback paths');
  return {};
}

export function getAssetPath(originalPath: string): string {
  const manifest = loadAssetManifest() || {};
  
  // Clean the path - remove leading slashes and get just the filename
  const cleanPath = originalPath.replace(/^\/+/, '');
  const filename = cleanPath.split('/').pop() || cleanPath;
  
  // Try exact match first
  if (manifest[cleanPath]) {
    return manifest[cleanPath];
  }
  
  // Try filename match
  if (manifest[filename]) {
    return manifest[filename];
  }
  
  // For creative images, try with /creatives/ prefix if the original didn't have it
  if (!cleanPath.includes('/') && !cleanPath.startsWith('creatives/')) {
    const creativePath = `creatives/${filename}`;
    if (manifest[creativePath]) {
      return manifest[creativePath];
    }
  }
  
  // Fallback to original path
  console.warn('Asset not found in manifest:', originalPath, 'using fallback');
  return originalPath.startsWith('/') ? originalPath : `/${originalPath}`;
}

export function resolveImagePath(imageField: string | undefined, category: 'creative' | 'project' | 'post' = 'project'): string | null {
  if (!imageField) return null;
  
  // If it's already a full path, use asset resolution
  if (imageField.startsWith('/') || imageField.startsWith('http')) {
    return getAssetPath(imageField);
  }
  
  // For relative paths, assume they belong to the category folder
  const categoryPath = category === 'creative' ? `creatives/${imageField}` : imageField;
  return getAssetPath(categoryPath);
}
