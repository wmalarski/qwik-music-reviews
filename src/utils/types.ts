import { loader$ } from "@builder.io/qwik-city";

export type LoaderParameter = Parameters<typeof loader$>[0];
export type ServerLoader<T> = ReturnType<typeof loader$<unknown, T>>;

export type RequestEventLoader = Parameters<LoaderParameter>[0];

export type LoaderValue<T> = T extends ServerLoader<infer D> ? D : never;