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
    }
  }
}
