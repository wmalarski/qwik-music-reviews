import { RequestEvent } from "@builder.io/qwik-city";
import { z } from "zod";

export const withTypedParams = <
  P extends z.ZodRawShape = z.ZodRawShape,
  R extends RequestEvent = RequestEvent
>(
  schema: z.ZodObject<P>
) => {
  return (event: R) => {
    const query = schema?.safeParse(event.params);

    if (!query.success) {
      throw event.response.redirect("/404");
    }

    return { ...event, params: query.data };
  };
};

export const withTypedQuery = <
  Q extends z.ZodRawShape = z.ZodRawShape,
  R extends RequestEvent = RequestEvent
>(
  schema: z.ZodObject<Q>
) => {
  return (event: R) => {
    const rawQuery = Object.fromEntries(event.url.searchParams.entries());
    const query = schema?.safeParse(rawQuery);

    if (!query.success) {
      throw event.response.redirect("/404");
    }

    return { ...event, query: query.data };
  };
};
