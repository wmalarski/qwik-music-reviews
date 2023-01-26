import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead } from "@builder.io/qwik-city";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { protectedReviewProcedure } from "~/server/procedures";
import { updateReview } from "~/server/review";
import { paths } from "~/utils/paths";
import { reviewLoader } from "../layout";

export const updateReviewAction = action$(
  protectedReviewProcedure.action(async (form, event) => {
    const rate = form.get("rate");
    const text = form.get("text");

    await updateReview({
      ctx: event.ctx,
      id: event.typedParams.reviewId,
      rate: rate ? +rate : undefined,
      text: text ? (text as string) : undefined,
    });

    throw event.redirect(302, paths.reviews);
  })
);

export default component$(() => {
  const reviewResource = reviewLoader.use();
  const updateReview = updateReviewAction.use();

  return (
    <div class="p-8 flex flex-col gap-4">
      <h2 class="text-xl">Edit review</h2>
      {reviewResource.value ? (
        <ReviewForm action={updateReview} initialValue={reviewResource.value} />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Edit Review - Qwik Album Review",
};
