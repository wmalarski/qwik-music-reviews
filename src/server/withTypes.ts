import { z } from "zod";
import { RequestEventLoader } from "../utils/types";

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

    return { ...event, typedParams: query.data };
  };
};

export const withTypedQuery = <
  Q extends z.ZodRawShape = z.ZodRawShape,
  R extends RequestEventLoader = RequestEventLoader
>(
  schema: z.ZodObject<Q>
) => {
  return (event: R) => {
    const rawQuery = Object.fromEntries(event.url.searchParams.entries());

    const query = schema?.safeParse(rawQuery);

    if (!query.success) {
      throw event.redirect(302, "/404");
    }

    return { ...event, query: query.data };
  };
};
