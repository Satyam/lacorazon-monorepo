/// <reference path="../../types/global.d.ts" />
/// <reference path="../../types/api.d.ts" />
/// <reference path="../../types/reactIconDeclarations.d.ts" />
import { createRoot } from 'react-dom/client';
import Routes from 'components/Routes';

const root = createRoot(document.getElementById('root')!);
root.render(<Routes />);
