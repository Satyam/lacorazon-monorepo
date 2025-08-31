/// <reference path="../types/global.d.ts" />

import { Juris } from 'juris';
import { HeadlessManager } from 'juris/juris-headless';

window.juris = new Juris({
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
        { Loading: {} },
        { ErrorBoundary: {} },
        { NavBar: {} },
        { Routes: {} },
      ],
    },
  },
});
