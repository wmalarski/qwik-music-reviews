import type { RequestEventLoader } from "~/server/types";
import { paths } from "~/utils/paths";
import { prisma } from "../db/client";
import { getServerSession } from "./auth";
import { authOptions } from "./options";

type WithProtectedSessionOptions = {
  redirectTo?: string;
};

export const withProtectedSession = <
  R extends RequestEventLoader = RequestEventLoader
>(
  options: WithProtectedSessionOptions = {}
) => {
  return async (event: R) => {
    const session = await getServerSession(event, authOptions);

    if (!session || !session.user) {
      throw event.redirect(302, options.redirectTo || paths.signIn);
    }
    return { ...event, ctx: { prisma, session, user: session.user }, session };
  };
};
