import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { getTarget } from '../utils';

type FieldData = Record<string, VALUE>;
export class FormSubmit extends Event {
  values: FieldData;
  constructor(values: FieldData) {
    super('formSubmit', { composed: true, bubbles: true });
    this.values = values;
  }
}

@customElement('form-wrapper')
export class FormWrapper extends LitElement {
  @property({ type: Boolean })
  novalidate = false;

  @property()
  values: FieldData = {};

  private submitHandler = (ev: Event) => {
    const fieldValues: Record<string, VALUE> = {};

    const submitButton = getTarget<HTMLButtonElement>(ev);
    if (submitButton.name) {
      fieldValues[submitButton.name] = true;
    }
    const slot = this.shadowRoot?.querySelector('slot');
    const fields = slot?.assignedElements({ flatten: true });
    if (
      fields?.every((f) => {
        if (f instanceof FieldBase) {
          if (f.checkValidity()) {
            fieldValues[f.name] = f.value;
            return true;
          }
          return false;
        }
        return true;
      })
    ) {
      this.values = fieldValues;
      this.dispatchEvent(new FormSubmit(fieldValues));
    }
  };

  protected override firstUpdated(): void {
    const slot = this.shadowRoot?.querySelector('slot');
    const els = slot?.assignedElements({ flatten: true });
    if (els) {
      els.forEach((el) => {
        const tag = el.nodeName;
        if (tag === 'BUTTON' || tag === 'INPUT') {
          if ((el as HTMLButtonElement).type === 'submit') {
            el.addEventListener('click', this.submitHandler);
          }
        }
      });
    }
  }

  override render() {
    return html`<form
      ?novalidate=${this.novalidate}
      @submit=${this.submitHandler}
    >
      <slot></slot>
    </form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-wrapper': FormWrapper;
  }
}
