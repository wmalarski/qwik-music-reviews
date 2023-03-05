import type { RequestHandler } from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/auth/context";
import { findRandom } from "~/server/data/album";

export const onGet: RequestHandler = async (event) => {
  const ctx = await getProtectedRequestContext(event);
  const result = await findRandom({ ctx, take: 20 });
  event.json(200, result);
};
