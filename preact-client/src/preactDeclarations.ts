/* eslint-disable @typescript-eslint/no-namespace */
// import { ComponentChildren, createElement } from 'preact';
import { FormSubmit, FormChanged } from '@lacorazon/lit-form';
import 'preact';
declare module 'preact/src/jsx' {
  namespace JSXInternal {
    interface IntrinsicElements {
      'form-wrapper': React.HTMLAttributes<HTMLFormElement> & {
        onformSubmit?: (ev: FormSubmit) => void;
        onformChanged?: (ev: FormChanged) => void;
      };
      'text-field': React.HTMLAttributes<HTMLInputElement> & {
        label: string;
        name: string;
        value?: string;
        readonly?: boolean;
      };
      'email-field': React.HTMLAttributes<HTMLInputElement> & {
        label: string;
        name: string;
        value?: string;
        readonly?: boolean;
      };
      'icon-add': React.HTMLAttributes<HTMLElement>;
      'icon-show': React.HTMLAttributes<HTMLElement>;
      'icon-edit': React.HTMLAttributes<HTMLElement>;
      'icon-danger': React.HTMLAttributes<HTMLElement>;
      'icon-trash': React.HTMLAttributes<HTMLElement>;
      'icon-add-person': React.HTMLAttributes<HTMLElement>;
      'icon-addto-cart': React.HTMLAttributes<HTMLElement>;
      'icon-wait': React.HTMLAttributes<HTMLElement>;
      'icon-logged-out': React.HTMLAttributes<HTMLElement>;
      'icon-logged-in': React.HTMLAttributes<HTMLElement>;
      'icon-question': React.HTMLAttributes<HTMLElement>;
      'icon-check-false': React.HTMLAttributes<HTMLElement>;
      'icon-check-true': React.HTMLAttributes<HTMLElement>;
      'icon-check': React.HTMLAttributes<HTMLElement>;
    }
  }
}
