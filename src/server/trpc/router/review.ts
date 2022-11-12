import { z } from "zod";
import { protectedProcedure, t } from "../trpc";

export const reviewRouter = t.router({
  createReview: protectedProcedure
    .input(
      z.object({
        albumId: z.string(),
        rate: z.number().min(0).max(10),
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.review.create({
        data: { ...input, userId: ctx.userId },
      });
    }),
  deleteReview: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.review.deleteMany({
        where: { id: input.id, userId: ctx.userId },
      });
    }),
  findReviews: protectedProcedure
    .input(
      z.object({
        skip: z.number().step(1).optional().default(0),
        take: z.number().min(0).max(50).step(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const [reviews, count] = await Promise.all([
        ctx.prisma.review.findMany({
          include: { album: { include: { artist: true } } },
          orderBy: { createdAt: "desc" },
          skip: input.skip,
          take: input.take,
          where: { userId: ctx.userId },
        }),
        ctx.prisma.review.count({
          where: { userId: ctx.userId },
        }),
      ]);
      return { count, reviews };
    }),
  updateReview: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        rate: z.number().min(0).max(10).optional(),
        text: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.review.updateMany({
        data: {
          ...(input.text ? { text: input.text } : {}),
          ...(input.rate || input.rate === 0 ? { rate: input.rate } : {}),
        },
        where: { id: input.id, userId: ctx.userId },
      });
    }),
});
