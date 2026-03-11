import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const input = resolve(__dirname, '../openapi/patient.json');
const output = resolve(__dirname, '../src/types/generated/patient-api.ts');

try {
  execSync(`npx openapi-typescript "${input}" -o "${output}"`, {
    stdio: 'inherit',
  });
  console.log(`Generated: ${output}`);
} catch (error) {
  console.error(
    'Failed to generate OpenAPI types. Ensure openapi/patient.json exists and openapi-typescript is available.',
  );
  process.exit(1);
}
