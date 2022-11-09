import { z } from "zod";
import { protectedProcedure, t } from "../trpc";

export const albumRouter = t.router({
  deleteAlbum: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(() => {
      //
    }),
  findAlbum: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(() => {
      return "findAlbum";
    }),
  findAlbums: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        skip: z.number().step(1).optional().default(0),
        take: z.number().min(0).max(50).step(1),
      })
    )
    .query(() => {
      return "findAlbums";
    }),
  findRandom: protectedProcedure.query(() => {
    return "random";
  }),
  updateAlbum: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        year: z.number().min(0).max(2100).step(1).optional(),
      })
    )
    .mutation(() => {
      //
    }),
});
