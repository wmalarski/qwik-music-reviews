import { component$, Slot } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/auth/context";
import { findReview } from "~/server/data/review";
import { paths } from "~/utils/paths";
import { ReviewHero } from "./ReviewHero/ReviewHero";

export const useReviewLoader = loader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);

  const reviewId = event.params.reviewId;
  const review = await findReview({ ctx, id: reviewId });

  if (!review || review?.userId !== ctx.session.user?.id) {
    throw event.redirect(302, paths.home);
  }

  return review;
});

export default component$(() => {
  const resource = useReviewLoader();

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
