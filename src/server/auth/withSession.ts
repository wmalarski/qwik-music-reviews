import type { Session, User } from "next-auth";
import type { DbPrismaClient } from "../db/client";
import type { RequestEventLoader } from "../types";

export type ProtectedRequestContext = {
  prisma: DbPrismaClient;
  session: Session;
  user: User;
};

const getRequestSession = async (
  event: RequestEventLoader
): Promise<Session | null> => {
  const { getServerSession } = await import("./nextAuth");
  const { authOptions } = await import("./options");

  const sessionPromise = event.sharedMap.get("session");

  if (sessionPromise) {
    return sessionPromise;
  }

  const newPromise = getServerSession(event, authOptions);
  event.sharedMap.set("session", newPromise);
  return newPromise;
};

export const withProtectedSession = <
  R extends RequestEventLoader = RequestEventLoader
>() => {
  return async (event: R) => {
    console.log("withProtectedSession", typeof window === "undefined");

    const { paths } = await import("~/utils/paths");
    const { prisma } = await import("../db/client");

    const session = await getRequestSession(event);

    if (!session || !session.user) {
      throw event.redirect(302, paths.signIn);
    }
    return { ...event, ctx: { prisma, session, user: session.user }, session };
  };
};
