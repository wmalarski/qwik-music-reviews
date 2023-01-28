import type { Session, User } from "next-auth";
import type { RequestEventLoader } from "~/server/types";
import { paths } from "~/utils/paths";
import { prisma } from "../db/client";
import { getServerSession } from "./nextAuth";
import { authOptions } from "./options";

export type ProtectedRequestContext = {
  prisma: typeof prisma;
  session: Session;
  user: User;
};

const getRequestSession = (
  event: RequestEventLoader
): Promise<Session | null> => {
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
    const session = await getRequestSession(event);

    if (!session || !session.user) {
      throw event.redirect(302, paths.signIn);
    }
    return { ...event, ctx: { prisma, session, user: session.user }, session };
  };
};
