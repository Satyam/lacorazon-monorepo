import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { FieldBase, InputChanged } from './fieldBase';
import { getTarget } from '../utils';

export type FieldData = Record<string, VALUE | undefined>;
export type DirtyFields = Record<string, boolean>;

export const FORM_SUBMIT_EVENT: 'formSubmit' = 'formSubmit' as const;
export class FormSubmit extends Event {
  values: FieldData;
  constructor(values: FieldData) {
    super('formSubmit', { composed: true, bubbles: true });
    this.values = values;
  }
}
export const FORM_CHANGED_EVENT: 'formChanged' = 'formChanged' as const;
export class FormChanged extends Event {
  form: FormWrapper;
  fieldName: string;
  value: VALUE;
  isDirty: boolean;
  constructor(
    form: FormWrapper,
    fieldName: string,
    value: VALUE,
    isDirty: boolean
  ) {
    super(FORM_CHANGED_EVENT, { composed: true, bubbles: true });
    this.form = form;
    this.fieldName = fieldName;
    this.value = value;
    this.isDirty = isDirty;
  }
}

declare global {
  interface HTMLElementEventMap {
    [FORM_SUBMIT_EVENT]: FormSubmit;
    [FORM_CHANGED_EVENT]: FormChanged;
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

  private elements(onlyFieldBase: true): FieldBase<VALUE>[];
  private elements(onlyFieldBase: false): HTMLElement[];
  private elements(onlyFieldBase: boolean): HTMLElement[] | FieldBase<VALUE>[] {
    const slot = this.shadowRoot?.querySelector('slot');
    const elements = slot?.assignedElements({ flatten: true });
    if (onlyFieldBase) {
      return elements?.filter(
        (el) => el instanceof FieldBase
      ) as FieldBase<VALUE>[];
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
    const fieldValues: FieldData = {};

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

  private inputChanged = (ev: InputChanged<VALUE>) => {
    ev.stopPropagation();
    const { isDirty, name, value } = ev;
    this.submitButtons.forEach((btn) => {
      btn.disabled = !isDirty;
    });
    this._dirtyFields[name] = isDirty;
    this._values[name] = value;
    this.dispatchEvent(new FormChanged(this, name, value, this.isDirty));
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
