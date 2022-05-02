import { DOMAttributes } from 'react';
import { FormSubmit, FormChanged } from '@lacorazon/lit-form';

type FieldBaseAttrs = {
  label?: string;
  name: string;
  readonly?: boolean;
  placeholder?: string;
  errorFeedback?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'form-wrapper': DOMAttributes<HTMLFormElement> & {
        onformSubmit?: (ev: FormSubmit) => void;
        onformChanged?: (ev: FormChanged) => void;
        novalidate?: boolean;
      };
      'text-field': Omit<DOMAttributes<HTMLInputElement>, 'value'> &
        FieldBaseAttrs & { value?: string; password?: boolean };
      'email-field': Omit<DOMAttributes<HTMLInputElement>, 'value'> &
        FieldBaseAttrs & { value?: string };
      'date-field': Omit<DOMAttributes<HTMLInputElement>, 'value'> &
        FieldBaseAttrs & { value?: Date };
      'number-field': Omit<DOMAttributes<HTMLInputElement>, 'value'> &
        FieldBaseAttrs & { value?: number };
      'currency-field': Omit<DOMAttributes<HTMLInputElement>, 'value'> &
        FieldBaseAttrs & { value?: number };
      'boolean-field': Omit<DOMAttributes<HTMLInputElement>, 'value'> &
        FieldBaseAttrs & { value?: boolean; checkLabel?: string };
      'select-field': Omit<DOMAttributes<HTMLInputElement>, 'value'> &
        FieldBaseAttrs & {
          value?: string;
          multiple?: boolean;
          size?: number;
          labelFieldName?: string;
          valueFieldName?: string;
          nullLabel?: string;
          options: Record<string, VALUE>;
        };
      'icon-add': DOMAttributes<HTMLElement>;
      'icon-show': DOMAttributes<HTMLElement>;
      'icon-edit': DOMAttributes<HTMLElement>;
      'icon-danger': DOMAttributes<HTMLElement>;
      'icon-trash': DOMAttributes<HTMLElement>;
      'icon-add-person': DOMAttributes<HTMLElement>;
      'icon-addto-cart': DOMAttributes<HTMLElement>;
      'icon-wait': DOMAttributes<HTMLElement>;
      'icon-logged-out': DOMAttributes<HTMLElement>;
      'icon-logged-in': DOMAttributes<HTMLElement>;
      'icon-question': DOMAttributes<HTMLElement>;
      'icon-check-false': DOMAttributes<HTMLElement>;
      'icon-check-true': DOMAttributes<HTMLElement>;
      'icon-check': Omit<DOMAttributes<HTMLElement>, 'value'> & {
        value: boolean;
      };
    }
  }
}
