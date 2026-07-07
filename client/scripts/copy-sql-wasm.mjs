import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, '../node_modules/sql.js/dist/sql-wasm.wasm');
const destDir = resolve(root, 'public');
const dest = resolve(destDir, 'sql-wasm.wasm');

if (!existsSync(src)) {
  console.warn('[copy-sql-wasm] sql-wasm.wasm not found — run npm install from repo root');
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log('[copy-sql-wasm] Copied sql-wasm.wasm to client/public/');
