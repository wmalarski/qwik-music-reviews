import { z } from "zod";
import type { DbPrismaClient } from "~/server/db/client";
import { protectedProcedure, t } from "../trpc";

const addReviewCounts = async <T extends { id: string }>(
  prisma: DbPrismaClient,
  albums: T[],
  userId: string
) => {
  const albumIds = albums.map((album) => album.id);

  const groups = await prisma.review.groupBy({
    _avg: { rate: true },
    _count: { albumId: true },
    by: ["albumId"],
    having: { albumId: { in: albumIds } },
    where: { userId },
  });

  const counts = groups.reduce<Record<string, number>>((prev, curr) => {
    prev[curr.albumId] = curr._count.albumId;
    return prev;
  }, {});

  const averages = groups.reduce<Record<string, number>>((prev, curr) => {
    prev[curr.albumId] = curr._avg.rate || 0;
    return prev;
  }, {});

  return albums.map((album) => ({
    ...album,
    avg: averages[album.id] || 0,
    reviews: counts[album.id] || 0,
  }));
};

export const albumRouter = t.router({
  deleteAlbum: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.album.deleteMany({
        where: { id: input.id, userId: ctx.userId },
      });
    }),
  findAlbum: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const album = await ctx.prisma.album.findFirst({
        include: { artist: true, reviews: true },
        where: { id: input.id },
      });

      if (!album) {
        return { album: null, albums: [], reviews: [] };
      }

      const [albums, reviews] = await Promise.all([
        ctx.prisma.album.findMany({
          where: { artistId: album.artistId },
        }),
        ctx.prisma.review.findMany({
          where: { album: { artistId: album.artistId }, userId: ctx.userId },
        }),
      ]);

      const counts = reviews.reduce<Record<string, number>>((prev, curr) => {
        const count = prev[curr.albumId] || 0;
        prev[curr.albumId] = count + 1;
        return prev;
      }, {});

      const withCounts = albums.map((album) => ({
        ...album,
        avg: 0,
        reviews: counts[album.id] || 0,
      }));

      return { album, albums: withCounts, reviews };
    }),
  findAlbums: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        skip: z.number().step(1).optional().default(0),
        take: z.number().min(0).max(50).step(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const [albums, count] = await Promise.all([
        ctx.prisma.album.findMany({
          include: { artist: true },
          orderBy: { createdAt: "desc" },
          skip: input.skip || 0,
          take: input.take,
          where: {
            OR: [
              { title: { contains: input.query } },
              { artist: { name: { contains: input.query } } },
            ],
          },
        }),
        ctx.prisma.album.count({
          where: {
            OR: [
              { title: { contains: input.query } },
              { artist: { name: { contains: input.query } } },
            ],
          },
        }),
      ]);

      const albumsWithCounts = await addReviewCounts(
        ctx.prisma,
        albums,
        ctx.userId
      );

      return { albums: albumsWithCounts, count };
    }),
  findRandom: protectedProcedure
    .input(z.object({ take: z.number().min(0).max(50) }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.$queryRaw<{ id: string }[]>`
        select "Album".id from "Album" 
        left join "Review" on "Album".id = "Review"."albumId" 
        where "Review".id is NULL or "Review"."userId" != ${ctx.userId}
        order by random()
        LIMIT ${input.take};
      `;

      const ids = result.map((entry) => entry.id);

      const albums = await ctx.prisma.album.findMany({
        include: { artist: true },
        where: { id: { in: ids } },
      });

      const withReviews = albums.map((album) => ({
        ...album,
        avg: 0,
        reviews: 0,
      }));

      return { albums: withReviews };
    }),
  updateAlbum: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        year: z.number().min(0).max(2100).step(1).optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.album.updateMany({
        data: {
          ...(input.title ? { title: input.title } : {}),
          ...(input.year || input.year === 0 ? { year: input.year } : {}),
        },
        where: { id: input.id, userId: ctx.userId },
      });
    }),
});
