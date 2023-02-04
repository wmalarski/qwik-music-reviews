import { RequestEvent } from "@builder.io/qwik-city";
import type { Session, User } from "next-auth";
import { paths } from "~/utils/paths";
import { DbPrismaClient, prisma } from "../db/client";
import type { RequestEventLoader } from "../types";

export type ProtectedRequestContext = {
  prisma: DbPrismaClient;
  session: Session;
  user: User;
};

const getRequestSession = async (
  event: RequestEventLoader | RequestEvent
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

export const getProtectedRequestContext = async (
  event: RequestEventLoader | RequestEvent
) => {
  const session = await getRequestSession(event);

  if (!session || !session.user) {
    throw event.redirect(302, paths.signIn);
  }
  return { prisma, session, user: session.user };
};
