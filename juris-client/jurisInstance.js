/// <reference path="../types/global.d.ts" />

import Juris from 'juris';

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
