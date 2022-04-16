declare module '*.html';

type HandlerReturn<RParams, SearchOpts extends any = {}> = {
  render: (r: RParams, s?: SearchOpts) => void;
  close: () => void;
};
type Handler<RParams, SearchOpts extends any = {}> = (
  el?: HTMLElement
) => HandlerReturn<RParams, SearchOpts>;

type Route<RParams, SearchOpts extends any = {}> = {
  path: string;
  module: HandlerReturn<RParams, SearchOpts>;
  heading?: string;
  $_rx?: RegExp;
};
