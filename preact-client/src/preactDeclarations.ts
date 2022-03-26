/* eslint-disable @typescript-eslint/no-namespace */
// import { ComponentChildren, createElement } from 'preact';
import { FormSubmit } from '@lacorazon/lit-form';
import 'preact';
declare module 'preact/src/jsx' {
  namespace JSXInternal {
    // We're extending the IntrinsicElements interface which holds a kv-list of
    // available html-tags.
    interface IntrinsicElements {
      'form-wrapper': React.HTMLAttributes<HTMLFormElement> & {
        onFormSubmit?: (ev: FormSubmit) => void;
      };
      'text-field': React.HTMLAttributes<HTMLInputElement> & {
        label: string;
        name: string;
        value?: string;
        readonly?: boolean;
      }; // Web component extended from input
      'email-field': React.HTMLAttributes<HTMLInputElement> & {
        label: string;
        name: string;
        value?: string;
        readonly?: boolean;
      }; // Web component extended from input
    }
  }
}
