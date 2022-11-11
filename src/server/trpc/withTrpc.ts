import { RequestEvent } from "@builder.io/qwik-city";

export const withTrpc = <R extends RequestEvent = RequestEvent>() => {
  return async (event: R) => {
    const { trpcServerCaller } = await import("~/server/trpc/router");
    const { caller } = await trpcServerCaller(event);
    return { ...event, trpc: caller };
  };
};
