import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";

export const onPost = endpointBuilder()
  .use(withTypedParams(z.object({ reviewId: z.string().min(1) })))
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(async ({ trpc, params, response }) => {
    const result = await trpc.review.deleteReview({
      id: params.reviewId,
    });

    if (result.count <= 0) {
      return;
    }

    throw response.redirect(paths.reviews);
  });
