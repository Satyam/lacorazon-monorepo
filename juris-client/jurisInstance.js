/// <reference path="../types/global.d.ts" />

import Juris from 'juris';

window.juris = new Juris({
  logLevel: 'debug',
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
    // app: {
    //   error: {
    //     message: 'event.error.message',
    //     stack: 'event.error.stack',
    //     timestamp: Date.now(),
    //     type: 'my type',
    //   },
    // },
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
