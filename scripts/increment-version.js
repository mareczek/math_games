import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to version files
const versionTsPath = path.resolve(__dirname, '../src/version.ts');
const versionJsonPath = path.resolve(__dirname, '../public/version.json');

// Read current version from version.ts
const versionTsContent = fs.readFileSync(versionTsPath, 'utf8');
const versionMatch = versionTsContent.match(/APP_VERSION\s*=\s*['"]([^'"]+)['"]/);

if (!versionMatch) {
  console.error('Could not find version in version.ts');
  process.exit(1);
}

const currentVersion = versionMatch[1];
console.log(`Current version: ${currentVersion}`);

// Parse version components
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Increment patch version
const newVersion = `${major}.${minor}.${patch + 1}`;
console.log(`New version: ${newVersion}`);

// Update version.ts
const newVersionTsContent = versionTsContent.replace(
  /APP_VERSION\s*=\s*['"][^'"]+['"]/,
  `APP_VERSION = '${newVersion}'`
);
fs.writeFileSync(versionTsPath, newVersionTsContent);

// Update version.json
const versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
versionJson.version = newVersion;
fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2) + '\n');

console.log('Version updated successfully!');

// Git operations
try {
  // Get the root directory of the project
  const rootDir = path.resolve(__dirname, '..');

  // Stage the changed files
  console.log('Staging version files...');
  execSync('git add src/version.ts public/version.json', { cwd: rootDir });

  // Commit the changes
  console.log('Committing version bump...');
  execSync(`git commit -m "Bump version to ${newVersion}"`, { cwd: rootDir });

  // Push to origin
  console.log('Pushing to origin...');
  execSync('git push origin', { cwd: rootDir });

  console.log('Git operations completed successfully!');
} catch (error) {
  console.error('Git operation failed:', error.message);
  process.exit(1);
}