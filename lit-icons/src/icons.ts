import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  svgPlusCircle,
  svgEye,
  svgPencil,
  svgDanger,
  svgTrash,
  svgPersonPlus,
  svgCartPlus,
  svgHourglass,
  svgPersonCheck,
  svgPersonX,
  svgQuestion,
  svgSquare,
  svgCheckSquareFill,
} from './iconSvgs';

export abstract class IconBase extends LitElement {
  protected abstract svg: TemplateResult<2>;
  override render() {
    return html`<svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        ${this.svg}
      </svg>
      <slot></slot>`;
  }
}

@customElement('icon-add')
export class IconAdd extends IconBase {
  svg = svgPlusCircle;
}

@customElement('icon-show')
export class IconShow extends IconBase {
  svg = svgEye;
}

@customElement('icon-edit')
export class IconEdit extends IconBase {
  svg = svgPencil;
}

@customElement('icon-danger')
export class IconDanger extends IconBase {
  svg = svgDanger;
}

@customElement('icon-trash')
export class IconTrash extends IconBase {
  svg = svgTrash;
}

@customElement('icon-add-person')
export class IconAddPerson extends IconBase {
  svg = svgPersonPlus;
}

@customElement('icon-addto-cart')
export class IconAddtoCart extends IconBase {
  svg = svgCartPlus;
}

@customElement('icon-wait')
export class IconWait extends IconBase {
  svg = svgHourglass;
}

@customElement('icon-logged-out')
export class IconLoggedOut extends IconBase {
  svg = svgPersonX;
}

@customElement('icon-logged-in')
export class IconLoggedIn extends IconBase {
  svg = svgPersonCheck;
}

@customElement('icon-question')
export class IconQuestion extends IconBase {
  svg = svgQuestion;
}

@customElement('icon-check-false')
export class IconCheckFalse extends IconBase {
  svg = svgSquare;
}

@customElement('icon-check-true')
export class IconCheckTrue extends IconBase {
  svg = svgCheckSquareFill;
}

@customElement('icon-check')
export class IconCheck extends IconBase {
  @property({
    type: Boolean,
    // converter is required because default converter simply checks the presence of the attribute
    // not the value so value={false} is still true
    converter: (value, type) => {
      console.log('converter', value, type);
      return value;
    },
  })
  value = false;

  svg = this.value ? svgCheckSquareFill : svgSquare;
}

declare global {
  interface HTMLElementTagNameMap {
    'icon-add': IconAdd;
    'icon-show': IconShow;
    'icon-edit': IconEdit;
    'icon-danger': IconDanger;
    'icon-trash': IconTrash;
    'icon-add-person': IconAddPerson;
    'icon-addto-cart': IconAddtoCart;
    'icon-wait': IconWait;
    'icon-logged-out': IconLoggedOut;
    'icon-logged-in': IconLoggedIn;
    'icon-question': IconQuestion;
    'icon-check-false': IconCheckFalse;
    'icon-check-true': IconCheckTrue;
    'icon-check': IconCheck;
  }
}
