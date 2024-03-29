import type {
  RequestEventBase,
  RequestEventCommon,
} from "@builder.io/qwik-city";
import type { Session, User } from "next-auth";
import { paths } from "~/utils/paths";
import { prisma, type DbPrismaClient } from "../db/client";

export type ProtectedRequestContext = {
  prisma: DbPrismaClient;
  session: Session;
  user: User;
};

const getRequestSession = async (
  event: RequestEventBase
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

export const getProtectedRequestContext = async (event: RequestEventCommon) => {
  const session = await getRequestSession(event);

  if (!session || !session.user) {
    throw event.redirect(302, paths.signIn);
  }
  return { prisma, session, user: session.user };
};

export const getNullableProtectedRequestContext = async (
  event: RequestEventBase
) => {
  const session = await getRequestSession(event);

  if (!session || !session.user) {
    return null;
  }
  return { prisma, session, user: session.user };
};
