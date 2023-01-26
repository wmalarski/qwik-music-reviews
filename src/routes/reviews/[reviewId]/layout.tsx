import { component$, Slot } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { useReviewContextProvider } from "./context";
import { ReviewHero } from "./ReviewHero/ReviewHero";

export const reviewLoader = loader$(
  endpointBuilder()
    .use(withTypedParams(z.object({ reviewId: z.string().min(1) })))
    .use(withProtectedSession())
    .use(withTrpc())
    .loader(async (event) => {
      const reviewId = event.params.reviewId;
      const review = await event.trpc.review.findReview({ id: reviewId });

      if (!review || review?.userId !== event.session.user?.id) {
        throw event.redirect(302, paths.home);
      }

      return review;
    })
);

export default component$(() => {
  const resource = reviewLoader.use();
  useReviewContextProvider(resource);

  return (
    <div class="flex flex-col">
      <ReviewHero review={resource.value} />
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Review - Qwik Album Review",
};
