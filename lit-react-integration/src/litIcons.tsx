import * as React from 'react';
import { createComponent } from '@lit-labs/react';

import {
  IconAdd as LitIconAdd,
  IconShow as LitIconShow,
  IconEdit as LitIconEdit,
  IconDanger as LitIconDanger,
  IconTrash as LitIconTrash,
  IconAddPerson as LitIconAddPerson,
  IconAddtoCart as LitIconAddtoCart,
  IconWait as LitIconWait,
  IconLoggedOut as LitIconLoggedOut,
  IconLoggedIn as LitIconLoggedIn,
  IconQuestion as LitIconQuestion,
  IconCheckFalse as LitIconCheckFalse,
  IconCheckTrue as LitIconCheckTrue,
  IconCheck as LitIconCheck,
} from '@lacorazon/lit-icons';

export const IconAdd = createComponent(React, 'icon-add', LitIconAdd, {});
export const IconShow = createComponent(React, 'icon-show', LitIconShow, {});
export const IconEdit = createComponent(React, 'icon-edit', LitIconEdit, {});
export const IconDanger = createComponent(
  React,
  'icon-danger',
  LitIconDanger,
  {}
);
export const IconTrash = createComponent(React, 'icon-trash', LitIconTrash, {});
export const IconAddPerson = createComponent(
  React,
  'icon-add-person',
  LitIconAddPerson,
  {}
);
export const IconAddtoCart = createComponent(
  React,
  'icon-addto-cart',
  LitIconAddtoCart,
  {}
);
export const IconWait = createComponent(React, 'icon-wait', LitIconWait, {});
export const IconLoggedOut = createComponent(
  React,
  'icon-logged-out',
  LitIconLoggedOut,
  {}
);
export const IconLoggedIn = createComponent(
  React,
  'icon-logged-in',
  LitIconLoggedIn,
  {}
);
export const IconQuestion = createComponent(
  React,
  'icon-question',
  LitIconQuestion,
  {}
);
export const IconCheckFalse = createComponent(
  React,
  'icon-check-false',
  LitIconCheckFalse,
  {}
);
export const IconCheckTrue = createComponent(
  React,
  'icon-check-false',
  LitIconCheckTrue,
  {}
);
export const IconCheck = createComponent(React, 'icon-check', LitIconCheck, {});
