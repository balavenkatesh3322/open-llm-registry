import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const readmeSrc = path.join(rootDir, 'README.md');
const readmeDest = path.join(rootDir, 'dist', 'README.md');

console.log('--- Running Post-Build Process ---');

if (fs.existsSync(readmeSrc)) {
  try {
    // Ensure dist directory exists
    const distDir = path.join(rootDir, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    fs.copyFileSync(readmeSrc, readmeDest);
    console.log(`Successfully copied README.md to ${readmeDest}`);
    console.log('OpenLLM Index deployed assets prepared for gh-pages branch.');
  } catch (err) {
    console.error('Error copying README.md to dist:', err);
  }
} else {
  console.warn('Warning: README.md not found in workspace root. Skipping copy.');
}
