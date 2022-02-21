#!/usr/bin/env zx

const bootstrap = await fs.readFile(
  '../node_modules/bootstrap/dist/css/bootstrap.min.css'
);

await fs.writeFile(
  path.join(process.cwd(), 'src/bootstrapBase.ts'),
  `import { LitElement,  unsafeCSS } from 'lit';

export class BootBase extends LitElement {
  static override readonly styles = [unsafeCSS(\`${bootstrap}\`)];
}
`
);
