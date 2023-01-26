import { z } from "zod";
import { RequestEventLoader } from "./types";

export const withTypedParams = <
  P extends z.ZodRawShape = z.ZodRawShape,
  R extends RequestEventLoader = RequestEventLoader
>(
  schema: z.ZodObject<P>
) => {
  return (event: R) => {
    const query = schema?.safeParse(event.params);

    if (!query.success) {
      throw event.redirect(302, "/404");
    }

    return { ...event, params: query.data };
  };
};

export const withTypedQuery = <
  Q extends z.ZodRawShape = z.ZodRawShape,
  R extends RequestEventLoader = RequestEventLoader
>(
  schema: z.ZodObject<Q>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parser: (v: string) => any = JSON.parse
) => {
  return (event: R) => {
    const rawQuery = Object.fromEntries(event.url.searchParams.entries());

    // TODO: fix when string are converted to numbers by mistake
    // Try to parse any query params that might be json
    for (const key in rawQuery) {
      const value = rawQuery[key];
      if (typeof value === "string") {
        try {
          rawQuery[key] = parser(value);
        } catch (err) {
          //
        }
      }
    }

    const query = schema?.safeParse(rawQuery);

    if (!query.success) {
      throw event.redirect(302, "/404");
    }

    return { ...event, query: query.data };
  };
};
