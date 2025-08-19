import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

export default function addImports() {
  return {
    name: 'addImports',
    buildStart: () =>
      glob('./src/**/*.js')
        .then((g) =>
          ['jurisInstance.js', ...g.toSorted(), 'jurisRender.js']
            .map((f) => `import './${f}';`)
            .join('\n')
        )
        .then((patch) =>
          fs.writeFile(path.join(process.cwd(), 'index.js'), patch)
        ),
  };
}
