import { type RouteObject } from "react-router";
import { IndexPage } from "./indexPage";

export const routes: RouteObject[] = [
  // wrap.
  { path: "/", Component: () => <IndexPage /> },
];
