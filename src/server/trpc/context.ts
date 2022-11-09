import { RequestEvent } from "@builder.io/qwik-city";
import * as trpc from "@trpc/server";
import type { Session } from "next-auth";

type CreateContextOptions = {
  session?: Session | null;
};

export const createContextInner = (opts: CreateContextOptions) => {
  return { session: opts.session };
};

export const createContext = async (ev: RequestEvent) => {
  const { getServerSession } = await import("../auth/auth");
  const { authOptions } = await import("../auth/options");

  const session = await getServerSession(ev, authOptions);

  return createContextInner({ session });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
