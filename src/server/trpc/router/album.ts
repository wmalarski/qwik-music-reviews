import { protectedProcedure, t } from "../trpc";

export const albumRouter = t.router({
  findRandom: protectedProcedure.query(() => {
    return "random";
  }),
});
