import { LitElement, unsafeCSS } from 'lit';

export class BootBase extends LitElement {
  static override readonly styles = [
    unsafeCSS(
      Array.from(document.styleSheets[0].cssRules)
        .map((r) => r.cssText)
        .join('\n')
    ),
  ];
}
