import { action$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";

export const deleteReviewAction = action$(
  endpointBuilder()
    .use(withTypedParams(z.object({ reviewId: z.string().min(1) })))
    .use(withProtectedSession())
    .use(withTrpc())
    .action(async (_form, event) => {
      const result = await event.trpc.review.deleteReview({
        id: event.params.reviewId,
      });

      if (result.count <= 0) {
        return;
      }

      throw event.redirect(302, paths.reviews);
    })
);
