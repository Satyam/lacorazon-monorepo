import { DOMAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
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
