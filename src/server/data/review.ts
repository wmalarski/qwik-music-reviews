import type { ProtectedRequestContext } from "~/server/auth/context";

type CountReviewsByDate = {
  ctx: ProtectedRequestContext;
};

export const countReviewsByDate = async ({ ctx }: CountReviewsByDate) => {
  const result = await ctx.prisma.$queryRaw<{ count: number; date: Date }[]>`
    SELECT DATE_TRUNC('day', "createdAt") as date, count(id) 
    FROM "public"."Review" 
    WHERE "createdAt" > CURRENT_DATE - INTERVAL '1 year' AND "userId" = ${ctx.user.id} 
    GROUP BY DATE_TRUNC('day', "createdAt") 
    ORDER BY DATE_TRUNC('day', "createdAt") DESC
`;

  return result.map((entry) => ({
    count: Number(entry.count),
    date: entry.date.toISOString(),
  }));
};

type CreateReview = {
  ctx: ProtectedRequestContext;
  albumId: string;
  rate: number;
  text: string;
};

export const createReview = async ({
  ctx,
  albumId,
  rate,
  text,
}: CreateReview) => {
  const result = await ctx.prisma.review.create({
    data: { albumId, rate, text, userId: ctx.user.id },
  });
  return result;
};

type DeleteReview = {
  ctx: ProtectedRequestContext;
  id: string;
};

export const deleteReview = ({ ctx, id }: DeleteReview) => {
  return ctx.prisma.review.deleteMany({
    where: { id, userId: ctx.user.id },
  });
};

type FindReview = {
  ctx: ProtectedRequestContext;
  id: string;
};

export const findReview = async ({ ctx, id }: FindReview) => {
  const result = await ctx.prisma.review.findFirst({
    include: { album: { include: { artist: true } } },
    where: { id, userId: ctx.user.id },
  });
  return result;
};

type FindReviews = {
  ctx: ProtectedRequestContext;
  skip: number;
  take: number;
};

export const findReviews = async ({ ctx, skip, take }: FindReviews) => {
  const [reviews, count] = await Promise.all([
    ctx.prisma.review.findMany({
      include: { album: { include: { artist: true } } },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
      where: { userId: ctx.user.id },
    }),
    ctx.prisma.review.count({
      where: { userId: ctx.user.id },
    }),
  ]);
  return { count, reviews };
};

type UpdateReview = {
  ctx: ProtectedRequestContext;
  id: string;
  rate?: number;
  text?: string;
};

export const updateReview = ({ ctx, id, rate, text }: UpdateReview) => {
  return ctx.prisma.review.updateMany({
    data: {
      ...(text ? { text } : {}),
      ...(rate || rate === 0 ? { rate } : {}),
    },
    where: { id, userId: ctx.user.id },
  });
};
