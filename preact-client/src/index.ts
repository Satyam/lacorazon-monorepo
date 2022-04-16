/// <reference path="../../types/global.d.ts" />
import { h, render } from 'preact';
import '@lacorazon/lit-form';
import App from 'components/App';
import './preactDeclarations';

render(h(App, {}), document.body);
