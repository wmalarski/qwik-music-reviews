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
  schema: z.ZodObject<Q>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parser: (v: string) => any = JSON.parse
) => {
  return (event: R) => {
    const rawQuery = Object.fromEntries(event.url.searchParams.entries());

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
      throw event.response.redirect("/404");
    }

    return { ...event, query: query.data };
  };
};

// export const withTypedFormData = <
//   Q extends z.ZodRawShape = z.ZodRawShape,
//   R extends RequestEvent = RequestEvent
// >(
//   schema: z.ZodObject<Q>,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   parser: (v: string) => any = JSON.parse
// ) => {
//   return async (event: R) => {
//     const formData = await event.request.formData();

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const rawData = Array.from(formData.entries()).reduce<Record<string, any>>(
//       (prev, [key, value]) => {
//         schema.
//         if (typeof value === "string") {
//           try {
//             prev[key] = parser(value);
//           } catch (err) {
//             //
//           }
//         }
//         return prev;
//       },
//       {}
//     );

//     const query = schema?.safeParse(rawData);

//     console.log(query);

//     // if (!query.success) {
//     //   throw event.response.redirect("/404");
//     // }

//     return { ...event, formData: query };
//   };
// };
