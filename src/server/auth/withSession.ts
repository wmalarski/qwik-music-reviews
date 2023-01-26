import { paths } from "~/utils/paths";
import type { RequestEventLoader } from "~/utils/types";
import { prisma } from "../db/client";

export const withSession = <
  R extends RequestEventLoader = RequestEventLoader
>() => {
  return async (event: R) => {
    const { getServerSession } = await import("./auth");
    const { authOptions } = await import("./options");

    const session = await getServerSession(event, authOptions);

    return { ...event, session };
  };
};

type WithProtectedSessionOptions = {
  redirectTo?: string;
};

export const withProtectedSession = <
  R extends RequestEventLoader = RequestEventLoader
>(
  options: WithProtectedSessionOptions = {}
) => {
  return async (event: R) => {
    const { getServerSession } = await import("./auth");
    const { authOptions } = await import("./options");

    const session = await getServerSession(event, authOptions);

    if (!session || !session.user) {
      throw event.redirect(302, options.redirectTo || paths.signIn);
    }
    return { ...event, ctx: { prisma, session, user: session.user }, session };
  };
};
