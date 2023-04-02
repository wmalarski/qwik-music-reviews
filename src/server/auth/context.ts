import type { Session, User } from "@auth/core/types";
import type { RequestEventCommon } from "@builder.io/qwik-city";
import { getServerSession } from "~/routes/plugin@auth";
import { paths } from "~/utils/paths";
import { prisma, type DbPrismaClient } from "../db/client";

export type ProtectedRequestContext = {
  prisma: DbPrismaClient;
  session: Session;
  user: User;
};

const getRequestSession = (
  event: RequestEventCommon
): Promise<Session | null> => {
  const sessionPromise = event.sharedMap.get("session");

  if (sessionPromise) {
    return sessionPromise;
  }

  const newPromise = getServerSession(event);
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
  event: RequestEventCommon
) => {
  const session = await getRequestSession(event);

  if (!session || !session.user) {
    return null;
  }
  return { prisma, session, user: session.user };
};
