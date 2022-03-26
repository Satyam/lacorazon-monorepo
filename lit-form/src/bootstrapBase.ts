import { LitElement, unsafeCSS } from 'lit';

export class BootBase extends LitElement {
  static override readonly styles = [
    unsafeCSS(
      Array.from(document.styleSheets)
        .map((ss) =>
          Array.from(ss.cssRules)
            .map((r) => r.cssText)
            .join('\n')
        )
        .join('\n')
    ),
  ];
}
