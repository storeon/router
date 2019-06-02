import Storeon = require("storeon");

interface Callback {
  (...props: string[]): Object
}

type Route = [string|RegExp, Callback]

declare module StoreonRouter {
  export const key: symbol;
  export const changed: symbol;
  export const navigate: symbol;

  export function createRouter<State = unknown>(routes: Route[]): Storeon.Module<State>;
}

export = StoreonRouter
