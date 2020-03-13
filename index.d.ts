import { StoreonModule } from "storeon";

interface Callback {
  (...props: string[]): Object;
}

type Route = [string|RegExp, Callback];

export declare module StoreonRouter {
  export const key: unique symbol;
  export const changed: unique symbol;
  export const navigate: unique symbol;

  export function createRouter<State = unknown>(routes: Route[]): StoreonModule<State>;
}
