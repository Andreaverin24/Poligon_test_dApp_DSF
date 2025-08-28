// write-version.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const version = require('./package.json').version;
const commit = execSync('git rev-parse --short HEAD').toString().trim();
const timestamp = new Date().toISOString();

const content = `// Auto-generated
export const APP_VERSION = '${version}-${commit}';
export const BUILD_TIMESTAMP = '${timestamp}';
`;

fs.writeFileSync(path.resolve(__dirname, 'src/version.ts'), content);
console.log(`version.ts created: ${version}-${commit}`);
