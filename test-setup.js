/**
 * Vitest setup file.
 * Loads calculators.js into the global scope so test files can import
 * functions as if they were loaded by a browser <script> tag.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const code = readFileSync(join(__dirname, 'calculators.js'), 'utf-8');

// Run calculators.js in a context that has access to globalThis
// so all functions become globally available
vm.runInThisContext(code);
