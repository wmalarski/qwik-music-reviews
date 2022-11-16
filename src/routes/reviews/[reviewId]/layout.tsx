import { component$, Resource, Slot } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewHero } from "~/modules/ReviewHero/ReviewHero";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { useReviewContextProvider } from "./context";

export const onGet = endpointBuilder()
  .use(withTypedParams(z.object({ reviewId: z.string().min(1) })))
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(async ({ trpc, params, session, response }) => {
    const review = await trpc.review.findReview({ id: params.reviewId });

    if (review?.userId !== session.user?.id) {
      throw response.redirect(paths.home);
    }

    return review;
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();
  useReviewContextProvider(resource);

  return (
    <div class="flex flex-col">
      <Resource
        value={resource}
        onResolved={(data) => <ReviewHero review={data} />}
      />
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Review - Qwik Album Review",
};
