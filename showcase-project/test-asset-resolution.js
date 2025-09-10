// Quick test of asset resolution
import { resolveImagePath } from './api/utils/assets.ts';

console.log('Testing asset resolution:');
console.log('/data_projects.png ->', resolveImagePath('/data_projects.png'));
console.log('data_projects.png ->', resolveImagePath('data_projects.png'));
console.log('/coinview.png ->', resolveImagePath('/coinview.png'));
console.log('20240201_005129.jpg ->', resolveImagePath('20240201_005129.jpg'));
