import { VercelRequest, VercelResponse } from '@vercel/node';

// This endpoint will be called during build to get the processed asset URLs
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // During build, this will be populated by the frontend build process
  // For now, return empty - this will be updated by a build script
  const assetMap = {};

  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.json(assetMap);
}
