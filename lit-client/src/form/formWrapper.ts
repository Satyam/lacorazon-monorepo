import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { FieldBase, InputChanged } from './fieldBase';
import { getTarget } from '../utils';

export type FieldData = Record<string, VALUE>;
export type DirtyFields = Record<string, boolean>;

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

  @state()
  wasValidated = false;

  _values: FieldData = {};
  _dirtyFields: DirtyFields = {};

  public get values() {
    return this._values;
  }

  public get dirtyFields() {
    return this._dirtyFields;
  }

  public get isDirty() {
    const elements = this.elements(true);
    if (elements) {
      return elements.some((f) => f.isDirty);
    }
    return false;
  }

  private submitButtons: HTMLButtonElement[] = [];

  private elements(onlyFieldBase: true): FieldBase[];
  private elements(onlyFieldBase: false): HTMLElement[];
  private elements(onlyFieldBase: boolean): HTMLElement[] | FieldBase[] {
    const slot = this.shadowRoot?.querySelector('slot');
    const elements = slot?.assignedElements({ flatten: true });
    if (onlyFieldBase) {
      return elements?.filter((el) => el instanceof FieldBase) as FieldBase[];
    } else {
      return elements as HTMLElement[];
    }
  }

  public reset(): void {
    const elements = this.elements(true);
    if (elements) {
      elements.forEach((el) => el.reset());
    }
  }

  private resetHandler = () => {
    this.reset();
  };

  private submitHandler = (ev: Event) => {
    const fieldValues: Record<string, VALUE> = {};

    const submitButton = getTarget<HTMLButtonElement>(ev);
    if (submitButton.name) {
      fieldValues[submitButton.name] = true;
    }
    const fields = this.elements(true);
    this.wasValidated = true;
    if (
      fields?.every((f) => {
        if (f.checkValidity()) {
          fieldValues[f.name] = f.value;
          return true;
        }
        return false;
      })
    ) {
      this._values = fieldValues;
      this.dispatchEvent(new FormSubmit(fieldValues));
    }
  };

  private inputChanged = (ev: InputChanged) => {
    this.submitButtons.forEach((btn) => {
      btn.disabled = !ev.isDirty;
    });
    this._dirtyFields[ev.name] = ev.isDirty;
    this._values[ev.name] = ev.value;
  };

  protected override firstUpdated(): void {
    const els = this.elements(false);
    if (els) {
      els.forEach((el) => {
        if (el instanceof FieldBase) {
          this._values[el.name] = el.value;
          this._dirtyFields[el.name] = false;
        } else {
          const tag = el.nodeName;
          if (tag === 'BUTTON' || tag === 'INPUT') {
            switch ((el as HTMLButtonElement).type) {
              case 'submit':
                this.submitButtons.push(el as HTMLButtonElement);
                el.addEventListener('click', this.submitHandler);
                break;
              case 'reset':
                el.addEventListener('click', this.resetHandler);
                break;
            }
          }
        }
      });
    }
  }

  override render() {
    return html`<form
      ?novalidate=${this.novalidate}
      @submit=${this.submitHandler}
      @inputChanged=${this.inputChanged}
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
