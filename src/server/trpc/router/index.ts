import { t } from "../trpc";
import { albumRouter } from "./album";

export const appRouter = t.router({
  album: albumRouter,
});

export type AppRouter = typeof appRouter;
