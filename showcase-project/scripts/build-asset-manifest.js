import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

// Generate asset manifest that maps original paths to Vite-processed URLs
function generateAssetManifest() {
  const distPath = join(process.cwd(), 'client/dist');
  const manifestPath = join(distPath, 'asset-manifest.json');
  
  console.log('Generating asset manifest from:', distPath);
  
  if (!existsSync(distPath)) {
    console.error('Dist directory not found:', distPath);
    return;
  }
  
  // Read the Vite manifest to get actual asset URLs
  const viteManifestPath = join(distPath, '.vite', 'manifest.json');
  let viteManifest = {};
  
  if (existsSync(viteManifestPath)) {
    try {
      viteManifest = JSON.parse(readFileSync(viteManifestPath, 'utf-8'));
      console.log('Loaded Vite manifest with', Object.keys(viteManifest).length, 'entries');
    } catch (error) {
      console.log('Could not load Vite manifest:', error.message);
    }
  }
  
  const manifest = {};
  
  // Map assets from Vite manifest
  Object.entries(viteManifest).forEach(([key, value]) => {
    if (key.includes('.png') || key.includes('.jpg') || key.includes('.jpeg') || 
        key.includes('.gif') || key.includes('.svg') || key.includes('.webp')) {
      
      // Extract filename from path
      const filename = key.split('/').pop();
      const originalPath = key.replace('../public/', '/');
      
      manifest[originalPath] = `/${value.file}`;
      manifest[filename] = `/${value.file}`;
      
      console.log(`Mapped: ${originalPath} -> /${value.file}`);
    }
  });
  
  // Also check the assets directory directly
  const assetsPath = join(distPath, 'assets');
  if (existsSync(assetsPath)) {
    const assetFiles = readdirSync(assetsPath).filter(file => 
      file.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/i)
    );
    
    assetFiles.forEach(file => {
      // Map back to original filenames by removing Vite hash
      let originalName = file;
      
      // Remove Vite hash pattern: -[hash].[ext]
      originalName = originalName.replace(/-[a-zA-Z0-9_-]+(\.[^.]+)$/, '$1');
      
      // Special mappings for project covers (absolute paths)
      const projectCovers = {
        '1_1752220578130.png': '/1_1752220578130.png',
        'coinview.png': '/coinview.png', 
        'data_projects.png': '/data_projects.png',
        'design.png': '/design.png',
        'favicon.png': '/favicon.png',
        'logo-backup.png': '/logo-backup.png',
        'logo-light.png': '/logo-light.png',
        'logo-main.png': '/logo-main.png',
        'logo-main2.png': '/logo-main2.png',
        'zeitgeist.png': '/zeitgeist.png'
      };
      
      if (projectCovers[originalName]) {
        manifest[projectCovers[originalName]] = `/assets/${file}`;
        console.log(`Project cover: ${projectCovers[originalName]} -> /assets/${file}`);
      }
      
      // Creative images (filename only for relative references)
      manifest[originalName] = `/assets/${file}`;
      console.log(`Asset mapped: ${originalName} -> /assets/${file}`);
    });
  }
  
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Asset manifest generated with', Object.keys(manifest).length, 'mappings');
  
  // Also write it for the API to access
  const apiManifestPath = join(process.cwd(), 'api-asset-manifest.json');
  writeFileSync(apiManifestPath, JSON.stringify(manifest, null, 2));
  console.log('API asset manifest written to:', apiManifestPath);

  // Copy to client dist for Vercel deployment
  const distManifestPath = join(distPath, 'api-asset-manifest.json');
  writeFileSync(distManifestPath, JSON.stringify(manifest, null, 2));
  console.log('Dist asset manifest written to:', distManifestPath);
}

generateAssetManifest();
