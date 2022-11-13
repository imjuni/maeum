import type IDatabaseRecord from '@config/interface/IDatabaseRecord';
import logging from '@logger/bootstrap';
import fs from 'fs';
import { parse } from 'jsonc-parser';
import path from 'path';

const log = logging(__filename);

export default function readJsonSchemaFile(): Record<string, IDatabaseRecord> {
  const dirname = path.join(__dirname, '..', 'files');
  const filename = 'store.json';
  const jsonSchemaBuf = fs.readFileSync(path.join(dirname, filename));
  const parsed = parse(jsonSchemaBuf.toString());

  log.trace('filename: ', filename);

  const keyRefs = Object.keys(parsed);

  keyRefs.forEach((keyRef) => {
    parsed[keyRef].rawSchema = JSON.stringify(parsed[keyRef].schema);
  });

  return parsed;
}
