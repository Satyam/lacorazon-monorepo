/* eslint-disable @typescript-eslint/no-namespace */
// import { ComponentChildren, createElement } from 'preact';
import { FormSubmit, FormChanged } from '@lacorazon/lit-form';
import 'preact';

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

declare module 'preact/src/jsx' {
  namespace JSXInternal {
    interface IntrinsicElements {
      'form-wrapper': JSXInternal.HTMLAttributes<HTMLFormElement> & {
        onformSubmit?: (ev: FormSubmit) => void;
        onformChanged?: (ev: FormChanged) => void;
        novalidate?: boolean;
      };
      'text-field': Omit<
        JSXInternal.HTMLAttributes<HTMLInputElement>,
        'value'
      > &
        FieldBaseAttrs & { value?: string; password?: boolean };
      'email-field': Omit<
        JSXInternal.HTMLAttributes<HTMLInputElement>,
        'value'
      > &
        FieldBaseAttrs & { value?: string };
      'date-field': Omit<
        JSXInternal.HTMLAttributes<HTMLInputElement>,
        'value'
      > &
        FieldBaseAttrs & { value?: Date };
      'number-field': Omit<
        JSXInternal.HTMLAttributes<HTMLInputElement>,
        'value'
      > &
        FieldBaseAttrs & { value?: number };
      'currency-field': Omit<
        JSXInternal.HTMLAttributes<HTMLInputElement>,
        'value'
      > &
        FieldBaseAttrs & { value?: number };
      'boolean-field': Omit<
        JSXInternal.HTMLAttributes<HTMLInputElement>,
        'value'
      > &
        FieldBaseAttrs & { value?: boolean; checkLabel?: string };
      'select-field': Omit<
        JSXInternal.HTMLAttributes<HTMLInputElement>,
        'value'
      > &
        FieldBaseAttrs & {
          value?: string;
          multiple?: boolean;
          size?: number;
          labelFieldName?: string;
          valueFieldName?: string;
          nullLabel?: string;
          options: Record<string, VALUE>;
        };
      'icon-add': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-show': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-edit': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-danger': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-trash': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-add-person': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-addto-cart': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-wait': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-logged-out': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-logged-in': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-question': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-check-false': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-check-true': JSXInternal.HTMLAttributes<HTMLElement>;
      'icon-check': Omit<JSXInternal.HTMLAttributes<HTMLElement>, 'value'> & {
        value: boolean;
      };
    }
  }
}
