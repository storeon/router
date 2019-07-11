import Storeon = require("storeon");

interface Callback {
  (...props: string[]): Object
}

type Route = [string|RegExp, Callback]

declare module StoreonRouter {
  export const key: unique symbol;
  export const changed: unique symbol;
  export const navigate: unique symbol;

  export function createRouter<State = unknown>(routes: Route[]): Storeon.Module<State>;
}

export = StoreonRouter
