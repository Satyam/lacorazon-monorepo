import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export default function relPath(path: string = '.') {
  return resolve(dirname(fileURLToPath(import.meta.url)), path);
}
