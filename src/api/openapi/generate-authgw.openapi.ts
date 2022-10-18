import fs from 'fs';
import * as OpenAPI from 'openapi-typescript-codegen';
import path from 'path';
import { fileURLToPath } from 'url';

import { AUTH_GW_ENDPOINT } from '../endpoints/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = `${AUTH_GW_ENDPOINT}/docs/openapi/authentication-gw.yml`;
const outputDir = `${__dirname}/generated`;

fs.rm(outputDir, { recursive: true, force: true }, err => {
  OpenAPI.generate({
    input: inputFile,
    output: outputDir,
    clientName: 'AuthGWClient',
    httpClient: 'axios',
  });
});
