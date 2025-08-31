import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Generate asset manifest after Vite build
function generateAssetManifest() {
  const distPath = join(process.cwd(), 'client/dist');
  const assetsPath = join(distPath, 'assets');
  const manifestPath = join(distPath, 'asset-manifest.json');
  
  const manifest = {};
  
  // Read the public files that were copied directly
  const publicFiles = readdirSync(distPath).filter(file => 
    file.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/i) && 
    !file.startsWith('.')
  );
  
  publicFiles.forEach(file => {
    // Map original filename to actual path
    const originalName = file.replace(/_\d+(-[a-zA-Z0-9]+)?/, ''); // Remove timestamp and hash
    manifest[originalName] = `/${file}`;
  });
  
  // Read the assets folder for processed images
  try {
    const assetFiles = readdirSync(assetsPath).filter(file => 
      file.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/i)
    );
    
    assetFiles.forEach(file => {
      // Extract original filename from hashed filename
      const originalName = file.replace(/_\d+(-[a-zA-Z0-9]+)?\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/i, '.$2');
      manifest[originalName] = `/assets/${file}`;
    });
  } catch (error) {
    console.log('No assets directory found');
  }
  
  // Check subdirectories for organized assets
  const subDirs = ['creatives', 'data'];
  subDirs.forEach(dir => {
    const dirPath = join(distPath, dir);
    try {
      const files = readdirSync(dirPath).filter(file => 
        file.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/i)
      );
      files.forEach(file => {
        manifest[file] = `/${dir}/${file}`;
      });
    } catch (error) {
      // Directory doesn't exist, skip
    }
  });
  
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Asset manifest generated:', Object.keys(manifest).length, 'assets');
  console.log('Manifest sample:', Object.fromEntries(Object.entries(manifest).slice(0, 5)));
}

generateAssetManifest();
