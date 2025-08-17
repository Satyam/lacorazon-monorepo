/// <reference path="../types/global.d.ts" />

import Juris from 'juris';
import Navigation from './headless/Navigation';
import Routes from './Routes';
import DataFetch from './headless/DataFetch';
import NavBar from './components/NavBar';
import { Home } from './pages/Home';

const app = new Juris({
  states: {},
  headlessComponents: {
    Navigation,
    DataFetch,
  },
  components: {
    Routes,
    NavBar,
    // actual pages
    Home,
  },

  layout: {
    div: {
      children: [{ NavBar: {} }, { Routes: {} }],
    },
  },
});

// Render to page
app.render('#container');
