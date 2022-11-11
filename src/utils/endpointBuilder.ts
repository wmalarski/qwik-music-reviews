import { RequestEvent } from "@builder.io/qwik-city";

type HandlerBuilderResult<R extends RequestEvent> = {
  query: <T>(
    inner: (e: R) => T | Promise<T>
  ) => (e: RequestEvent) => T | Promise<T>;
  use: <N extends R>(
    middleware: (r: R) => N | Promise<N>
  ) => HandlerBuilderResult<N>;
};

const handlerBuilderInner = <R extends RequestEvent = RequestEvent>(
  h: (e: RequestEvent) => R | Promise<R>
): HandlerBuilderResult<R> => {
  return {
    query: (inner) => async (e) => inner(await h(e)),
    use: (middle) => handlerBuilderInner(async (e) => middle(await h(e))),
  };
};

export const endpointBuilder = (): HandlerBuilderResult<RequestEvent> => {
  return {
    query: (inner) => inner,
    use: (middle) => handlerBuilderInner((e) => middle(e)),
  };
};
