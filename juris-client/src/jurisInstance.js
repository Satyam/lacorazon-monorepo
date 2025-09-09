/// <reference path="../../types/global.d.ts" />

import { Juris } from 'juris';
import { HeadlessManager } from 'juris/juris-headless.js';

export const juris = new Juris({
  states: {
    user: {
      name: null,
      email: null,
    },
    title: '??',
    url: { service: '/' },
    app: {
      error: null,
    },
  },
  features: {
    headless: HeadlessManager,
  },
  layout: {
    div: {
      children: [
        // Modals: the come and go
        { Loading: {} },
        { ErrorBoundary: {} },
        { ConfirmDelete: {} },
        // end Modals

        { NavBar: {} },
        { Routes: {} },
      ],
    },
  },
});

export const myRegisterComponent = (name, componentFn) => {
  juris.registerComponent(name, componentFn);
  return Object.defineProperty(componentFn, 'name', {
    value: name,
    writable: false,
  });
};

export default juris;
