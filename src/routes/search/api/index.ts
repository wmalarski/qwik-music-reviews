import type { RequestHandler } from "@builder.io/qwik-city";
import { z } from "zod";
import { getProtectedRequestContext } from "~/server/auth/context";
import { findAlbums } from "~/server/data/album";

export const onGet: RequestHandler = async (event) => {
  const ctx = await getProtectedRequestContext(event);

  const entries = Object.fromEntries(event.url.searchParams.entries());

  const parsed = z
    .object({
      page: z.coerce.number().min(0).int().default(0),
      query: z.string().default(""),
    })
    .safeParse(entries);

  if (!parsed.success) {
    event.json(200, {
      message: parsed.error.message,
      status: "invalid" as const,
    });
    return;
  }

  const result = await findAlbums({
    ctx,
    query: parsed.data.query,
    skip: parsed.data.page * 20,
    take: 20,
  });

  event.json(200, { status: "success" as const, ...result });
};
