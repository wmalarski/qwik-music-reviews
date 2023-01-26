import { component$, Slot } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { protectedReviewProcedure } from "~/server/procedures";
import { findReview } from "~/server/review";
import { paths } from "~/utils/paths";
import { ReviewHero } from "./ReviewHero/ReviewHero";

export const reviewLoader = loader$(
  protectedReviewProcedure.loader(async (event) => {
    const reviewId = event.typedParams.reviewId;
    const review = await findReview({ ctx: event.ctx, id: reviewId });

    if (!review || review?.userId !== event.session.user?.id) {
      throw event.redirect(302, paths.home);
    }

    return review;
  })
);

export default component$(() => {
  const resource = reviewLoader.use();

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
