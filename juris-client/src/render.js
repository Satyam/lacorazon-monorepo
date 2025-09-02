import juris from '@src/juris.js';

juris.headlessManager.initializeQueued();

import '@components/Loading.js';
import '@components/ErrorBoundary.js';
import '@components/NavBar.js';
import '@components/Routes.js';

juris.render('#container');
