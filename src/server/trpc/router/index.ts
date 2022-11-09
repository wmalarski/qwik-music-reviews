import { RequestEvent } from "@builder.io/qwik-city";
import { createContext } from "../context";
import { t } from "../trpc";
import { albumRouter } from "./album";

export const appRouter = t.router({
  album: albumRouter,
});

export const trpcServerCaller = async (ev: RequestEvent) => {
  const context = await createContext(ev);
  const caller = appRouter.createCaller(context);
  return { caller, context };
};

export type AppRouter = typeof appRouter;
