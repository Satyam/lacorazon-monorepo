/* eslint-disable @typescript-eslint/no-namespace */
// import { ComponentChildren, createElement } from 'preact';
import { FormWrapper, TextField, EmailField } from '@lacorazon/lit-form';
import 'preact';
declare module 'preact/src/jsx' {
  namespace JSXInternal {
    // We're extending the IntrinsicElements interface which holds a kv-list of
    // available html-tags.
    interface IntrinsicElements {
      // 'form-wrapper': React.DetailedHTMLProps<
      //   React.HTMLAttributes<HTMLFormElement>,
      //   HTMLFormElement
      // >; // Normal web component
      'form-wrapper': React.DetailedHTMLProps<
        React.HTMLAttributes<FormWrapper>,
        FormWrapper
      >; // Normal web component
      // 'form-wrapper': FormWrapper;

      // 'text-field': React.DetailedHTMLProps<
      //   React.HTMLAttributes<HTMLInputElement> & {
      //     label: string;
      //     name: string;
      //   },
      //   HTMLInputElement
      // >; // Web component extended from input
      'text-field': React.DetailedHTMLProps<
        React.HTMLAttributes<TextField> & {
          label: string;
          name: string;
          value?: string;
          readonly?: boolean;
        },
        TextField
      >; // Web component extended from input
      // 'email-field': React.DetailedHTMLProps<
      //   React.HTMLAttributes<HTMLInputElement> & {
      //     label: string;
      //     name: string;
      //   },
      //   HTMLInputElement
      // >; // Web component extended from input
      'email-field': React.DetailedHTMLProps<
        React.HTMLAttributes<EmailField> & {
          label: string;
          name: string;
          value?: string;
          readonly?: boolean;
        },
        EmailField
      >; // Web component extended from input
    }
  }
}

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       'form-wrapper': React.DetailedHTMLProps<
//         React.HTMLAttributes<HTMLFormElement>,
//         HTMLFormElement
//       >; // Normal web component
//       'text-field': React.DetailedHTMLProps<
//         React.HTMLAttributes<HTMLInputElement>,
//         HTMLInputElement
//       >; // Web component extended from input
//       'email-field': React.DetailedHTMLProps<
//         React.HTMLAttributes<HTMLInputElement>,
//         HTMLInputElement
//       >; // Web component extended from input
//     }
//   }
// }
// // auto-generate these types using: https://github.com/coryrylan/custom-element-types
// type CustomEvents<K extends string> = {
//   [key in K]: (event: CustomEvent) => void;
// };
// type CustomElement<T, K extends string = ''> = Partial<
//   T & { children: ComponentChildren } & CustomEvents<`on${K}`>
// >;
// declare global {
//   namespace preact.createElement.JSX {
//     interface IntrinsicElements {
//       'form-wrapper': CustomElement<FormWrapper>;
//       'text-field': CustomElement<TextField>;
//       'email-field': CustomElement<EmailField>;
//     }
//   }
// }
