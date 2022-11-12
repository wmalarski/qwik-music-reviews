import { t } from "../trpc";
import { albumRouter } from "./album";
import { reviewRouter } from "./review";

export const appRouter = t.router({
  album: albumRouter,
  review: reviewRouter,
});

export type AppRouter = typeof appRouter;
