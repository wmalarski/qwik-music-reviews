import { z } from "zod";
import { protectedProcedure, t } from "../trpc";

export const reviewRouter = t.router({
  countReviewsByDate: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.$queryRaw<{ count: number; date: Date }[]>`
      SELECT DATE_TRUNC('day', "createdAt") as date, count(id) 
      FROM "public"."Review" 
      WHERE "createdAt" > CURRENT_DATE - INTERVAL '1 year' AND "userId" = ${ctx.userId} 
      GROUP BY DATE_TRUNC('day', "createdAt") 
      ORDER BY DATE_TRUNC('day', "createdAt") DESC
  `;

    return result.map((entry) => ({
      count: Number(entry.count),
      date: entry.date.toISOString(),
    }));
  }),
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
  findReview: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.review.findFirst({
        include: { album: { include: { artist: true } } },
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
