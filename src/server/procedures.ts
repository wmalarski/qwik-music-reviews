import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import type { RequestEventLoader } from "~/server/types";
import { withTypedParams } from "~/server/withTypes";
import { paths } from "~/utils/paths";

type ProcedureBuilderResult<R extends RequestEventLoader> = {
  action: <T>(
    inner: (form: FormData, e: R) => T | Promise<T>
  ) => (form: FormData, e: RequestEventLoader) => T | Promise<T>;
  typedAction: <T, P extends z.ZodRawShape = z.ZodRawShape>(
    schema: z.ZodObject<P>,
    inner: (form: z.infer<z.ZodObject<P>>, e: R) => T | Promise<T>
  ) => (form: FormData, e: RequestEventLoader) => T | Promise<T>;
  loader: <T>(
    inner: (e: R) => T | Promise<T>
  ) => (e: RequestEventLoader) => T | Promise<T>;
  use: <N extends R>(
    middleware: (r: R) => N | Promise<N>
  ) => ProcedureBuilderResult<N>;
};

const procedureBuilderInner = <
  R extends RequestEventLoader = RequestEventLoader
>(
  h: (e: RequestEventLoader) => R | Promise<R>
): ProcedureBuilderResult<R> => {
  return {
    action: (inner) => async (f, e) => inner(f, await h(e)),
    loader: (inner) => async (e) => inner(await h(e)),
    typedAction: (schema, inner) => async (f, e) => {
      const entries = Object.fromEntries(f.entries());
      const parsed = schema.safeParse(entries);
      if (!parsed.success) {
        throw e.redirect(302, paths.notFound);
      }
      return inner(parsed.data, await h(e));
    },
    use: (middle) => procedureBuilderInner(async (e) => middle(await h(e))),
  };
};

export const procedureBuilder =
  (): ProcedureBuilderResult<RequestEventLoader> => {
    return {
      action: (inner) => inner,
      loader: (inner) => inner,
      typedAction: (schema, inner) => (f, e) => {
        const entries = Object.fromEntries(f.entries());
        const parsed = schema.safeParse(entries);
        if (!parsed.success) {
          throw e.redirect(302, paths.notFound);
        }
        return inner(parsed.data, e);
      },
      use: (middle) => procedureBuilderInner((e) => middle(e)),
    };
  };

export const protectedProcedure = procedureBuilder().use(
  withProtectedSession()
);

export const protectedAlbumProcedure = procedureBuilder()
  .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
  .use(withProtectedSession());

export const protectedReviewProcedure = procedureBuilder()
  .use(withTypedParams(z.object({ reviewId: z.string().min(1) })))
  .use(withProtectedSession());
