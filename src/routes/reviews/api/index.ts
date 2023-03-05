import type { RequestHandler } from "@builder.io/qwik-city";
import { z } from "zod";
import { getProtectedRequestContext } from "~/server/auth/context";
import { findReviews } from "~/server/data/review";

export const onGet: RequestHandler = async (event) => {
  const ctx = await getProtectedRequestContext(event);

  const entries = Object.fromEntries(event.url.searchParams.entries());

  const parsed = z
    .object({
      skip: z.coerce.number().int().min(0).default(0),
      take: z.coerce.number().int().min(0).max(100).default(20),
    })
    .safeParse(entries);

  if (!parsed.success) {
    event.json(200, {
      message: parsed.error.message,
      status: "invalid" as const,
    });
    return;
  }

  const result = await findReviews({
    ctx,
    skip: parsed.data.skip,
    take: parsed.data.take,
  });

  event.json(200, { status: "success" as const, ...result });
};
