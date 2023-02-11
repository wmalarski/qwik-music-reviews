/* eslint-disable @typescript-eslint/no-explicit-any */
import type { loader$, RequestEvent } from "@builder.io/qwik-city";
import type {
  RequestEventAction,
  RequestEventLoader,
} from "@builder.io/qwik-city/middleware/request-handler";

export type LoaderParameter = Parameters<typeof loader$>[0];
export type ServerLoader<T> = ReturnType<typeof loader$<unknown, T>>;

export type LoaderValue<T> = T extends ServerLoader<infer D> ? D : never;

export type AsyncReturnValue<T> = T extends (...arg: any) => Promise<infer R>
  ? R
  : never;

export type ServerEvent =
  | RequestEventLoader
  | RequestEvent
  | RequestEventAction;
