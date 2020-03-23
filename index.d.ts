import { StoreonModule } from "storeon";

export type Path = string | RegExp;
export type Callback = (...props: string[]) => unknown;
export type Route = [Path, Callback];

export function createRouter<State = unknown>(routes: Route[]): StoreonModule<State>;

export const routerKey: unique symbol;
export const routerChanged: unique symbol;
export const routerNavigate: unique symbol;
