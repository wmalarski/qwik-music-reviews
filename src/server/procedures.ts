import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import type { RequestEventLoader } from "~/server/types";
import { withTypedParams } from "~/server/withTypes";

type ProcedureBuilderResult<R extends RequestEventLoader> = {
  action: <T>(
    inner: (form: FormData, e: R) => T | Promise<T>
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
    use: (middle) => procedureBuilderInner(async (e) => middle(await h(e))),
  };
};

export const procedureBuilder =
  (): ProcedureBuilderResult<RequestEventLoader> => {
    return {
      action: (inner) => inner,
      loader: (inner) => inner,
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
