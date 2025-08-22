/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Provider } from "react-redux";
import store from "./store/store";

export default function Providers({ children }:any) {
  return <Provider store={store}>{children}</Provider>;
}
