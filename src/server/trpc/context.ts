import { RequestEvent } from "@builder.io/qwik-city";
import * as trpc from "@trpc/server";
import type { Session } from "next-auth";
import { getServerSession } from "../auth/auth";
import { authOptions } from "../auth/options";
import { prisma } from "../db/client";

type CreateContextOptions = {
  session?: Session | null;
};

export const createContextInner = (opts: CreateContextOptions) => {
  return { prisma, session: opts.session };
};

export const createContext = async (ev: RequestEvent) => {
  const session = await getServerSession(ev, authOptions);

  return createContextInner({ session });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
