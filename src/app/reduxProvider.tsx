"use client";

import { store } from "../store/store";
import { Provider } from "react-redux";
import React,{ ReactNode } from "react";

export default function ReduxProviders({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
