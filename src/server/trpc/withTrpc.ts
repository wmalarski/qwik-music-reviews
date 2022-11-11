import { RequestEvent } from "@builder.io/qwik-city";
import { Session } from "next-auth";

type RequestEventWithSession = RequestEvent & { session: Session | null };

export const withTrpc = <
  R extends RequestEventWithSession = RequestEventWithSession
>() => {
  return async (event: R) => {
    const { appRouter } = await import("~/server/trpc/router");
    const trpc = appRouter.createCaller({ session: event.session });
    return { ...event, trpc };
  };
};
