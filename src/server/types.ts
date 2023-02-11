/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action, RequestEvent } from "@builder.io/qwik-city";
import type {
  RequestEventAction,
  RequestEventLoader,
} from "@builder.io/qwik-city/middleware/request-handler";

export type AsyncReturnValue<T> = T extends (...arg: any) => Promise<infer R>
  ? R
  : never;

export type ServerEvent =
  | RequestEventLoader
  | RequestEvent
  | RequestEventAction;

export type ActionInput<T> = T extends Action<any, infer B, any> ? B : never;
