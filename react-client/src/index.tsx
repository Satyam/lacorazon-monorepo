/// <reference path="../../types/global.d.ts" />
/// <reference path="../../types/api.d.ts" />
import { createRoot } from 'react-dom/client';
import '@lacorazon/lit-form';
import Routes from 'components/Routes';
import './reactDeclarations';

const root = createRoot(document.getElementById('root')!);
root.render(<Routes />);
