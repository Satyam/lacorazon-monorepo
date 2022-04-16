/// <reference path="../../types/global.d.ts" />
/// <reference path="../../types/api.d.ts" />
import { h, render } from 'preact';
import '@lacorazon/lit-form';
import App from 'components/App';
import './preactDeclarations';

render(h(App, {}), document.body);
