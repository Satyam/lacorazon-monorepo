import { LitElement, html, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BootBase } from './bootstrapBase';
import { getTarget } from './utils';

export const ACCORDION_EVENT: 'accordionEvent' = 'accordionEvent' as const;

export class AccordionEvent extends Event {
  panelName: string;
  panelOpen: boolean;
  constructor(panelName: string, panelOpen: boolean) {
    super(ACCORDION_EVENT, { composed: true, bubbles: true });
    this.panelName = panelName;
    this.panelOpen = panelOpen;
  }
}

declare global {
  interface WindowEventMap {
    [ACCORDION_EVENT]: AccordionEvent;
  }
  interface HTMLElementEventMap {
    [ACCORDION_EVENT]: AccordionEvent;
  }
}

@customElement('accordion-base')
export class AccordionBase extends LitElement {
  static override readonly styles = [BootBase.styles];

  @property({ type: Boolean })
  multiple = false;

  private _panelsState: Record<string, boolean> = {};
  private _currentPanel?: string;

  public get panelsState() {
    return this._panelsState;
  }

  public get openPanel() {
    return this._currentPanel;
  }

  constructor() {
    super();
    this.addEventListener(ACCORDION_EVENT, this.toggleHandler);
  }
  private getPanels(): AccordionPanel[] {
    const slot = this.shadowRoot?.querySelector('slot');
    return slot
      ?.assignedElements({ flatten: true })
      ?.filter((p) => p instanceof AccordionPanel) as AccordionPanel[];
  }

  private toggleHandler = (ev: AccordionEvent) => {
    ev.stopPropagation();
    const { panelName, panelOpen } = ev;
    this._panelsState[panelName] = panelOpen;
    if (panelOpen) {
      if (!this.multiple) {
        if (this._currentPanel) {
          this.getPanels().some((p) => {
            if (p.name === this._currentPanel) {
              p.open = false;
            }
          });
        }
      }
      this._currentPanel = panelName;
    } else {
      if (this._currentPanel === panelName) this._currentPanel = undefined;
    }
  };

  protected override firstUpdated(): void {
    this.getPanels().forEach((p) => {
      if (!this.multiple) {
        if (this._currentPanel) {
          if (p.open) p.open = false;
        } else {
          if (p.open) this._currentPanel = p.name;
        }
      }
      this._panelsState[p.name] = p.open;
    });
  }

  protected override render() {
    return html`<slot></slot>`;
  }
}

@customElement('accordion-panel')
export class AccordionPanel extends LitElement {
  static override readonly styles = [BootBase.styles];

  @property({ type: String })
  name = '';

  @property({ type: String })
  heading = '';

  @property({ type: Boolean })
  open = false;

  @property({ attribute: false })
  content?: TemplateResult<1>;

  private toggleHandler(ev: Event) {
    const details = getTarget<HTMLDetailsElement>(ev);
    this.open = details.open;
    this.dispatchEvent(new AccordionEvent(this.name, this.open));
  }

  protected override render() {
    return html`<details
      class="card"
      ?open=${this.open}
      @toggle=${this.toggleHandler}
    >
      <summary class="card-header">${this.heading}</summary>
      ${this.open ? this.content : nothing}
    </details>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'accordion-base': AccordionBase;
    'accordion-panel': AccordionPanel;
  }
}
