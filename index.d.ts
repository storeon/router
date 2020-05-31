import { StoreonModule } from "storeon";

declare namespace createRouter{
  export type RoutesState<MatchParams> = {
    [routerKey]: {
      match: MatchParams | boolean,
      path: string,
      params: string[],
    }
  }
}

export type Path = string | RegExp;
export type Callback<MatchParams> = (...props: string[]) => MatchParams;
export type Route<MatchParam> = [Path, Callback<MatchParam>];

export function createRouter<MatchParam>(routes: Route<MatchParam>[]): StoreonModule<createRouter.RoutesState<MatchParam>>;

export const routerKey: unique symbol;
export const routerChanged: unique symbol;
export const routerNavigate: unique symbol;
