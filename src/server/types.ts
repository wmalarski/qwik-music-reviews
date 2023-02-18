/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action } from "@builder.io/qwik-city";

export type AsyncReturnValue<T> = T extends (...arg: any) => Promise<infer R>
  ? R
  : never;

export type ActionInput<T> = T extends Action<any, infer B, any> ? B : never;
