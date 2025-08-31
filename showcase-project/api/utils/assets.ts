import { readFileSync } from 'fs';
import { join } from 'path';

let assetManifest: Record<string, string> | null = null;

function loadAssetManifest(): Record<string, string> {
  if (assetManifest) {
    return assetManifest;
  }

  try {
    const manifestPath = join(process.cwd(), 'api-asset-manifest.json');
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    assetManifest = JSON.parse(manifestContent);
    return assetManifest || {};
  } catch (error) {
    console.warn('Asset manifest not found, using fallback paths');
    assetManifest = {};
    return {};
  }
}

export function getAssetPath(originalPath: string): string {
  const manifest = loadAssetManifest();
  
  // Try exact path match first
  if (manifest[originalPath]) {
    return manifest[originalPath];
  }
  
  // Try filename-only match
  const filename = originalPath.split('/').pop() || originalPath;
  if (manifest[filename]) {
    return manifest[filename];
  }
  
  // Try path without leading slash
  const pathWithoutSlash = originalPath.startsWith('/') ? originalPath.slice(1) : originalPath;
  if (manifest[pathWithoutSlash]) {
    return manifest[pathWithoutSlash];
  }
  
  // Try with leading slash
  const pathWithSlash = originalPath.startsWith('/') ? originalPath : `/${originalPath}`;
  if (manifest[pathWithSlash]) {
    return manifest[pathWithSlash];
  }
  
  // Fallback to original path
  console.warn(`Asset not found in manifest: ${originalPath}`);
  return originalPath;
}

export function resolveImagePath(imagePath: string, type?: string): string {
  if (!imagePath) return '';
  
  // Use the asset manifest system
  return getAssetPath(imagePath);
}
