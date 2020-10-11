import { StoreonModule } from "storeon";

/**
 * Router key on store
 */
export const routerKey: unique symbol;

/**
 * Event changes a path
 */
export const routerChanged: unique symbol;

/**
 * Navigate event
 */
export const routerNavigate: unique symbol;

export type RouterRecordState<MatchParameters> = {
  match: MatchParameters | false;
  path: string;
  params: string[];
};

export type RouterState<MatchParameters> = {
  [routerKey]: RouterRecordState<MatchParameters>;
};

export type RouterEvents<MatchParameters> = {
  [routerChanged]: RouterRecordState<MatchParameters>;
  [routerNavigate]: string;
};

export type Path = string | RegExp;
export type Callback<MatchParameters> = (
  ...properties: string[]
) => MatchParameters;
export type Route<MatchParameter> = [Path, Callback<MatchParameter>];

export function createRouter<MatchParameter>(
  routes: Route<MatchParameter>[],
): StoreonModule<RouterState<MatchParameter>, RouterEvents<MatchParameter>>;
