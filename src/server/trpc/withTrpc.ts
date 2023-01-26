import { Session } from "next-auth";
import type { RequestEventLoader } from "~/utils/types";
import { prisma } from "../db/client";

type RequestEventWithSession = RequestEventLoader & { session: Session | null };

export const withTrpc = <
  R extends RequestEventWithSession = RequestEventWithSession
>() => {
  return async (event: R) => {
    const { appRouter } = await import("~/server/trpc/router");
    const trpc = appRouter.createCaller({ prisma, session: event.session });
    return { ...event, trpc };
  };
};
